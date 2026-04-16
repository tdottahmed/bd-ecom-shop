<?php

namespace App\Http\Middleware;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Load categories with their preview products, cached for 10 minutes.
     * A single call is shared between `categories` and `navCategories`.
     */
    private static function cachedCategories(): Collection
    {
        return Cache::remember('nav_categories', 600, function () {
            $cats = Category::select('id', 'title', 'slug', 'image')
                ->orderBy('title')
                ->get();

            // Eager-load preview products for all categories in 1 query each
            $cats->each(function (Category $category) {
                $products = $category->products()
                    ->select('id', 'category_id', 'name', 'slug', 'images', 'sale_price', 'has_discount', 'discounted_sale_price')
                    ->latest()
                    ->limit(4)
                    ->get();

                $category->setRelation('products', $products);
            });

            return $cats;
        });
    }

    /**
     * Load brands with their preview products, cached for 10 minutes.
     * A single call is shared between `brands` and `navBrands`.
     */
    private static function cachedBrands(): Collection
    {
        return Cache::remember('nav_brands', 600, function () {
            $brands = Brand::select('id', 'title', 'slug', 'image')
                ->orderBy('title')
                ->get();

            $brands->each(function (Brand $brand) {
                $products = $brand->products()
                    ->select('id', 'brand_id', 'name', 'slug', 'images', 'sale_price', 'has_discount', 'discounted_sale_price')
                    ->latest()
                    ->limit(4)
                    ->get();

                $brand->setRelation('products', $products);
            });

            return $brands;
        });
    }

    /**
     * Load header pages, cached for 30 minutes.
     */
    private static function cachedHeaderPages(): Collection
    {
        return Cache::remember('header_pages', 1800, function () {
            return Page::query()
                ->where('is_published', true)
                ->where('show_in_header', true)
                ->orderBy('title')
                ->select('title', 'slug')
                ->get();
        });
    }

    /**
     * Load footer pages, cached for 30 minutes.
     */
    private static function cachedFooterPages(): Collection
    {
        return Cache::remember('footer_pages', 1800, function () {
            return Page::query()
                ->where('is_published', true)
                ->where('show_in_footer', true)
                ->orderBy('title')
                ->select('title', 'slug')
                ->get();
        });
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // Shared between `categories` and `navCategories` — one cached load.
            'categories' => fn () => self::cachedCategories(),
            'navCategories' => fn () => self::cachedCategories(),

            // Shared between `brands` and `navBrands` — one cached load.
            'brands' => fn () => self::cachedBrands(),
            'navBrands' => fn () => self::cachedBrands(),

            'cart' => fn () => $request->session()->get('cart', []),

            // All get_setting() calls now hit the single 'all_settings' file cache.
            'messengerLink' => fn () => get_setting('messenger_link'),
            'whatsappLink' => fn () => get_setting('whatsapp_link'),
            'blogEnabled' => fn () => get_setting('blog_enabled', '1') === '1',
            'additionalCost' => fn () => get_setting('additional_cost', 0),
            'discount' => fn () => get_setting('quantity_discounts'),
            'customerAuthEnabled' => fn () => get_setting('customer_auth_enabled', '0') === '1',

            'socialProviders' => fn () => [
                'google' => ['enabled' => env('GOOGLE_LOGIN_ENABLED', '0') === '1' && ! empty(env('GOOGLE_CLIENT_ID'))],
                'facebook' => ['enabled' => env('FACEBOOK_LOGIN_ENABLED', '0') === '1' && ! empty(env('FACEBOOK_CLIENT_ID'))],
            ],

            'paymentMethods' => fn () => [
                'cod' => ['enabled' => get_setting('cod_enabled', '1') === '1',        'label' => 'Cash on Delivery'],
                'bkash' => ['enabled' => get_setting('bkash_enabled', '0') === '1',      'label' => 'bKash'],
                'nagad' => ['enabled' => get_setting('nagad_enabled', '0') === '1',      'label' => 'Nagad'],
                'sslcommerz' => ['enabled' => get_setting('sslcommerz_enabled', '0') === '1', 'label' => 'SSLCommerz'],
                'shurjopay' => ['enabled' => get_setting('shurjopay_enabled', '0') === '1',  'label' => 'ShurjoPay'],
                'aamarpay' => ['enabled' => get_setting('aamarpay_enabled', '0') === '1',   'label' => 'AamarPay'],
            ],

            'seo' => fn () => [
                'siteName' => get_setting('seo_site_name', config('app.name')),
                'defaultTitle' => get_setting('seo_default_title', config('app.name')),
                'defaultDescription' => get_setting('seo_default_description', ''),
                'defaultKeywords' => get_setting('seo_default_keywords', ''),
                'robots' => get_setting('seo_robots', 'index,follow'),
                'ogImage' => get_setting('seo_og_image', ''),
                'googleSiteVerification' => get_setting('google_site_verification', ''),
            ],

            'siteLogo' => fn () => get_setting('site_logo'),
            'authPageImage' => fn () => get_setting('auth_page_image'),
            'siteDescription' => fn () => get_setting('footer_description'),
            'siteFavicon' => fn () => get_setting('site_favicon'),

            'footer' => fn () => [
                'description' => get_setting('footer_description'),
                'facebook' => get_setting('social_facebook'),
                'instagram' => get_setting('social_instagram'),
                'youtube' => get_setting('social_youtube'),
                'tiktok' => get_setting('social_tiktok'),
            ],

            'headerPages' => fn () => self::cachedHeaderPages(),
            'footerPages' => fn () => self::cachedFooterPages(),

            'themeColors' => fn () => theme_colors(),
        ];
    }
}
