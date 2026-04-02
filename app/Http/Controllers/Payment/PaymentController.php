<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function failed(Request $request)
    {
        $order = $request->query('order')
            ? Order::find($request->query('order'))
            : null;

        return Inertia::render('PaymentFailed', [
            'order' => $order,
        ]);
    }
}
