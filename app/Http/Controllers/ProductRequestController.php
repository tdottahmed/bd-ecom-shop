<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductRequest;
use App\Notifications\Admin\ProductRequestReceived;
use App\Support\AdminRecipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class ProductRequestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id'      => ['required', 'exists:products,id'],
            'customer_name'   => ['required', 'string', 'max:100'],
            'customer_phone'  => ['required', 'string', 'max:20'],
            'quantity'        => ['required', 'integer', 'min:1', 'max:999'],
            'note'            => ['nullable', 'string', 'max:500'],
            'variation_label' => ['nullable', 'string', 'max:255'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        $productRequest = ProductRequest::create([
            'product_id'      => $product->id,
            'product_name'    => $product->name,
            'variation_label' => $data['variation_label'] ?? null,
            'customer_name'   => $data['customer_name'],
            'customer_phone'  => $data['customer_phone'],
            'quantity'        => $data['quantity'],
            'note'            => $data['note'] ?? null,
        ]);

        // Notify admins (non-blocking)
        try {
            Notification::send(
                AdminRecipients::users(),
                new ProductRequestReceived($productRequest)
            );
        } catch (\Throwable) {
            // Notification failure must not block the customer response
        }

        return response()->json(['message' => 'Your request has been submitted. We will contact you soon!']);
    }
}
