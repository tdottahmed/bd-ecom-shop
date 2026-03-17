<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Http\Controllers\RssController;
use App\Http\Controllers\SitemapController;

class SeoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Seo/Index', [
            'settings' => [
                'seo_site_name' => get_setting('seo_site_name', config('app.name')),
                'seo_default_title' => get_setting('seo_default_title', config('app.name')),
                'seo_default_description' => get_setting('seo_default_description', ''),
                'seo_default_keywords' => get_setting('seo_default_keywords', ''),
                'seo_og_image' => get_setting('seo_og_image', ''),
                'google_site_verification' => get_setting('google_site_verification', ''),
                'seo_robots' => get_setting('seo_robots', 'index,follow'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'seo_site_name' => 'nullable|string|max:255',
            'seo_default_title' => 'nullable|string|max:255',
            'seo_default_description' => 'nullable|string|max:500',
            'seo_default_keywords' => 'nullable|string|max:500',
            'google_site_verification' => 'nullable|string|max:255',
            'seo_robots' => 'nullable|string|max:255',
            'og_image' => 'nullable|image|max:2048',
            'existing_og_image' => 'nullable|string',
            'deleted_og_image' => 'nullable|boolean',
        ]);

        $settings = $request->only([
            'seo_site_name',
            'seo_default_title',
            'seo_default_description',
            'seo_default_keywords',
            'google_site_verification',
            'seo_robots',
        ]);

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
            Cache::forget('setting_' . $key);
        }

        $existingOg = get_setting('seo_og_image', '');

        if ($request->boolean('deleted_og_image') && $existingOg) {
            FileUpload::deleteImages([$existingOg]);
            Setting::updateOrCreate(['key' => 'seo_og_image'], ['value' => '']);
            Cache::forget('setting_seo_og_image');
        }

        if ($request->hasFile('og_image')) {
            if ($existingOg) {
                FileUpload::deleteImages([$existingOg]);
            }
            $path = FileUpload::uploadImage($request->file('og_image'), 'seo');
            Setting::updateOrCreate(['key' => 'seo_og_image'], ['value' => $path]);
            Cache::forget('setting_seo_og_image');
        }

        return back()->with('success', 'SEO settings updated successfully.');
    }

    public function regenerateSitemap()
    {
        Cache::forget('public_sitemap_xml');
        app(SitemapController::class)->index();

        return back()->with('success', 'Sitemap regenerated successfully.');
    }

    public function regenerateRss()
    {
        Cache::forget('public_rss_xml');
        app(RssController::class)->index();

        return back()->with('success', 'RSS regenerated successfully.');
    }
}

