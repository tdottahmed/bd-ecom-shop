<?php

namespace App\Http\Controllers;

use App\Models\DeliveryCharge;
use App\Models\LandingPage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LandingPageController extends Controller
{
    public function show(string $slug)
    {
        $page = LandingPage::where('slug', $slug)
            ->with([
                'product:id,name,sale_price,discounted_sale_price,stock,is_preorder,product_type',
                'product.product_variations.product_attribute',
                'category:id,title,slug,image',
            ])
            ->firstOrFail();

        if (! $page->is_published && ! auth()->check()) {
            abort(404);
        }

        $deliveryCharges    = DeliveryCharge::orderBy('cost')->get(['id', 'name', 'cost']);
        $categoryProducts   = null;

        if ($page->category_id) {
            $categoryProducts = Product::where('category_id', $page->category_id)
                ->where('stock', '>', 0)
                ->orWhere('is_preorder', true)
                ->with(['product_variations' => fn($q) => $q->with('product_attribute')])
                ->orderBy('name')
                ->get([
                    'id',
                    'category_id',
                    'name',
                    'slug',
                    'sale_price',
                    'discounted_sale_price',
                    'has_discount',
                    'discount_value',
                    'stock',
                    'is_preorder',
                    'images',
                    'product_type',
                ]);
        }

        return view('landing-page', compact('page', 'deliveryCharges', 'categoryProducts'));
    }

    public function order(Request $request, string $slug)
    {
        $page = LandingPage::where('slug', $slug)
            ->where('is_published', true)
            ->with([
                'product:id,name,sale_price,discounted_sale_price,stock,is_preorder,product_type',
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

        $product      = $page->product;
        $unitPrice    = $product->discounted_sale_price ?: $product->sale_price;
        $quantity     = (int) $validated['quantity'];
        $variationIds = $validated['variation_ids'] ?? [];

        // For variant products, price lives on the variation record, not the product
        if ($product->product_type === 'variant' && ! empty($variationIds)) {
            $firstVar = $product->product_variations->firstWhere('id', $variationIds[0]);
            if ($firstVar && $firstVar->price) {
                $unitPrice = (float) $firstVar->price;
            }
        }

        $deliveryCharge = DeliveryCharge::findOrFail($validated['delivery_charge_id']);
        $subtotal       = $unitPrice * $quantity;
        $total          = $subtotal + $deliveryCharge->cost;

        DB::beginTransaction();
        try {
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

    public function categoryOrder(Request $request, string $slug)
    {
        $page = LandingPage::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        if (! $page->category_id) {
            return response()->json(['success' => false, 'message' => 'No category linked to this page.'], 422);
        }

        $validated = $request->validate([
            'customer_name'        => 'required|string|max:255',
            'customer_phone'       => 'required|string|max:20',
            'customer_address'     => 'required|string|max:500',
            'delivery_charge_id'   => 'required|exists:delivery_charges,id',
            'items'                => 'required|array|min:1',
            'items.*.product_id'   => 'required|integer|exists:products,id',
            'items.*.quantity'     => 'required|integer|min:1|max:100',
            'items.*.variation_ids'   => 'nullable|array',
            'items.*.variation_ids.*' => 'integer|exists:product_variations,id',
        ]);

        $deliveryCharge = DeliveryCharge::findOrFail($validated['delivery_charge_id']);

        $productIds = collect($validated['items'])->pluck('product_id')->unique()->values();
        $products   = Product::whereIn('id', $productIds)
            ->where('category_id', $page->category_id)
            ->get()
            ->keyBy('id');

        if ($products->count() !== $productIds->count()) {
            return response()->json(['success' => false, 'message' => 'One or more products are invalid.'], 422);
        }

        $subtotal  = 0;
        $orderRows = [];

        DB::beginTransaction();
        try {
            foreach ($validated['items'] as $item) {
                $product      = $products[$item['product_id']];
                $qty          = (int) $item['quantity'];
                $variationIds = $item['variation_ids'] ?? [];
                $unitPrice    = $product->discounted_sale_price ?: $product->sale_price;

                foreach ($variationIds as $varId) {
                    $variation = ProductVariation::lockForUpdate()
                        ->where('id', $varId)
                        ->where('product_id', $product->id)
                        ->firstOrFail();

                    if ($variation->stock !== null && ! $product->is_preorder && $variation->stock < $qty) {
                        throw new \Exception("Insufficient stock for \"{$variation->value}\" in \"{$product->name}\".");
                    }

                    if ($variation->stock !== null) {
                        $variation->decrement('stock', $qty);
                    }

                    // Use variation price if set
                    if ($variation->price) {
                        $unitPrice = (float) $variation->price;
                    }
                }

                if (empty($variationIds)) {
                    if (! $product->is_preorder && $product->stock !== null && $product->stock < $qty) {
                        throw new \Exception("Insufficient stock for \"{$product->name}\".");
                    }
                }

                $product->decrement('stock', $qty);

                $subtotal   += $unitPrice * $qty;
                $orderRows[] = [
                    'product_id'   => $product->id,
                    'quantity'     => $qty,
                    'price'        => $unitPrice,
                    'variation_ids' => ! empty($variationIds) ? $variationIds : null,
                ];
            }

            $total = $subtotal + $deliveryCharge->cost;

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

            foreach ($orderRows as $row) {
                OrderItem::create(array_merge(['order_id' => $order->id], $row));
            }

            DB::commit();

            return response()->json([
                'success'  => true,
                'order_id' => $order->id,
                'message'  => 'Your order has been placed successfully!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category landing page order error: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
