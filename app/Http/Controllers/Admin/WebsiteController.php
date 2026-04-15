<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryCharge;
use App\Models\Setting;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Website/Index', [
            'settings' => [
                'smtp_host' => get_setting('smtp_host', ''),
                'smtp_port' => get_setting('smtp_port', '587'),
                'smtp_username' => get_setting('smtp_username', ''),
                'smtp_password' => get_setting('smtp_password', ''),
                'smtp_encryption' => get_setting('smtp_encryption', 'tls'),
                'smtp_from_address' => get_setting('smtp_from_address', ''),
                'smtp_from_name' => get_setting('smtp_from_name', ''),
                'banner_active' => get_setting('banner_active', '1') === '1',
                'banner_images' => json_decode(get_setting('banner_images', '[]'), true),
                'faqs' => json_decode(get_setting('faqs', '[]'), true),
                'site_logo' => get_setting('site_logo'),
                'site_favicon' => get_setting('site_favicon'),
                'auth_page_image' => get_setting('auth_page_image'),
                'footer_description' => get_setting('footer_description'),
                'social_facebook' => get_setting('social_facebook'),
                'social_instagram' => get_setting('social_instagram'),
                'social_youtube' => get_setting('social_youtube'),
                'social_tiktok' => get_setting('social_tiktok'),
                'contact_address' => get_setting('contact_address', 'Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia'),
                'contact_phone' => get_setting('contact_phone', '+60 3 1234 5678'),
                'contact_email' => get_setting('contact_email', 'support@truebymalaysia.com'),
                'contact_hours' => get_setting('contact_hours', 'Mon–Fri: 9am–6pm, Sat: 10am–2pm'),
                'contact_map_embed' => get_setting('contact_map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.751352458897!2d101.7093247!3d3.159495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x9e3afdd17c8a9056!2sPetronas%20Twin%20Towers!5e0!3m2!1sen!2smy!4v1711867123456!5m2!1sen!2smy'),
                'about_stats' => json_decode(get_setting('about_stats', '[{"value":"10K+","label":"Happy Customers"},{"value":"500+","label":"Products Listed"},{"value":"99%","label":"Genuine Products"},{"value":"24h","label":"Support Response"}]'), true),
                'about_testimonials' => json_decode(get_setting('about_testimonials', '[{"name":"Nusrat Jahan","role":"Regular Customer","quote":"Packaging was neat, delivery was fast, and the product quality matched exactly what I saw on the website.","rating":5},{"name":"Arif Hasan","role":"First-time Buyer","quote":"I placed my order at night and got updates quickly. The entire buying process felt smooth and professional.","rating":5},{"name":"Sadia Rahman","role":"Repeat Customer","quote":"TrueBuy has become my go-to store. Prices are fair, service is responsive, and products are always genuine.","rating":5}]'), true),
                'cta_enabled' => get_setting('cta_enabled', '1') === '1',
                'customer_auth_enabled' => get_setting('customer_auth_enabled', '0') === '1',
                'blog_enabled' => get_setting('blog_enabled', '1') === '1',
                'cta_title' => get_setting('cta_title', 'Ready to Discover Something Exceptional?'),
                'cta_description' => get_setting('cta_description', 'Explore premium picks curated for modern living, or reach out and let us help you choose the right products.'),
                'cta_browse_text' => get_setting('cta_browse_text', 'Browse Our Products'),
                'cta_browse_link' => get_setting('cta_browse_link', '/products'),
                'cta_contact_text' => get_setting('cta_contact_text', 'Contact Us'),
                'cta_contact_link' => get_setting('cta_contact_link', '/contact-us'),
                'additional_cost' => get_setting('additional_cost', '0'),
                'scheduled_product_update_enabled' => get_setting('scheduled_product_update_enabled', '0') === '1',
                'scheduled_product_update_cron' => get_setting('scheduled_product_update_cron', '0 0 * * *'),
                'admin_notification_emails' => env('ADMIN_NOTIFICATION_EMAILS', ''),
                'admin_notification_enabled' => env('ADMIN_NOTIFICATION_ENABLED', true),
            ],
            'deliveryCharges' => DeliveryCharge::all(),
            'messengerLink' => get_setting('messenger_link'),
            'whatsappLink' => get_setting('whatsapp_link'),
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

        if ($type === 'chat_links') {
            $request->validate([
                'messenger_link' => 'nullable|url|max:500',
                'whatsapp_link' => 'nullable|url|max:500',
            ]);

            Setting::updateOrCreate(['key' => 'messenger_link'], ['value' => $request->messenger_link ?? '']);
            Setting::updateOrCreate(['key' => 'whatsapp_link'], ['value' => $request->whatsapp_link ?? '']);
            Cache::forget('setting_messenger_link');
            Cache::forget('setting_whatsapp_link');

            return back()->with('success', 'Chat links updated successfully.');
        }

        if ($type === 'blog') {
            $request->validate([
                'blog_enabled' => 'required|boolean',
            ]);

            Setting::updateOrCreate(
                ['key' => 'blog_enabled'],
                ['value' => $request->boolean('blog_enabled') ? '1' : '0']
            );
            Cache::forget('setting_blog_enabled');

            return back()->with('success', 'Blog visibility settings updated successfully.');
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

            if ($request->has('deleted_auth_page_image') && $request->deleted_auth_page_image) {
                $existing = get_setting('auth_page_image');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                    Setting::updateOrCreate(['key' => 'auth_page_image'], ['value' => '']);
                    Cache::forget('setting_auth_page_image');
                }
            }

            if ($request->hasFile('auth_page_image')) {
                $existing = get_setting('auth_page_image');
                if ($existing) {
                    FileUpload::deleteImage($existing);
                }
                $path = FileUpload::uploadImage($request->file('auth_page_image'), 'branding');
                Setting::updateOrCreate(['key' => 'auth_page_image'], ['value' => $path]);
                Cache::forget('setting_auth_page_image');
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
                Cache::forget('setting_'.$key);
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
                return ! empty($faq['question']) && ! empty($faq['answer']);
            })->values()->toArray();

            Setting::updateOrCreate(['key' => 'faqs'], ['value' => json_encode($faqs)]);
            Cache::forget('setting_faqs');

            return back()->with('success', 'FAQs updated successfully.');
        }

        if ($type === 'contact') {
            $request->validate([
                'contact_address' => 'nullable|string|max:500',
                'contact_phone' => 'nullable|string|max:100',
                'contact_email' => 'nullable|email|max:255',
                'contact_hours' => 'nullable|string|max:255',
                'contact_map_embed' => 'nullable|string|max:2000',
            ]);
            foreach (['contact_address', 'contact_phone', 'contact_email', 'contact_hours', 'contact_map_embed'] as $key) {
                Setting::updateOrCreate(['key' => $key], ['value' => $request->input($key, '')]);
                Cache::forget('setting_'.$key);
            }

            return back()->with('success', 'Contact info updated.');
        }

        if ($type === 'about') {
            $request->validate([
                'about_stats' => 'nullable|array',
                'about_stats.*.value' => 'required|string|max:50',
                'about_stats.*.label' => 'required|string|max:100',
                'about_testimonials' => 'nullable|array',
                'about_testimonials.*.name' => 'required|string|max:255',
                'about_testimonials.*.role' => 'required|string|max:255',
                'about_testimonials.*.quote' => 'required|string|max:1000',
                'about_testimonials.*.rating' => 'required|integer|min:1|max:5',
            ]);
            $stats = collect($request->about_stats ?? [])->filter(fn ($s) => ! empty($s['value']) && ! empty($s['label']))->values()->toArray();
            $testimonials = collect($request->about_testimonials ?? [])->filter(fn ($t) => ! empty($t['name']) && ! empty($t['quote']))->values()->toArray();
            Setting::updateOrCreate(['key' => 'about_stats'], ['value' => json_encode($stats)]);
            Setting::updateOrCreate(['key' => 'about_testimonials'], ['value' => json_encode($testimonials)]);
            Cache::forget('setting_about_stats');
            Cache::forget('setting_about_testimonials');

            return back()->with('success', 'About page settings updated.');
        }

        if ($type === 'cta') {
            $request->validate([
                'cta_enabled' => 'required|boolean',
                'cta_title' => 'nullable|string|max:255',
                'cta_description' => 'nullable|string|max:1000',
                'cta_browse_text' => 'nullable|string|max:100',
                'cta_browse_link' => 'nullable|string|max:255',
                'cta_contact_text' => 'nullable|string|max:100',
                'cta_contact_link' => 'nullable|string|max:255',
            ]);

            $ctaSettings = [
                'cta_enabled' => $request->boolean('cta_enabled') ? '1' : '0',
                'cta_title' => $request->input('cta_title', ''),
                'cta_description' => $request->input('cta_description', ''),
                'cta_browse_text' => $request->input('cta_browse_text', ''),
                'cta_browse_link' => $request->input('cta_browse_link', ''),
                'cta_contact_text' => $request->input('cta_contact_text', ''),
                'cta_contact_link' => $request->input('cta_contact_link', ''),
            ];

            foreach ($ctaSettings as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                Cache::forget('setting_'.$key);
            }

            return back()->with('success', 'CTA settings updated successfully.');
        }

        if ($type === 'smtp') {
            $request->validate([
                'smtp_host' => 'nullable|string|max:255',
                'smtp_port' => 'nullable|integer|min:1|max:65535',
                'smtp_username' => 'nullable|string|max:255',
                'smtp_password' => 'nullable|string|max:500',
                'smtp_encryption' => 'nullable|in:tls,ssl,starttls,',
                'smtp_from_address' => 'nullable|email|max:255',
                'smtp_from_name' => 'nullable|string|max:255',
            ]);

            $smtpKeys = ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption', 'smtp_from_address', 'smtp_from_name'];
            foreach ($smtpKeys as $key) {
                Setting::updateOrCreate(['key' => $key], ['value' => (string) ($request->input($key) ?? '')]);
                Cache::forget('setting_'.$key);
            }

            // Persist to .env as source-of-truth for workers/CLI
            $encryption = (string) $request->input('smtp_encryption', '');
            $scheme = $encryption === 'ssl' ? 'smtps' : 'smtp';
            $this->updateEnvValues([
                'MAIL_MAILER' => $request->filled('smtp_host') ? 'smtp' : 'log',
                'MAIL_HOST' => (string) $request->input('smtp_host', ''),
                'MAIL_PORT' => (string) $request->input('smtp_port', ''),
                'MAIL_USERNAME' => (string) $request->input('smtp_username', ''),
                'MAIL_PASSWORD' => (string) $request->input('smtp_password', ''),
                // Keep both keys for broad compatibility with custom/legacy configs
                'MAIL_ENCRYPTION' => $encryption,
                'MAIL_SCHEME' => $request->filled('smtp_host') ? $scheme : 'null',
                'MAIL_FROM_ADDRESS' => (string) $request->input('smtp_from_address', ''),
                'MAIL_FROM_NAME' => (string) $request->input('smtp_from_name', ''),
            ]);

            // Ensure new env values are reflected in app config immediately
            Artisan::call('config:clear');

            return back()->with('success', 'SMTP settings updated successfully.');
        }

        if ($type === 'scheduler') {
            $request->validate([
                'additional_cost'                    => 'nullable|numeric|min:0',
                'scheduled_product_update_enabled'   => 'required|boolean',
                'scheduled_product_update_cron'      => 'nullable|string|max:100',
            ]);

            Setting::updateOrCreate(['key' => 'additional_cost'], ['value' => (string) ($request->input('additional_cost', 0))]);
            Setting::updateOrCreate(['key' => 'scheduled_product_update_enabled'], ['value' => $request->boolean('scheduled_product_update_enabled') ? '1' : '0']);
            Setting::updateOrCreate(['key' => 'scheduled_product_update_cron'], ['value' => $request->input('scheduled_product_update_cron', '0 0 * * *')]);

            Cache::forget('setting_additional_cost');
            Cache::forget('setting_scheduled_product_update_enabled');
            Cache::forget('setting_scheduled_product_update_cron');

            return back()->with('success', 'Scheduler settings updated successfully.');
        }

        if ($type === 'customer_auth') {
            $request->validate([
                'customer_auth_enabled' => 'required|boolean',
            ]);

            Setting::updateOrCreate(
                ['key' => 'customer_auth_enabled'],
                ['value' => $request->boolean('customer_auth_enabled') ? '1' : '0']
            );
            Cache::forget('setting_customer_auth_enabled');

            return back()->with('success', 'Customer authentication setting updated successfully.');
        }

        if ($type === 'admin_notifications') {
            $request->validate([
                'admin_notification_emails' => 'nullable|string|max:2000',
                'admin_notification_enabled' => 'required|boolean',
            ]);

            $this->updateEnvValues([
                'ADMIN_NOTIFICATION_EMAILS' => (string) $request->input('admin_notification_emails', ''),
                'ADMIN_NOTIFICATION_ENABLED' => $request->boolean('admin_notification_enabled') ? 'true' : 'false',
            ]);

            return back()->with('success', 'Admin notifications updated successfully.');
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
            if (! is_array($files)) {
                $files = [$files];
            }
            $newImages = FileUpload::uploadImages($files, $folder);
            $currentImages = array_merge($currentImages, $newImages);
        }

        return array_values($currentImages);
    }

    /**
     * Update or append key-value pairs in .env safely.
     *
     * @param  array<string, string>  $values
     */
    private function updateEnvValues(array $values): void
    {
        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            return;
        }

        $content = File::get($envPath);

        foreach ($values as $key => $value) {
            $escapedValue = $this->formatEnvValue($value);
            $pattern = "/^{$key}=.*$/m";
            $line = "{$key}={$escapedValue}";

            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, $line, $content) ?? $content;
            } else {
                $content .= PHP_EOL.$line;
            }
        }

        File::put($envPath, $content);
    }

    private function formatEnvValue(string $value): string
    {
        if ($value === '' || strtolower($value) === 'null') {
            return 'null';
        }

        // Quote values containing spaces, #, or quotes
        if (preg_match('/\s|#|"|\'/', $value)) {
            return '"'.str_replace('"', '\"', $value).'"';
        }

        return $value;
    }
}
