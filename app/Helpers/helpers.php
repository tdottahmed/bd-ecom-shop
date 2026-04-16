<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (! function_exists('get_setting')) {
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

if (! function_exists('flush_settings_cache')) {
    function flush_settings_cache(): void
    {
        Cache::forget('all_settings');
    }
}

if (! function_exists('default_theme_colors')) {
    /**
     * @return array<string, string> hex colors keyed by token name
     */
    function default_theme_colors(): array
    {
        return [
            'primary' => '#E11D6D',
            'tint' => '#F87BB4',
            'dark' => '#1A111A',
            'accent' => '#FF9545',
            'success' => '#16B57D',
            'bg' => '#FFEBF2',
            'ivory' => '#FDF9F4',
        ];
    }
}

if (! function_exists('theme_hex_to_rgb_channels')) {
    /**
     * Tailwind-compatible space-separated RGB channels (e.g. "225 29 109").
     */
    function theme_hex_to_rgb_channels(string $hex): string
    {
        $hex = ltrim(strtoupper($hex), '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        if (strlen($hex) !== 6) {
            return '0 0 0';
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        return "{$r} {$g} {$b}";
    }
}

if (! function_exists('sanitize_theme_hex')) {
    function sanitize_theme_hex(mixed $value, string $fallback): string
    {
        if (! is_string($value)) {
            return $fallback;
        }
        $value = trim($value);
        if (! preg_match('/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/', $value)) {
            return $fallback;
        }
        if (strlen($value) === 4) {
            $value = '#'.$value[1].$value[1].$value[2].$value[2].$value[3].$value[3];
        }

        return strtoupper($value);
    }
}

if (! function_exists('theme_colors')) {
    /**
     * Resolved storefront palette (merged with defaults, validated hex).
     *
     * @return array<string, string>
     */
    function theme_colors(): array
    {
        $defaults = default_theme_colors();
        $stored = json_decode(get_setting('theme_colors', '{}'), true);
        if (! is_array($stored)) {
            $stored = [];
        }
        $out = [];
        foreach ($defaults as $key => $fallback) {
            $out[$key] = sanitize_theme_hex($stored[$key] ?? null, $fallback);
        }

        return $out;
    }
}

if (! function_exists('theme_colors_style_tag')) {
    /**
     * CSS rules for :root — inject in the document head for first paint without JS.
     */
    function theme_colors_style_tag(): string
    {
        $c = theme_colors();
        $parts = [];
        foreach ($c as $key => $hex) {
            $parts[] = "--color-brand-{$key}: ".theme_hex_to_rgb_channels($hex).';';
            $parts[] = "--brand-{$key}: {$hex};";
        }

        return ':root { '.implode(' ', $parts).' }';
    }
}
