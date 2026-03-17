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
            'setting' => WebsiteSetting::first() ?? ['banner_active' => true, 'banner_images' => []],
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
            $bannerImages =  $this->handleImages($setting->banner_images ?? [], $request, 'banner_images', 'banners');
            $setting = WebsiteSetting::firstOrNew();
            $setting->banner_active = $request->banner_active;

            $setting->banner_images = $bannerImages;
            $setting->save();
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

            // Update or Create charges
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

            $setting = WebsiteSetting::firstOrNew();

            if ($request->has('deleted_logo') && $request->deleted_logo) {
                if ($setting->logo) {
                    FileUpload::deleteImage($setting->logo);
                    $setting->logo = null;
                }
            }

            if ($request->hasFile('logo')) {
                if ($setting->logo) {
                    FileUpload::deleteImage($setting->logo);
                }
                $setting->logo = FileUpload::uploadImage($request->file('logo'), 'branding');
            }

            if ($request->has('deleted_favicon') && $request->deleted_favicon) {
                if ($setting->favicon) {
                    FileUpload::deleteImage($setting->favicon);
                    $setting->favicon = null;
                }
            }

            if ($request->hasFile('favicon')) {
                if ($setting->favicon) {
                    FileUpload::deleteImage($setting->favicon);
                }
                $setting->favicon = FileUpload::uploadImage($request->file('favicon'), 'branding');
            }

            $setting->save();

            return back()->with('success', 'Branding updated successfully.');
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
