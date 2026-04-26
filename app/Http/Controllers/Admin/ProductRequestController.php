<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOrderEventEmail;
use App\Models\DeliveryCharge;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductRequest;
use App\Support\AdminRecipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ProductRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductRequest::with([
                'product:id,name,slug,images,sale_price,discounted_sale_price,product_type,stock',
                'product.product_variations:id,product_id,product_attribute_id,value,stock',
                'product.product_variations.product_attribute:id,name',
            ])
            ->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        $requests = $query->paginate(25)->withQueryString();

        $counts = [
            'all'       => ProductRequest::count(),
            'pending'   => ProductRequest::where('status', 'pending')->count(),
            'contacted' => ProductRequest::where('status', 'contacted')->count(),
            'fulfilled' => ProductRequest::where('status', 'fulfilled')->count(),
        ];

        return Inertia::render('Admin/ProductRequests/Index', [
            'requests'        => $requests,
            'counts'          => $counts,
            'delivery_charges' => DeliveryCharge::orderBy('cost')->get(),
            'filters'  => [
                'status' => $request->input('status', ''),
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    public function updateStatus(Request $request, ProductRequest $productRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,contacted,fulfilled'],
        ]);

        $productRequest->update(['status' => $data['status']]);

        return back()->with('success', 'Status updated.');
    }

    public function createOrder(Request $request, ProductRequest $productRequest)
    {
        $data = $request->validate([
            'customer_address'   => ['required', 'string', 'max:500'],
            'delivery_charge_id' => ['required', 'exists:delivery_charges,id'],
            'payment_method'     => ['required', 'in:cod,bkash,nagad'],
            'quantity'           => ['required', 'integer', 'min:1'],
            'price'              => ['required', 'numeric', 'min:0'],
            'note'               => ['nullable', 'string', 'max:500'],
        ]);

        $product = $productRequest->product;

        if (!$product) {
            return back()->with('error', 'The requested product no longer exists.');
        }

        $deliveryCharge = DeliveryCharge::findOrFail($data['delivery_charge_id']);

        $subtotal = round($data['price'] * $data['quantity'], 2);
        $total    = round($subtotal + $deliveryCharge->cost, 2);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'customer_name'      => $productRequest->customer_name,
                'customer_phone'     => $productRequest->customer_phone,
                'customer_address'   => $data['customer_address'],
                'delivery_charge_id' => $deliveryCharge->id,
                'delivery_cost'      => $deliveryCharge->cost,
                'subtotal'           => $subtotal,
                'total'              => $total,
                'status'             => 'pending',
                'payment_method'     => $data['payment_method'],
                'payment_status'     => 'unpaid',
            ]);

            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $product->id,
                'quantity'   => $data['quantity'],
                'price'      => $data['price'],
            ]);

            // Mark the request as fulfilled
            $productRequest->update(['status' => 'fulfilled']);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create order: ' . $e->getMessage());
        }

        // Admin notifications (non-blocking)
        try {
            Notification::send(
                AdminRecipients::users(),
                new \App\Notifications\Admin\OrderEvent(order: $order, event: 'created')
            );
            SendAdminOrderEventEmail::dispatch(orderId: $order->id, event: 'created')->afterCommit();
        } catch (\Throwable) {
            // Notification failure should not break the flow
        }

        return redirect()
            ->route('admin.orders.show', $order)
            ->with('success', "Order #{$order->id} created from request. Request marked as fulfilled.");
    }

    public function destroy(ProductRequest $productRequest)
    {
        $productRequest->delete();

        return back()->with('success', 'Request deleted.');
    }
}
