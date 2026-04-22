<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewProductRequest extends Model
{
    protected $guarded = [];

    const STATUS_PENDING   = 'pending';
    const STATUS_REVIEWING = 'reviewing';
    const STATUS_APPROVED  = 'approved';
    const STATUS_REJECTED  = 'rejected';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
