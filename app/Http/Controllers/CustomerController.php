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

    private function getHomeContent(): array
    {
        $featuresItems = json_decode(get_setting('home_features_items', '[]'), true);
        if (!is_array($featuresItems)) $featuresItems = [];

        return [
            'hero' => [
                'subtitle' => get_setting('home_hero_subtitle', 'True by Malaysia'),
                'title' => get_setting('home_hero_title', 'Elevate Your Lifestyle'),
                'description' => get_setting('home_hero_description', 'Discover our curated collection of premium essentials designed for the modern home. Immerse yourself in uncompromising quality and timeless aesthetics.'),
                'button_text' => get_setting('home_hero_button_text', 'Shop New Arrivals'),
                'button_link' => get_setting('home_hero_button_link', '/products'),
            ],
            'features' => [
                'enabled' => get_setting('home_features_enabled', '1') === '1',
                'title' => get_setting('home_features_title', 'Why shop with us'),
                'subtitle' => get_setting('home_features_subtitle', 'Fast delivery, secure payments, and great support.'),
                'items' => $featuresItems,
            ],
            'promo' => [
                'enabled' => get_setting('home_promo_enabled', '1') === '1',
                'badge' => get_setting('home_promo_badge', 'Premium Collection'),
                'title' => get_setting('home_promo_title', 'Elevate Your Lifestyle'),
                'description' => get_setting('home_promo_description', 'Discover our exclusive range of high-quality products and the best deals of the season.'),
                'bgImage' => get_setting('home_promo_bg_image', '/images/banner-1.jpg'),
                'primaryCtaText' => get_setting('home_promo_primary_cta_text', 'Shop Collection'),
                'secondaryCtaText' => get_setting('home_promo_secondary_cta_text', 'Explore Offers'),
            ],
            'newsletter' => [
                'enabled' => get_setting('home_newsletter_enabled', '1') === '1',
                'title' => get_setting('home_newsletter_title', 'Join the Inner Circle'),
                'description' => get_setting('home_newsletter_description', 'Subscribe for exclusive early access to major sales, new collection drops, and styling tips.'),
                'placeholder' => get_setting('home_newsletter_placeholder', 'Enter your best email...'),
            ],
            'brands' => [
                'enabled' => get_setting('home_brands_enabled', '1') === '1',
                'title' => get_setting('home_brands_title', 'Shop by Brand'),
                'subtitle' => get_setting('home_brands_subtitle', 'Discover authentic products from brands you already love.'),
                'ctaText' => get_setting('home_brands_cta_text', 'View all brands'),
            ],
        ];
    }

    public function index(Request $request)
    {
        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->where('is_featured', 1)->get();
        $brands = Brand::select(['id', 'title', 'slug', 'image'])->orderBy('title')->get();
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
            'brands' => $brands,
            'website_settings' => $websiteSettings,
            'bannerImages' => $bannerSettings["bannerImages"],
            'bannerActive' => $bannerSettings["bannerActive"],
            'homeContent' => $this->getHomeContent(),
            'homeCta' => [
                'enabled' => get_setting('cta_enabled', '1') === '1',
                'title' => get_setting('cta_title', 'Ready to Discover Something Exceptional?'),
                'description' => get_setting('cta_description', 'Explore premium picks curated for modern living, or reach out and let us help you choose the right products.'),
                'browseText' => get_setting('cta_browse_text', 'Browse Our Products'),
                'browseLink' => get_setting('cta_browse_link', '/products'),
                'contactText' => get_setting('cta_contact_text', 'Contact Us'),
                'contactLink' => get_setting('cta_contact_link', '/contact-us'),
            ],
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
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();
        $brands = Brand::select(['id', 'title', 'slug', 'image'])->orderBy('title')->get();
        
        $products = $this->filterProducts($request, $categoryModel->id, 16);

        return Inertia::render('Customer/ProductList', [
            'category' => $categoryModel,
            'categories' => $categories,
            'brands' => $brands,
            'products' => $products,
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'stock_out' => $request->input('stock_out'),
                'is_preorder' => $request->input('is_preorder'),
                'category_id' => $request->input('category_id'),
                'brand_id' => $request->input('brand_id'),
            ],
        ]);
    }

    public function products(Request $request)
    {
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();
        $brands = Brand::select(['id', 'title', 'slug', 'image'])->orderBy('title')->get();

        $products = $this->filterProducts($request, null, 16);

        return Inertia::render('Customer/ProductList', [
            'categories' => $categories,
            'brands' => $brands,
            'products' => $products,
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'stock_out' => $request->input('stock_out'),
                'is_preorder' => $request->input('is_preorder'),
                'category_id' => $request->input('category_id'),
                'brand_id' => $request->input('brand_id'),
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
        } elseif ($requestCatId = $request->input('category_id')) {
            $query->where('category_id', $requestCatId);
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
