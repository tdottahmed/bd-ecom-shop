<?php

namespace App\Http\Controllers;

use App\Models\DeliveryCharge;
use App\Models\LandingPage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LandingPageController extends Controller
{
    public function show(string $slug)
    {
        $page = LandingPage::where('slug', $slug)
            ->where('is_published', true)
            ->with([
                'product:id,name,sale_price,discounted_sale_price,stock,is_preorder',
                'product.product_variations.product_attribute',
            ])
            ->firstOrFail();

        $deliveryCharges = DeliveryCharge::orderBy('cost')->get(['id', 'name', 'cost']);

        return view('landing-page', compact('page', 'deliveryCharges'));
    }

    public function order(Request $request, string $slug)
    {
        $page = LandingPage::where('slug', $slug)
            ->where('is_published', true)
            ->with([
                'product:id,name,sale_price,discounted_sale_price,stock,is_preorder',
                'product.product_variations',
            ])
            ->firstOrFail();

        if (! $page->product) {
            return response()->json(['success' => false, 'message' => 'No product is linked to this page.'], 422);
        }

        $validated = $request->validate([
            'customer_name'      => 'required|string|max:255',
            'customer_phone'     => 'required|string|max:20',
            'customer_address'   => 'required|string|max:500',
            'delivery_charge_id' => 'required|exists:delivery_charges,id',
            'quantity'           => 'required|integer|min:1|max:100',
            'variation_ids'      => 'nullable|array',
            'variation_ids.*'    => 'integer|exists:product_variations,id',
        ]);

        $product       = $page->product;
        $unitPrice     = $product->discounted_sale_price ?: $product->sale_price;
        $quantity      = (int) $validated['quantity'];
        $deliveryCharge = DeliveryCharge::findOrFail($validated['delivery_charge_id']);
        $subtotal      = $unitPrice * $quantity;
        $total         = $subtotal + $deliveryCharge->cost;
        $variationIds  = $validated['variation_ids'] ?? [];

        DB::beginTransaction();
        try {
            // Validate & decrement variation stock
            foreach ($variationIds as $variationId) {
                $variation = ProductVariation::lockForUpdate()
                    ->where('id', $variationId)
                    ->where('product_id', $product->id)
                    ->firstOrFail();

                if ($variation->stock !== null && ! $product->is_preorder && $variation->stock < $quantity) {
                    throw new \Exception("Insufficient stock for \"{$variation->value}\".");
                }

                if ($variation->stock !== null) {
                    $variation->decrement('stock', $quantity);
                }
            }

            // Validate & decrement product stock (simple products)
            if (empty($variationIds)) {
                if (! $product->is_preorder && $product->stock < $quantity) {
                    throw new \Exception('Insufficient stock. Please reduce the quantity.');
                }
            }
            $product->decrement('stock', $quantity);

            $order = Order::create([
                'customer_name'      => $validated['customer_name'],
                'customer_phone'     => $validated['customer_phone'],
                'customer_address'   => $validated['customer_address'],
                'delivery_charge_id' => $deliveryCharge->id,
                'delivery_cost'      => $deliveryCharge->cost,
                'subtotal'           => $subtotal,
                'total'              => $total,
                'status'             => 'pending',
            ]);

            OrderItem::create([
                'order_id'      => $order->id,
                'product_id'    => $product->id,
                'quantity'      => $quantity,
                'price'         => $unitPrice,
                'variation_ids' => ! empty($variationIds) ? $variationIds : null,
            ]);

            DB::commit();

            return response()->json([
                'success'  => true,
                'order_id' => $order->id,
                'message'  => 'Your order has been placed successfully!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Landing page order error: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
