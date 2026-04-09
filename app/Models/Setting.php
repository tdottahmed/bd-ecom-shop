<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected static function booted(): void
    {
        // Bust the single batch cache whenever any setting changes.
        $bust = fn () => Cache::forget('all_settings');

        static::saved($bust);
        static::deleted($bust);
    }
}
