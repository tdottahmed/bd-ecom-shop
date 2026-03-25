<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    private function getBannerSettings(): array
    {
        $bannerActiveValue = get_setting("banner_active", "0");
        $bannerActive =
            $bannerActiveValue === true ||
            $bannerActiveValue === 1 ||
            $bannerActiveValue === "1" ||
            $bannerActiveValue === "true";

        $bannerImagesValue = get_setting("banner_images", "[]");

        $bannerImages = [];
        if (is_array($bannerImagesValue)) {
            $bannerImages = $bannerImagesValue;
        } else {
            $decoded = json_decode($bannerImagesValue ?: "[]", true);
            $bannerImages = is_array($decoded) ? $decoded : [];
        }

        // Ensure it's an array of strings
        $bannerImages = array_values(
            array_filter($bannerImages, fn($img) => is_string($img) && trim($img) !== "")
        );

        return [
            "bannerActive" => $bannerActive,
            "bannerImages" => $bannerImages,
        ];
    }

    public function index(Request $request)
    {
        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();
        $bannerSettings = $this->getBannerSettings();

        $productsByCategory = $categories->map(function (Category $cat) use ($request) {
            return [
                'category' => $cat,
                'products' => $this->filterProducts($request, $cat->id, 8),
            ];
        });

        return Inertia::render('Customer/Home', [
            'productsByCategory' => $productsByCategory,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'bannerImages' => $bannerSettings["bannerImages"],
            'bannerActive' => $bannerSettings["bannerActive"],
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'stock_out' => $request->input('stock_out'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    public function category(Request $request, string $category)
    {
        $categoryModel = Category::where('slug', $category)->firstOrFail();
        $products = $this->filterProducts($request, $categoryModel->id, 8);

        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();
        $bannerSettings = $this->getBannerSettings();

        $productsByCategory = [[
            'category' => $categoryModel,
            'products' => $products,
        ]];

        return Inertia::render('Customer/Home', [
            'category' => $categoryModel,
            'productsByCategory' => $productsByCategory,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'bannerImages' => $bannerSettings["bannerImages"],
            'bannerActive' => $bannerSettings["bannerActive"],
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'stock_out' => $request->input('stock_out'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    public function products(Request $request)
    {
        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();
        $bannerSettings = $this->getBannerSettings();

        $productsByCategory = $categories->map(function (Category $cat) use ($request) {
            return [
                'category' => $cat,
                'products' => $this->filterProducts($request, $cat->id, 8),
            ];
        });

        return Inertia::render('Customer/Home', [
            'productsByCategory' => $productsByCategory,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'bannerImages' => $bannerSettings["bannerImages"],
            'bannerActive' => $bannerSettings["bannerActive"],
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'stock_out' => $request->input('stock_out'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    private function filterProducts(Request $request, ?int $categoryId = null, int $perPage = 12)
    {
        $query = Product::with(['category', 'product_variations', 'product_variations.product_attribute'])
            ->select('id', 'name', 'slug', 'sale_price', 'stock', 'is_preorder', 'category_id', 'images', 'has_discount', 'discount_type', 'discount_value', 'discounted_sale_price');

        // Filter by category if provided
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Filter by brand if provided
        if ($brandId = $request->input('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('sale_price', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('sale_price', '<=', $maxPrice);
        }

        // Stock status
        if ($request->input('in_stock') === 'true') {
            $query->where('stock', '>', 0);
        }
        if ($request->input('stock_out') === 'true') {
            $query->where('stock', '<=', 0)->orderBy('updated_at', 'desc');
        } else {
            $query->where('stock', '>', 0);
        }

        // Preorder status
        if ($request->input('is_preorder') === 'true') {
            $query->where('is_preorder', true);
        } else {
            $query->where('is_preorder', false);
        }

        // Sorting
        switch ($request->input('sort', 'latest')) {
            case 'price_low':
                $query->orderBy('sale_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('sale_price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function show(Product $product)
    {
        $product->load(['category', 'product_variations.product_attribute']);

        return Inertia::render('Customer/ProductShow', [
            'product' => $product,
        ]);
    }

    /**
     * API: Paginated products for a category (for "Load more" per category).
     */
    public function categoryProducts(Request $request, string $category)
    {
        $categoryModel = Category::where('slug', $category)->firstOrFail();
        $products = $this->filterProducts($request, $categoryModel->id, 8);

        return response()->json([
            'data' => $products->items(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q', ''); // Note: using 'q' instead of 'search'

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', '%' . $query . '%')
            ->select('id', 'name', 'slug', 'sale_price', 'images', 'stock')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->sale_price,
                    'image' => $product->images[0] ?? null,
                    'stock' => $product->stock,
                    'in_stock' => $product->stock > 0,
                ];
            });

        return response()->json($products);
    }

    public function brands()
    {
        $brands = Brand::select(['id', 'title', 'slug', 'image'])->orderBy('title')->get();

        return Inertia::render('Customer/Brands', [
            'brands' => $brands,
        ]);
    }

    public function brand(Brand $brand, Request $request)
    {
        $request->merge(['brand_id' => $brand->id]);
        $products = $this->filterProducts($request, null, 12);

        return Inertia::render('Customer/Brand', [
            'brand' => $brand->only(['id', 'title', 'slug', 'image']),
            'products' => $products,
        ]);
    }
}
