<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'customer_address',
        'delivery_charge_id',
        'delivery_cost',
        'subtotal',
        'total',
        'status',
        'courier',
        'consignment_id',
        'tracking_code',
        'pathao_city_id',
        'pathao_zone_id',
        'pathao_area_id',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryCharge()
    {
        return $this->belongsTo(DeliveryCharge::class);
    }
    public function courierOrderHistory()
    {
        return $this->hasOne(CourierOrderHistory::class, 'phone', 'customer_phone');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
