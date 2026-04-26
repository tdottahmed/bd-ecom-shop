<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected static function booted(): void
    {
        $bust = fn () => Cache::forget('nav_categories');
        static::saved($bust);
        static::deleted($bust);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
