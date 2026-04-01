<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DeliveryCharge;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function index()
    {
        $deliveryCharges = DeliveryCharge::all();
        return Inertia::render('Checkout', [
            'deliveryCharges' => $deliveryCharges
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_address' => 'required|string',
            'create_account' => 'nullable|boolean',
            'customer_email' => 'nullable|email|required_if:create_account,1',
            'delivery_charge_id' => 'required|exists:delivery_charges,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.variations' => 'nullable|array',
        ]);

        $cart = $request->items;

        $totalQty = 0;
        $subtotal = 0;
        foreach ($cart as $item) {
            $totalQty += $item['quantity'];
            $subtotal += $item['price'] * $item['quantity'];
        }

        // Calculate discount
        $discountSetting = \App\Models\Setting::where('key', 'quantity_discounts')->value('value');
        $discountRules = $discountSetting ? json_decode($discountSetting, true) : [];

        $discountAmount = 0;
        if (!empty($discountRules)) {
            // Sort by qty desc
            usort($discountRules, function ($a, $b) {
                return $b['qty'] - $a['qty'];
            });

            foreach ($cart as $item) {
                $itemQty = $item['quantity'];
                foreach ($discountRules as $rule) {
                    if ($itemQty >= (int)$rule['qty']) {
                        $discountAmount += $itemQty * (float)$rule['discount'];
                        break;
                    }
                }
            }
        }

        $deliveryCharge = DeliveryCharge::find($request->delivery_charge_id);
        $total = $subtotal + $deliveryCharge->cost - $discountAmount;

        DB::beginTransaction();
        try {
            $shouldCreateAccount = $request->boolean('create_account');
            $checkoutUser = $request->user();

            if (!$checkoutUser && $shouldCreateAccount && $request->filled('customer_email')) {
                $checkoutUser = User::firstOrCreate(
                    ['email' => $request->customer_email],
                    [
                        'name' => $request->customer_name,
                        'phone' => $request->customer_phone,
                        'address' => $request->customer_address,
                        'password' => Hash::make(Str::random(24)),
                    ]
                );
            }

            $order = Order::create([
                'user_id' => $checkoutUser?->id,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'customer_address' => $request->customer_address,
                'delivery_charge_id' => $deliveryCharge->id,
                'delivery_cost' => $deliveryCharge->cost,
                'subtotal' => $subtotal,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cart as $item) {
                $product = \App\Models\Product::lockForUpdate()->find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Product not found");
                }

                // Check and decrement variation stock if variations exist
                $variationIds = [];
                $hasVariations = !empty($item['variations']) && is_array($item['variations']);

                if ($hasVariations) {
                    foreach ($item['variations'] as $variationData) {
                        $variation = \App\Models\ProductVariation::lockForUpdate()
                            ->where('id', $variationData['id'])
                            ->where('product_id', $product->id)
                            ->first();

                        if (!$variation) {
                            throw new \Exception("Variation not found for product: " . $product->name);
                        }

                        // Check variation stock
                        if ($variation->stock !== null && !$product->is_preorder && $variation->stock < $item['quantity']) {
                            throw new \Exception("Insufficient stock for variation: " . $variation->value . " of product: " . $product->name);
                        }

                        // Decrement variation stock
                        if ($variation->stock !== null) {
                            $variation->decrement('stock', $item['quantity']);
                        }

                        $variationIds[] = $variation->id;
                    }
                }

                // Check main product stock only if no variations are selected (Simple Product)
                // OR if we want to enforce main stock limits even for variable products (optional, usually not if main stock is 0 but variations have stock)
                // Here we assume if variations are checked, we trust variation stock.
                if (!$hasVariations && !$product->is_preorder && $product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: " . $product->name);
                }

                // Decrement product stock (Keep it largely in sync, or go negative if tracking allows)
                // We typically assume product stock should track total, but if it doesn't, we shouldn't block sales if variation has stock.
                $product->decrement('stock', $item['quantity']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'variation_ids' => !empty($variationIds) ? $variationIds : null,
                ]);
            }

            DB::commit();

            if (!$request->user() && $checkoutUser && $shouldCreateAccount) {
                Auth::login($checkoutUser);
            }

            return redirect()->route('order.success', ['order' => $order->id])->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Checkout Error: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return redirect()->back()->with('error', 'Something went wrong. Please try again. Error: ' . $e->getMessage());
        }
    }

    public function success(Order $order)
    {
        return Inertia::render('OrderSuccess', ['order' => $order]);
    }

    public function getOrders(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'integer',
        ]);

        $orders = Order::whereIn('id', $request->order_ids)
            ->with([
                'items.product',
                'items.product.product_variations.product_attribute'
            ]) // Eager load items, products, and variations
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function destroy(Order $order)
    {
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be deleted.'], 403);
        }

        try {
            DB::beginTransaction();

            // Restore stock
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }

                // Restore variation stock if variations exist
                if (!empty($item->variation_ids) && is_array($item->variation_ids)) {
                    foreach ($item->variation_ids as $variationId) {
                        $variation = \App\Models\ProductVariation::find($variationId);
                        if ($variation && $variation->stock !== null) {
                            $variation->increment('stock', $item->quantity);
                        }
                    }
                }
            }

            // Delete order items and order
            $order->items()->delete();
            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Order deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete order.'], 500);
        }
    }
}
