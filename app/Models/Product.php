<?php

namespace App\Models;

use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model implements Feedable
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'images' => 'json',
        'qty_price' => 'array',
        'purchase_price' => 'float',
        'sale_price' => 'float',
        'moq_price' => 'float',
        'uan_price' => 'float',
        'stock' => 'integer',
        'is_preorder' => 'boolean',
        'has_discount' => 'boolean',
        'discount_value' => 'float',
        'discounted_sale_price' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function product_variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function toFeedItem(): FeedItem
    {
        return FeedItem::create([
            'id' => (string) $this->id,
            'title' => (string) ($this->title ?? $this->slug ?? 'Product'),
            'summary' => (string) ($this->short_description ?? $this->description ?? ''),
            'updated' => $this->updated_at,
            'link' => route('products.show', $this->slug),
            'authorName' => config('app.name'),
        ]);
    }

    public static function getFeedItems()
    {
        return static::query()
            ->whereNotNull('slug')
            ->latest('updated_at')
            ->limit(50)
            ->get();
    }
}
