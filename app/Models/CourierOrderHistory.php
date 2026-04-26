<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierOrderHistory extends Model
{
    protected $fillable = [
        'phone',
        'data',
        'summaries',
        'success_ratio',
        'total_orders',
        'successful_orders',
        'cancel_orders',
        'last_checked_at',
    ];

    protected $casts = [
        'data'               => 'array',
        'summaries'          => 'array',
        'last_checked_at'    => 'datetime',
        'success_ratio'      => 'float',
        'total_orders'       => 'integer',
        'successful_orders'  => 'integer',
        'cancel_orders'      => 'integer',
    ];
}
