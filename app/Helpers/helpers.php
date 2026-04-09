<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('get_setting')) {
    /**
     * Retrieve a setting value by key.
     *
     * All settings are loaded from the DB in a single query and cached together
     * under one cache key. This means N get_setting() calls = 1 DB query max.
     */
    function get_setting(string $key, mixed $default = null): mixed
    {
        $settings = Cache::rememberForever('all_settings', function () {
            return Setting::all()->pluck('value', 'key')->all();
        });

        return $settings[$key] ?? $default;
    }
}

if (!function_exists('flush_settings_cache')) {
    function flush_settings_cache(): void
    {
        Cache::forget('all_settings');
    }
}
