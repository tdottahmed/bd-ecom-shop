<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductRequest extends Model
{
    protected $guarded = [];

    const STATUS_PENDING   = 'pending';
    const STATUS_CONTACTED = 'contacted';
    const STATUS_FULFILLED = 'fulfilled';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
