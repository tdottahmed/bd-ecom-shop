<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Page;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $props = [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'categories' => fn() => Category::select('id', 'title', 'slug', 'image')
                ->orderBy('title')
                ->get()
                ->tap(function ($cats) {
                    $cats->each(function ($category) {
                        $products = $category->products()
                            ->select('id', 'category_id', 'name', 'slug', 'images', 'sale_price', 'has_discount', 'discounted_sale_price')
                            ->latest()
                            ->limit(4)
                            ->get();

                        $category->setRelation('products', $products);
                    });
                }),
            'navCategories' => fn() => Category::select('id', 'title', 'slug', 'image')
                ->orderBy('title')
                ->get()
                ->tap(function ($cats) {
                    $cats->each(function ($category) {
                        $products = $category->products()
                            ->select('id', 'category_id', 'name', 'slug', 'images', 'sale_price', 'has_discount', 'discounted_sale_price')
                            ->latest()
                            ->limit(4)
                            ->get();

                        $category->setRelation('products', $products);
                    });
                }),
            'brands' => fn() => Brand::select('id', 'title', 'slug', 'image')->orderBy('title')->get(),
            'navBrands' => fn() => Brand::select('id', 'title', 'slug', 'image')
                ->orderBy('title')
                ->get()
                ->tap(function ($brands) {
                    $brands->each(function ($brand) {
                        $products = $brand->products()
                            ->select('id', 'brand_id', 'name', 'slug', 'images', 'sale_price', 'has_discount', 'discounted_sale_price')
                            ->latest()
                            ->limit(4)
                            ->get();

                        $brand->setRelation('products', $products);
                    });
                }),
            'cart' => fn() => $request->session()->get('cart', []),
            'messengerLink' => fn() => get_setting('messenger_link'),
            'whatsappLink' => fn() => get_setting('whatsapp_link'),
            'additionalCost' => fn() => get_setting('additional_cost', 0),
            'discount' => fn() => get_setting('quantity_discounts'),
            'customerAuthEnabled' => fn() => get_setting('customer_auth_enabled', '0') === '1',
            'socialProviders' => fn() => [
                'google'   => ['enabled' => env('GOOGLE_LOGIN_ENABLED', '0') === '1' && !empty(env('GOOGLE_CLIENT_ID'))],
                'facebook' => ['enabled' => env('FACEBOOK_LOGIN_ENABLED', '0') === '1' && !empty(env('FACEBOOK_CLIENT_ID'))],
            ],
            'paymentMethods' => fn() => [
                'cod'        => ['enabled' => get_setting('cod_enabled', '1') === '1',        'label' => 'Cash on Delivery'],
                'bkash'      => ['enabled' => get_setting('bkash_enabled', '0') === '1',      'label' => 'bKash'],
                'nagad'      => ['enabled' => get_setting('nagad_enabled', '0') === '1',      'label' => 'Nagad'],
                'sslcommerz' => ['enabled' => get_setting('sslcommerz_enabled', '0') === '1', 'label' => 'SSLCommerz'],
                'shurjopay'  => ['enabled' => get_setting('shurjopay_enabled', '0') === '1',  'label' => 'ShurjoPay'],
                'aamarpay'   => ['enabled' => get_setting('aamarpay_enabled', '0') === '1',   'label' => 'AamarPay'],
            ],
            'seo' => fn() => [
                'siteName' => get_setting('seo_site_name', config('app.name')),
                'defaultTitle' => get_setting('seo_default_title', config('app.name')),
                'defaultDescription' => get_setting('seo_default_description', ''),
                'defaultKeywords' => get_setting('seo_default_keywords', ''),
                'robots' => get_setting('seo_robots', 'index,follow'),
                'ogImage' => get_setting('seo_og_image', ''),
                'googleSiteVerification' => get_setting('google_site_verification', ''),
            ],
            'siteLogo' => fn() => get_setting('site_logo'),
            'authPageImage' => fn() => get_setting('auth_page_image'),
            'siteDescription' => fn() => get_setting('footer_description'),
            'siteFavicon' => fn() => get_setting('site_favicon'),
            'footer' => fn() => [
                'description' => get_setting('footer_description'),
                'facebook' => get_setting('social_facebook'),
                'instagram' => get_setting('social_instagram'),
                'youtube' => get_setting('social_youtube'),
                'tiktok' => get_setting('social_tiktok'),
            ],
            'footerPages' => fn() => Page::query()
                ->where('is_published', true)
                ->whereNotIn('slug', ['about-us', 'contact-us'])
                ->orderBy('title')
                ->select('title', 'slug')
                ->get(),
        ];
        // dd($props['categories']());
        return $props;

    }
}
