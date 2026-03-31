<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryCharge;
use App\Models\WebsiteSetting;
use App\Models\Setting;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Website/Index', [
            'settings' => [
                'banner_active' => get_setting('banner_active', '1') === '1',
                'banner_images' => json_decode(get_setting('banner_images', '[]'), true),
                'faqs' => json_decode(get_setting('faqs', '[]'), true),
                'site_logo' => get_setting('site_logo'),
                'site_favicon' => get_setting('site_favicon'),
                'footer_description' => get_setting('footer_description'),
                'social_facebook' => get_setting('social_facebook'),
                'social_instagram' => get_setting('social_instagram'),
                'social_youtube' => get_setting('social_youtube'),
                'social_tiktok' => get_setting('social_tiktok'),
            ],
            'deliveryCharges' => DeliveryCharge::all(),
            'messengerLink' => get_setting('messenger_link'),
        ]);
    }

    public function update(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'banner') {
            $request->validate([
                'banner_active' => 'required|boolean',
                'banner_images' => 'nullable|array',
                'banner_images.*' => 'image|max:2048',
                'existing_banner_images' => 'nullable|array',
                'existing_banner_images.*' => 'string',
                'deleted_images' => 'nullable|array',
            ]);

            $currentImages = json_decode(get_setting('banner_images', '[]'), true);
            $bannerImages = $this->handleImages($currentImages, $request, 'banner_images', 'banners');

            Setting::updateOrCreate(['key' => 'banner_active'], ['value' => $request->banner_active ? '1' : '0']);
            Setting::updateOrCreate(['key' => 'banner_images'], ['value' => json_encode($bannerImages)]);

            Cache::forget('setting_banner_active');
            Cache::forget('setting_banner_images');

            return back()->with('success', 'Banner settings updated successfully.');
        }

        if ($type === 'delivery') {
            $request->validate([
                'delivery_charges' => 'required|array',
                'delivery_charges.*.id' => 'nullable|integer|exists:delivery_charges,id',
                'delivery_charges.*.name' => 'required|string|max:255',
                'delivery_charges.*.cost' => 'required|numeric|min:0',
                'delivery_charges.*.duration' => 'required|string|max:255',
            ]);

            $inputCharges = collect($request->delivery_charges);
            $existingChargeIds = $inputCharges->pluck('id')->filter();

            DeliveryCharge::whereNotIn('id', $existingChargeIds)->delete();

            foreach ($inputCharges as $chargeData) {
                if (isset($chargeData['id'])) {
                    DeliveryCharge::where('id', $chargeData['id'])->update([
                        'name' => $chargeData['name'],
                        'cost' => $chargeData['cost'],
                        'duration' => $chargeData['duration'],
                    ]);
                } else {
                    DeliveryCharge::create([
                        'name' => $chargeData['name'],
                        'cost' => $chargeData['cost'],
                        'duration' => $chargeData['duration'],
                    ]);
                }
            }
            return back()->with('success', 'Delivery charges updated successfully.');
        }

        if ($type === 'messenger') {
            $request->validate([
                'messenger_link' => 'nullable|url|max:500',
            ]);

            Setting::updateOrCreate(
                ['key' => 'messenger_link'],
                ['value' => $request->messenger_link ?? '']
            );
            Cache::forget('setting_messenger_link');

            return back()->with('success', 'Messenger link updated successfully.');
        }

        if ($type === 'branding') {
            $request->validate([
                'logo' => 'nullable|image|max:2048',
                'favicon' => 'nullable|image|max:1024',
            ]);

            if ($request->has('deleted_logo') && $request->deleted_logo) {
                $existing = get_setting('site_logo');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                    Setting::updateOrCreate(['key' => 'site_logo'], ['value' => '']);
                    Cache::forget('setting_site_logo');
                }
            }

            if ($request->hasFile('logo')) {
                $existing = get_setting('site_logo');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                }
                $path = FileUpload::uploadImage($request->file('logo'), 'branding');
                Setting::updateOrCreate(['key' => 'site_logo'], ['value' => $path]);
                Cache::forget('setting_site_logo');
            }

            if ($request->has('deleted_favicon') && $request->deleted_favicon) {
                $existing = get_setting('site_favicon');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                    Setting::updateOrCreate(['key' => 'site_favicon'], ['value' => '']);
                    Cache::forget('setting_site_favicon');
                }
            }

            if ($request->hasFile('favicon')) {
                $existing = get_setting('site_favicon');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                }
                $path = FileUpload::uploadImage($request->file('favicon'), 'branding');
                Setting::updateOrCreate(['key' => 'site_favicon'], ['value' => $path]);
                Cache::forget('setting_site_favicon');
            }

            return back()->with('success', 'Branding updated successfully.');
        }

        if ($type === 'footer') {
            $request->validate([
                'footer_description' => 'nullable|string|max:1000',
                'social_facebook' => 'nullable|url|max:255',
                'social_instagram' => 'nullable|url|max:255',
                'social_youtube' => 'nullable|url|max:255',
                'social_tiktok' => 'nullable|url|max:255',
            ]);

            $footerSettings = $request->only([
                'footer_description',
                'social_facebook',
                'social_instagram',
                'social_youtube',
                'social_tiktok',
            ]);

            foreach ($footerSettings as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
                Cache::forget('setting_' . $key);
            }

            return back()->with('success', 'Footer settings updated successfully.');
        }

        if ($type === 'faq') {
            $request->validate([
                'faqs' => 'nullable|array',
                'faqs.*.question' => 'required|string|max:500',
                'faqs.*.answer' => 'required|string|max:2000',
            ]);

            // Only keep non-empty faq entries just in case
            $faqs = collect($request->faqs ?? [])->filter(function ($faq) {
                return !empty($faq['question']) && !empty($faq['answer']);
            })->values()->toArray();

            Setting::updateOrCreate(['key' => 'faqs'], ['value' => json_encode($faqs)]);
            Cache::forget('setting_faqs');

            return back()->with('success', 'FAQs updated successfully.');
        }

        return back()->with('error', 'Invalid update type.');
    }

    private function handleImages($currentImages, $request, $fieldName, $folder)
    {
        if ($request->has('deleted_images')) {
            FileUpload::deleteImages($request->deleted_images);
            $currentImages = array_diff($currentImages, $request->deleted_images);
        }

        if ($request->hasFile($fieldName)) {
            $files = $request->file($fieldName);
            if (!is_array($files)) {
                $files = [$files];
            }
            $newImages = FileUpload::uploadImages($files, $folder);
            $currentImages = array_merge($currentImages, $newImages);
        }

        return array_values($currentImages);
    }
}
