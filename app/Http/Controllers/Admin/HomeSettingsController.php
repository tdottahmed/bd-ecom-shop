<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeSettingsController extends Controller
{
    public function index()
    {
        $featuresItems = json_decode(get_setting('home_features_items', '[]'), true);
        if (!is_array($featuresItems)) $featuresItems = [];

        return Inertia::render('Admin/Settings/Home/Index', [
            'settings' => [
                'hero_subtitle' => get_setting('home_hero_subtitle', 'True by Malaysia'),
                'hero_title' => get_setting('home_hero_title', 'Elevate Your Lifestyle'),
                'hero_description' => get_setting('home_hero_description', 'Discover our curated collection of premium essentials designed for the modern home. Immerse yourself in uncompromising quality and timeless aesthetics.'),
                'hero_button_text' => get_setting('home_hero_button_text', 'Shop New Arrivals'),
                'hero_button_link' => get_setting('home_hero_button_link', '/products'),

                'features_enabled' => get_setting('home_features_enabled', '1') === '1',
                'features_title' => get_setting('home_features_title', 'Why shop with us'),
                'features_subtitle' => get_setting('home_features_subtitle', 'Fast delivery, secure payments, and great support.'),
                'features_items' => $featuresItems,

                'promo_enabled' => get_setting('home_promo_enabled', '1') === '1',
                'promo_badge' => get_setting('home_promo_badge', 'Premium Collection'),
                'promo_title' => get_setting('home_promo_title', 'Elevate Your Lifestyle'),
                'promo_description' => get_setting('home_promo_description', 'Discover our exclusive range of high-quality products and the best deals of the season.'),
                'promo_bg_image' => get_setting('home_promo_bg_image', '/images/banner-1.jpg'),
                'promo_primary_cta_text' => get_setting('home_promo_primary_cta_text', 'Shop Collection'),
                'promo_secondary_cta_text' => get_setting('home_promo_secondary_cta_text', 'Explore Offers'),

                'newsletter_enabled' => get_setting('home_newsletter_enabled', '1') === '1',
                'newsletter_title' => get_setting('home_newsletter_title', 'Join the Inner Circle'),
                'newsletter_description' => get_setting('home_newsletter_description', 'Subscribe for exclusive early access to major sales, new collection drops, and styling tips.'),
                'newsletter_placeholder' => get_setting('home_newsletter_placeholder', 'Enter your best email...'),

                'brands_enabled' => get_setting('home_brands_enabled', '1') === '1',
                'brands_title' => get_setting('home_brands_title', 'Shop by Brand'),
                'brands_subtitle' => get_setting('home_brands_subtitle', 'Discover authentic products from brands you already love.'),
                'brands_cta_text' => get_setting('home_brands_cta_text', 'View all brands'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_subtitle' => 'nullable|string|max:120',
            'hero_title' => 'nullable|string|max:120',
            'hero_description' => 'nullable|string|max:300',
            'hero_button_text' => 'nullable|string|max:40',
            'hero_button_link' => 'nullable|string|max:255',

            'features_enabled' => 'required|boolean',
            'features_title' => 'nullable|string|max:120',
            'features_subtitle' => 'nullable|string|max:220',
            'features_items' => 'nullable|array',
            'features_items.*.icon' => 'nullable|string|max:50',
            'features_items.*.title' => 'nullable|string|max:80',
            'features_items.*.description' => 'nullable|string|max:140',
            'features_items.*.tone' => 'nullable|string|max:30',

            'promo_enabled' => 'required|boolean',
            'promo_badge' => 'nullable|string|max:60',
            'promo_title' => 'nullable|string|max:120',
            'promo_description' => 'nullable|string|max:300',
            'promo_bg_image' => 'nullable',
            'promo_primary_cta_text' => 'nullable|string|max:40',
            'promo_secondary_cta_text' => 'nullable|string|max:40',

            'newsletter_enabled' => 'required|boolean',
            'newsletter_title' => 'nullable|string|max:120',
            'newsletter_description' => 'nullable|string|max:300',
            'newsletter_placeholder' => 'nullable|string|max:80',

            'brands_enabled' => 'required|boolean',
            'brands_title' => 'nullable|string|max:120',
            'brands_subtitle' => 'nullable|string|max:220',
            'brands_cta_text' => 'nullable|string|max:40',
        ]);

        if ($request->hasFile('promo_bg_image')) {
            $request->validate([
                'promo_bg_image' => 'image|max:4096',
            ]);
            $data['promo_bg_image'] = $request
                ->file('promo_bg_image')
                ->store('settings/home', 'public');
        } elseif (isset($data['promo_bg_image']) && is_string($data['promo_bg_image'])) {
            $data['promo_bg_image'] = trim($data['promo_bg_image']);
        } else {
            $data['promo_bg_image'] = get_setting('home_promo_bg_image', '');
        }

        Setting::updateOrCreate(['key' => 'home_hero_subtitle'], ['value' => $data['hero_subtitle'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_hero_title'], ['value' => $data['hero_title'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_hero_description'], ['value' => $data['hero_description'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_hero_button_text'], ['value' => $data['hero_button_text'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_hero_button_link'], ['value' => $data['hero_button_link'] ?? '']);

        Setting::updateOrCreate(['key' => 'home_features_enabled'], ['value' => $data['features_enabled'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'home_features_title'], ['value' => $data['features_title'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_features_subtitle'], ['value' => $data['features_subtitle'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_features_items'], ['value' => json_encode($data['features_items'] ?? [])]);

        Setting::updateOrCreate(['key' => 'home_promo_enabled'], ['value' => $data['promo_enabled'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'home_promo_badge'], ['value' => $data['promo_badge'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_promo_title'], ['value' => $data['promo_title'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_promo_description'], ['value' => $data['promo_description'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_promo_bg_image'], ['value' => $data['promo_bg_image'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_promo_primary_cta_text'], ['value' => $data['promo_primary_cta_text'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_promo_secondary_cta_text'], ['value' => $data['promo_secondary_cta_text'] ?? '']);

        Setting::updateOrCreate(['key' => 'home_newsletter_enabled'], ['value' => $data['newsletter_enabled'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'home_newsletter_title'], ['value' => $data['newsletter_title'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_newsletter_description'], ['value' => $data['newsletter_description'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_newsletter_placeholder'], ['value' => $data['newsletter_placeholder'] ?? '']);

        Setting::updateOrCreate(['key' => 'home_brands_enabled'], ['value' => $data['brands_enabled'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'home_brands_title'], ['value' => $data['brands_title'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_brands_subtitle'], ['value' => $data['brands_subtitle'] ?? '']);
        Setting::updateOrCreate(['key' => 'home_brands_cta_text'], ['value' => $data['brands_cta_text'] ?? '']);

        return back()->with('success', 'Home page settings updated successfully.');
    }
}

