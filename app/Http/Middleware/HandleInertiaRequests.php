<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use App\Models\Brand;

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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'categories' => fn() => Category::select('id', 'title', 'slug', 'image')->get(),
            'brands' => fn() => Brand::select('id', 'title', 'slug', 'image')->orderBy('title')->get(),
            'cart' => fn() => $request->session()->get('cart', []),
            'messengerLink' => fn() => get_setting('messenger_link'),
            'additionalCost' => fn() => get_setting('additional_cost', 0),
            'discount' => fn() => get_setting('quantity_discounts'),
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
            'siteDescription' => fn() => get_setting('footer_description'),
            'siteFavicon' => fn() => get_setting('site_favicon'),
            'footer' => fn() => [
                'description' => get_setting('footer_description'),
                'facebook' => get_setting('social_facebook'),
                'instagram' => get_setting('social_instagram'),
                'youtube' => get_setting('social_youtube'),
                'tiktok' => get_setting('social_tiktok'),
            ],
            'bannerImages' => fn() => get_setting('banner_images'),
            'bannerActive' => fn() => get_setting('banner_active'),
        ];
    }
}
