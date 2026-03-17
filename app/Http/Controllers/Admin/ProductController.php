<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariation;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    private function normalizeVariationImageString(?string $path): ?string
    {
        if (!$path) return null;
        $p = trim($path);
        if ($p === '') return null;
        if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
            return $p;
        }
        $clean = ltrim($p, '/');
        if (!str_contains($clean, '/')) {
            return 'products/variations/' . $clean;
        }
        return $clean;
    }

    public function index(Request $request)
    {
        $query = Product::with('category', 'brand', 'product_variations.product_attribute');

        // Search by name or SKU
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        // Filter by brand
        if ($request->filled('brand') && $request->brand !== 'all') {
            $query->where('brand_id', $request->brand);
        }

        // Sorting
        $sortOrder = $request->get('sort', 'newest');
        switch ($sortOrder) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'price_low':
                $query->orderBy('sale_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('sale_price', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Paginate results
        $products = $query->paginate(15)->withQueryString();

        // Get all products for stats (without pagination)
        // We can use aggregate queries for better performance
        $stats = [
            'total' => Product::count(),
            'checkouts' => \App\Models\Order::count(),
            'stock' => Product::sum('stock'),
            'buy_value' => Product::select(DB::raw('SUM(stock * purchase_price) as total'))->value('total') ?? 0,
            'sell_value' => Product::select(DB::raw('SUM(stock * sale_price) as total'))->value('total') ?? 0,
        ];
        $stats['profit'] = $stats['sell_value'] - $stats['buy_value'];

        $categories = Category::select(['id', 'title'])->get();
        $brands = Brand::select(['id', 'title'])->get();

        return inertia('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'category' => $request->get('category', 'all'),
                'brand' => $request->get('brand', 'all'),
                'sort' => $sortOrder,
            ],
        ]);
    }

    public function create()
    {
        $categories = Category::select(['id', 'title'])->get();
        $brands = Brand::select(['id', 'title'])->get();
        $attributes = ProductAttribute::select(['id', 'name'])->get();
        return inertia('Admin/Products/Create', [
            'categories' => $categories,
            'brands' => $brands,
            'attributes' => $attributes,
            'settings' => [
                'yuan_rate' => get_setting('yuan_rate'),
                'additional_cost' => get_setting('additional_cost'),
                'profit' => get_setting('profit'),
            ]
        ]);
    }


    public function store(ProductRequest $request)
    {
        DB::beginTransaction();
        try {
            $uploadedImages = [];
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                $uploadedImages = FileUpload::uploadImages(
                    $files,
                    'products'
                );
            }
            $qtyPriceData = $this->processQtyPrices($request);
            $product = Product::create([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'purchase_price' => $request->purchase_price,
                'sale_price' => $request->sale_price,
                'stock' => $request->stock,
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id ?: null,
                'images' => $uploadedImages,
                'qty_price' => $qtyPriceData,
                'is_preorder' => $request->is_preorder ?? false,
                'has_discount' => (bool) ($request->has_discount ?? false),
                'discount_type' => $request->discount_type ?: null,
                'discount_value' => $request->discount_value !== null && $request->discount_value !== '' ? (float) $request->discount_value : null,
                'discounted_sale_price' => $this->getDiscountedSalePrice($request),
            ]);

            if ($request->has('variations') && !empty($request->variations)) {
                foreach ($request->variations as $i => $variationData) {
                    // Important: nested files live in $request->file(), not in $variationData
                    $uploadedImage = $request->file("variations.{$i}.image");

                    $variationImagePath = null;
                    if ($uploadedImage instanceof \Illuminate\Http\UploadedFile) {
                        $variationImagePath = FileUpload::uploadImage($uploadedImage, 'products/variations');
                    } elseif (!empty($variationData['image']) && is_string($variationData['image'])) {
                        // Allow passing a path/url string without upload (e.g. imports)
                        $variationImagePath = $this->normalizeVariationImageString($variationData['image']);
                    }

                    ProductVariation::create([
                        'product_id' => $product->id,
                        'product_attribute_id' => $variationData['attribute_id'],
                        'value' => $variationData['value'],
                        'image' => $variationImagePath,
                        'stock' => $variationData['stock'] ?? null,
                        'price' => $variationData['price'] ?? null,
                    ]);
                }
            }
            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            if (!empty($uploadedImages)) {
                FileUpload::deleteImages($uploadedImages);
            }

            return back()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    public function edit(Product $product)
    {
        $product->load('category', 'brand', 'product_variations.product_attribute');
        $categories = Category::select(['id', 'title'])->get();
        $brands = Brand::select(['id', 'title'])->get();
        $attributes = ProductAttribute::select(['id', 'name'])->get();
        $variations = ProductVariation::where('product_id', $product->id)->get();
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
            'attributes' => $attributes,
            'variations' => $variations,
            'settings' => [
                'yuan_rate' => get_setting('yuan_rate'),
                'additional_cost' => get_setting('additional_cost'),
                'profit' => get_setting('profit'),
            ]
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->load('product_variations');
        DB::beginTransaction();
        try {
            $currentImages = $product->images ?? [];

            if ($request->has('deleted_images')) {
                FileUpload::deleteImages($request->deleted_images);
                $currentImages = array_diff($currentImages, $request->deleted_images);
            }

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                $newImages = FileUpload::uploadImages(
                    $files,
                    'products'
                );
                $currentImages = array_merge($currentImages, $newImages);
            }

            $qtyPriceData = $this->processQtyPrices($request);

            $product->update([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'purchase_price' => $request->purchase_price,
                'sale_price' => $request->sale_price,
                'stock' => $request->stock,
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id ?: null,
                'images' => $currentImages,
                'qty_price' => $qtyPriceData,
                'is_preorder' => $request->is_preorder ?? false,
                'has_discount' => (bool) ($request->has_discount ?? false),
                'discount_type' => $request->discount_type ?: null,
                'discount_value' => $request->discount_value !== null && $request->discount_value !== '' ? (float) $request->discount_value : null,
                'discounted_sale_price' => $this->getDiscountedSalePrice($request),
            ]);
            // Handle Variations Update (Sync Logic)
            if ($request->has('variations')) {
                $submittedVariations = $request->variations ?? [];

                // 1. Get IDs of submitted variations that already exist in DB
                $submittedIds = collect($submittedVariations)
                    ->pluck('id')
                    ->filter(function ($id) {
                        return is_numeric($id); // Filter out temp IDs like "0.1234"
                    })
                    ->toArray();

                // 2. Delete variations that are NOT in the submitted list
                $product->product_variations()
                    ->whereNotIn('id', $submittedIds)
                    ->delete();

                // 3. Update existing or Create new
                foreach ($submittedVariations as $i => $variationData) {
                    $variation = null;
                    if (isset($variationData['id']) && is_numeric($variationData['id'])) {
                        $variation = \App\Models\ProductVariation::find($variationData['id']);
                    }

                    if ($variation && $variation->product_id == $product->id) {
                        $nextImage = $variation->image;

                        $uploadedImage = $request->file("variations.{$i}.image");
                        if ($uploadedImage instanceof \Illuminate\Http\UploadedFile) {
                            // Replace existing image
                            if (!empty($variation->image)) {
                                FileUpload::deleteImages([$variation->image]);
                            }
                            $nextImage = FileUpload::uploadImage($uploadedImage, 'products/variations');
                        } elseif (!empty($variationData['deleted_image'])) {
                            // Remove existing image
                            if (!empty($variation->image)) {
                                FileUpload::deleteImages([$variation->image]);
                            }
                            $nextImage = null;
                        } elseif (array_key_exists('image', $variationData) && is_string($variationData['image'])) {
                            $nextImage = $this->normalizeVariationImageString($variationData['image']);
                        }

                        // Update existing variation
                        $variation->update([
                            'product_attribute_id' => $variationData['attribute_id'],
                            'value' => $variationData['value'],
                            'image' => $nextImage,
                            'stock' => $variationData['stock'] ?? null,
                            'price' => $variationData['price'] ?? null,
                        ]);
                    } else {
                        $uploadedImage = $request->file("variations.{$i}.image");
                        $variationImagePath = null;
                        if ($uploadedImage instanceof \Illuminate\Http\UploadedFile) {
                            $variationImagePath = FileUpload::uploadImage($uploadedImage, 'products/variations');
                        } elseif (!empty($variationData['image']) && is_string($variationData['image'])) {
                            $variationImagePath = $this->normalizeVariationImageString($variationData['image']);
                        }

                        // Create new variation
                        ProductVariation::create([
                            'product_id' => $product->id,
                            'product_attribute_id' => $variationData['attribute_id'],
                            'value' => $variationData['value'],
                            'image' => $variationImagePath,
                            'stock' => $variationData['stock'] ?? null,
                            'price' => $variationData['price'] ?? null,
                        ]);
                    }
                }
            } else {
                
                $product->product_variations()->delete();
            }

            DB::commit();
            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($newImages)) {
                FileUpload::deleteImages($newImages);
            }
            return back()->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        $product->load('category', 'brand', 'product_variations.product_attribute');
        return inertia('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    protected function processQtyPrices(ProductRequest $request)
    {
        $qtyPrices = [];
        if ($request->has('qty_prices') && !empty($request->qty_prices)) {
            foreach ($request->qty_prices as $qtyPriceData) {
                $qtyPrices[] = [
                    'qty' => (int) $qtyPriceData['qty'],
                    'price' => (float) $qtyPriceData['qty_price'],
                ];
            }
        }
        return $qtyPrices;
    }

    protected function getDiscountedSalePrice(Request $request): ?float
    {
        if (empty($request->has_discount) || !$request->discount_type || $request->discount_value === null || $request->discount_value === '') {
            return null;
        }
        $salePrice = (float) $request->sale_price;
        $value = (float) $request->discount_value;
        if ($request->discount_type === 'flat') {
            $discounted = $salePrice - $value;
            return $discounted > 0 ? round($discounted, 2) : 0;
        }
        // percentage
        $discounted = $salePrice * (1 - $value / 100);
        return round(max(0, $discounted), 2);
    }

    public function destroy(Product $product)
    {
        // Check if product is in any order
        if ($product->orderItems()->exists()) {
            // Get unique orders that contain this product through OrderItems
            $orderIds = $product->orderItems()->pluck('order_id')->unique();
            $orders = Order::whereIn('id', $orderIds)->get();
            foreach ($orders as $order) {
                $order->delete();
            }
        }

        $product->product_variations()->delete();

        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully!');
    }
}
