<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class WebsiteSetting extends Model
{
    protected $guarded = [];

    protected $casts = [
        'banner_images' => 'array',
        'banner_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        $bust = fn () => Cache::forget('website_settings');

        static::saved($bust);
        static::deleted($bust);
    }
}
