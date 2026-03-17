<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
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
}
