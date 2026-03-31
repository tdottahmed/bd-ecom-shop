<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandingPage extends Model
{
    protected $fillable = [
        'product_id',
        'slug',
        'page_title',
        'meta_description',
        'hero_headline',
        'hero_subheadline',
        'hero_badge',
        'hero_image',
        'hero_cta_text',
        'hero_cta_url',
        'accent_color',
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

    public function getPublicUrlAttribute(): string
    {
        return url('/lp/' . $this->slug);
    }
}
