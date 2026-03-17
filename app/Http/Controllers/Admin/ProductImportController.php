<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ProductImportController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->query('token');

        if ($token) {
            $path = Cache::get($this->cacheKey($token));
            if ($path) {
                $rows = $this->readRows($path, 'local');
                $preview = $this->buildPreview($rows);

                return Inertia::render('Admin/Products/Import', [
                    'token' => $token,
                    'preview' => $preview,
                ]);
            }
        }

        return Inertia::render('Admin/Products/Import', [
            'token' => null,
            'preview' => null,
        ]);
    }

    public function template()
    {
        $headers = [
            'name',
            'slug',
            'description',
            'category',
            'brand',
            'purchase_price',
            'sale_price',
            'stock',
            'is_preorder',
            'has_discount',
            'discount_type',
            'discount_value',
            'images',
            'variations',
        ];

        $example = [
            'Sample Product',
            'sample-product',
            'Short description here',
            'Electronics',
            'Acme',
            '100',
            '150',
            '50',
            '0',
            '0',
            '',
            '',
            'https://example.com/img1.jpg|https://example.com/img2.jpg',
            'Color:Red:155:10|Color:Blue:160:15',
        ];

        $csv = implode(',', $headers) . "\n" . implode(',', array_map([$this, 'csvEscape'], $example)) . "\n";

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="product-import-template.csv"',
        ]);
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        // Always store imports on the "local" disk (storage/app/private)
        $path = $request->file('file')->store('imports/products', 'local');
        $token = (string) Str::uuid();
        Cache::put($this->cacheKey($token), $path, now()->addMinutes(30));

        // Redirect to GET route so refresh/back won't hit POST-only URL
        return redirect()->route('admin.products.import', ['token' => $token]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $path = Cache::get($this->cacheKey($request->token));
        abort_unless($path, 419, 'Import session expired. Please upload again.');

        $rows = $this->readRows($path, 'local');
        $preview = $this->buildPreview($rows);

        $validRows = collect($preview['rows'])
            ->filter(fn ($r) => count($r['errors']) === 0)
            ->values();

        $created = 0;
        $skipped = count($preview['rows']) - $validRows->count();

        DB::beginTransaction();
        try {
            foreach ($validRows as $row) {
                $this->importRow($row['data']);
                $created++;
            }
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Import failed: ' . $e->getMessage());
        }

        Cache::forget($this->cacheKey($request->token));

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Import complete. Created {$created} products. Skipped {$skipped} rows.");
    }

    private function cacheKey(string $token): string
    {
        return 'product_import:' . $token;
    }

    private function readRows(string $path, string $disk = 'local'): array
    {
        // Let Laravel Excel resolve the file via storage disk
        $sheets = Excel::toArray([], $path, $disk);
        $sheet = $sheets[0] ?? [];
        if (count($sheet) === 0) return [];

        $header = array_map(fn ($h) => $this->normalizeHeader((string) $h), $sheet[0]);
        $rows = [];
        foreach (array_slice($sheet, 1) as $row) {
            if ($this->isEmptyRow($row)) continue;
            $assoc = [];
            foreach ($header as $i => $key) {
                if (!$key) continue;
                $assoc[$key] = $row[$i] ?? null;
            }
            $rows[] = $assoc;
        }
        return $rows;
    }

    private function buildPreview(array $rows): array
    {
        $out = [];
        $toCreate = [
            'categories' => [],
            'brands' => [],
            'attributes' => [],
        ];

        foreach ($rows as $index => $row) {
            [$data, $errors, $creates] = $this->validateAndNormalizeRow($row);
            $out[] = [
                'row' => $index + 2, // 1-based with header
                'data' => $data,
                'errors' => $errors,
            ];
            foreach (['categories', 'brands', 'attributes'] as $k) {
                $toCreate[$k] = array_values(array_unique(array_merge($toCreate[$k], $creates[$k] ?? [])));
            }
        }

        return [
            'rows' => $out,
            'counts' => [
                'total' => count($out),
                'valid' => collect($out)->filter(fn ($r) => count($r['errors']) === 0)->count(),
                'invalid' => collect($out)->filter(fn ($r) => count($r['errors']) > 0)->count(),
            ],
            'willCreate' => $toCreate,
            'formatHelp' => [
                'variations' => 'Use | to separate variations. Format: Attribute:Value:Price:Stock:Image (price/stock/image optional). Example: Color:Red:155:10:https://example.com/red.jpg|Color:Blue:160:15:https://example.com/blue.jpg',
                'images' => 'Optional. Use | to separate multiple image URLs/paths.',
            ],
        ];
    }

    private function validateAndNormalizeRow(array $row): array
    {
        $errors = [];
        $creates = ['categories' => [], 'brands' => [], 'attributes' => []];

        $name = trim((string) ($row['name'] ?? ''));
        if ($name === '') $errors[] = 'name is required';

        $categoryTitle = trim((string) ($row['category'] ?? ''));
        if ($categoryTitle === '') $errors[] = 'category is required';

        $purchasePrice = $this->toFloat($row['purchase_price'] ?? null);
        if ($purchasePrice === null) $errors[] = 'purchase_price is required and must be a number';

        $salePrice = $this->toFloat($row['sale_price'] ?? null);
        if ($salePrice === null) $errors[] = 'sale_price is required and must be a number';

        // uan_price / moq_price removed from schema; ignore if present in file
        $stock = $this->toInt($row['stock'] ?? null);

        $slug = trim((string) ($row['slug'] ?? ''));
        if ($slug === '' && $name !== '') {
            $slug = Str::slug($name);
        }
        $slug = $slug ? $this->uniqueProductSlug($slug) : null;

        $brandTitle = trim((string) ($row['brand'] ?? ''));
        $description = (string) ($row['description'] ?? '');

        $isPreorder = $this->toBool($row['is_preorder'] ?? false);
        $hasDiscount = $this->toBool($row['has_discount'] ?? false);
        $discountType = trim((string) ($row['discount_type'] ?? '')) ?: null;
        $discountValue = $this->toFloat($row['discount_value'] ?? null);

        if ($hasDiscount && (!$discountType || $discountValue === null)) {
            $errors[] = 'discount_type and discount_value are required when has_discount=1';
        }
        if ($discountType && !in_array($discountType, ['flat', 'percentage'], true)) {
            $errors[] = 'discount_type must be flat or percentage';
        }

        if ($categoryTitle !== '') {
            $exists = Category::whereRaw('LOWER(title) = ?', [mb_strtolower($categoryTitle)])->exists();
            if (!$exists) $creates['categories'][] = $categoryTitle;
        }
        if ($brandTitle !== '') {
            $exists = Brand::whereRaw('LOWER(title) = ?', [mb_strtolower($brandTitle)])->exists();
            if (!$exists) $creates['brands'][] = $brandTitle;
        }

        $images = $this->splitPipe($row['images'] ?? null);

        $variationsRaw = trim((string) ($row['variations'] ?? ''));
        $variations = [];
        if ($variationsRaw !== '') {
            foreach ($this->splitPipe($variationsRaw) as $v) {
                $parts = array_map('trim', explode(':', $v));
                if (count($parts) < 2) {
                    $errors[] = "invalid variation format: {$v}";
                    continue;
                }
                [$attrName, $value] = [$parts[0], $parts[1]];
                $price = $this->toFloat($parts[2] ?? null);
                $vStock = $this->toInt($parts[3] ?? null);
                $vImage = trim((string) ($parts[4] ?? '')) ?: null;
                if ($attrName === '' || $value === '') {
                    $errors[] = "variation must include Attribute and Value: {$v}";
                    continue;
                }
                $variations[] = [
                    'attribute' => $attrName,
                    'value' => $value,
                    'price' => $price,
                    'stock' => $vStock,
                    'image' => $vImage,
                ];

                $attrExists = ProductAttribute::whereRaw('LOWER(name) = ?', [mb_strtolower($attrName)])->exists();
                if (!$attrExists) $creates['attributes'][] = $attrName;
            }
        }

        // Prevent accidental overwrite by slug collisions
        if ($slug && Product::where('slug', $slug)->exists()) {
            $errors[] = 'slug already exists in products table';
        }

        return [[
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'category' => $categoryTitle,
            'brand' => $brandTitle ?: null,
            'purchase_price' => $purchasePrice,
            'sale_price' => $salePrice,
            'stock' => $stock,
            'is_preorder' => $isPreorder,
            'has_discount' => $hasDiscount,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'images' => $images,
            'variations' => $variations,
        ], $errors, $creates];
    }

    private function importRow(array $data): void
    {
        $category = Category::firstOrCreate(
            ['title' => $data['category']],
            ['slug' => $this->uniqueSlugFor(Category::class, $data['category']), 'image' => null],
        );

        $brandId = null;
        if (!empty($data['brand'])) {
            $brand = Brand::firstOrCreate(
                ['title' => $data['brand']],
                [
                    'slug' => $this->uniqueSlugFor(Brand::class, $data['brand']),
                    'image' => null,
                    'is_featured' => true,
                ],
            );
            $brandId = $brand->id;
        }

        $product = Product::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?: null,
            'purchase_price' => $data['purchase_price'],
            'sale_price' => $data['sale_price'],
            'stock' => $data['stock'],
            'category_id' => $category->id,
            'brand_id' => $brandId,
            'images' => $data['images'] ?? [],
            'qty_price' => [],
            'is_preorder' => (bool) ($data['is_preorder'] ?? false),
            'has_discount' => (bool) ($data['has_discount'] ?? false),
            'discount_type' => $data['discount_type'] ?? null,
            'discount_value' => $data['discount_value'] ?? null,
            'discounted_sale_price' => null,
        ]);

        foreach (($data['variations'] ?? []) as $v) {
            $attr = ProductAttribute::firstOrCreate(
                ['name' => $v['attribute']],
            );

            ProductVariation::create([
                'product_id' => $product->id,
                'product_attribute_id' => $attr->id,
                'value' => $v['value'],
                'image' => $v['image'] ?? null,
                'price' => $v['price'],
                'stock' => $v['stock'],
            ]);
        }
    }

    private function normalizeHeader(string $h): string
    {
        $h = trim($h);
        $h = str_replace([' ', '-', '.'], '_', $h);
        $h = preg_replace('/_+/', '_', $h);
        return strtolower($h ?? '');
    }

    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $v) {
            if ($v !== null && trim((string) $v) !== '') return false;
        }
        return true;
    }

    private function splitPipe($value): array
    {
        $s = trim((string) ($value ?? ''));
        if ($s === '') return [];
        return array_values(array_filter(array_map('trim', explode('|', $s)), fn ($x) => $x !== ''));
    }

    private function toFloat($value): ?float
    {
        if ($value === null) return null;
        if (is_string($value) && trim($value) === '') return null;
        if (is_numeric($value)) return (float) $value;
        return null;
    }

    private function toInt($value): ?int
    {
        if ($value === null) return null;
        if (is_string($value) && trim($value) === '') return null;
        if (is_numeric($value)) return (int) $value;
        return null;
    }

    private function toBool($value): bool
    {
        if (is_bool($value)) return $value;
        $s = strtolower(trim((string) $value));
        return in_array($s, ['1', 'true', 'yes', 'y', 'on'], true);
    }

    private function uniqueProductSlug(string $base): string
    {
        $slug = Str::slug($base);
        if ($slug === '') $slug = 'product';

        $candidate = $slug;
        $i = 2;
        while (Product::where('slug', $candidate)->exists()) {
            $candidate = "{$slug}-{$i}";
            $i++;
            if ($i > 200) {
                $candidate = "{$slug}-" . Str::random(6);
                break;
            }
        }
        return $candidate;
    }

    private function uniqueSlugFor(string $modelClass, string $title): string
    {
        $slug = Str::slug($title);
        if ($slug === '') $slug = 'item';

        $candidate = $slug;
        $i = 2;
        while ($modelClass::where('slug', $candidate)->exists()) {
            $candidate = "{$slug}-{$i}";
            $i++;
            if ($i > 200) {
                $candidate = "{$slug}-" . Str::random(6);
                break;
            }
        }
        return $candidate;
    }

    private function csvEscape(string $value): string
    {
        $needsQuotes = str_contains($value, ',') || str_contains($value, '"') || str_contains($value, "\n");
        $escaped = str_replace('"', '""', $value);
        return $needsQuotes ? "\"{$escaped}\"" : $escaped;
    }
}

