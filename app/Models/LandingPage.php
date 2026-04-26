<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandingPage extends Model
{
    protected $fillable = [
        'product_id',
        'category_id',
        'slug',
        'page_title',
        'meta_description',
        'hero_headline',
        'hero_subheadline',
        'hero_badge',
        'hero_image',
        'hero_cta_text',
        'hero_cta_url',
        'hero_layout',
        'hero_bg_color',
        'hero_text_color',
        'accent_color',
        'global_bg_color',
        'global_font_family',
        'sections',
        'is_published',
    ];

    protected $casts = [
        'sections'     => 'array',
        'is_published' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Category::class);
    }

    public function getPublicUrlAttribute(): string
    {
        return url('/lp/' . $this->slug);
    }
}
