<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOrderEventEmail;
use App\Models\Order;
use App\Support\AdminRecipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['items.product', 'deliveryCharge', 'courierOrderHistory']);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('customer_phone', 'like', '%' . $request->search . '%')
                    ->orWhere('id', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by Status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $previousStatus = $order->status;

        $request->validate([
            'status'           => 'required|in:pending,unreachable,preparing,shipping,completed,cancelled,returned',
            'create_consignment' => 'nullable|boolean',
            'courier'          => 'nullable|in:steadfast,pathao,carrybee',
            'name'             => 'required_if:create_consignment,true|string|max:255',
            'address'          => 'required_if:create_consignment,true|string|max:255',
            'phone'            => 'required_if:create_consignment,true|string|max:20',
            'note'             => 'nullable|string|max:500',
            'pathao_city_id'   => 'required_if:courier,pathao|nullable|integer',
            'pathao_zone_id'   => 'required_if:courier,pathao|nullable|integer',
            'pathao_area_id'   => 'required_if:courier,pathao|nullable|integer',
        ]);

        if ($request->create_consignment) {
            // Sync editable customer fields
            $order->update([
                'customer_name'    => $request->name,
                'customer_address' => $request->address,
                'customer_phone'   => $request->phone,
            ]);

            $courier = $request->courier ?? 'steadfast';
            $note    = $request->note ?? 'Order #' . $order->id;

            if (get_setting("{$courier}_enabled", '1') !== '1') {
                return redirect()->back()->with('error', ucfirst($courier) . ' courier is currently disabled. Enable it in Courier Settings before creating consignments.');
            }

            if ($courier === 'pathao') {
                $error = $this->createPathaoConsignment($order, $request, $note);
            } elseif ($courier === 'carrybee') {
                $error = $this->createCarryBeeConsignment($order, $note);
            } else {
                $error = $this->createSteadfastConsignment($order, $note);
            }

            if ($error) {
                return redirect()->back()->with('error', $error);
            }
        }

        // Handle order cancellation - restore stock
        if ($request->status === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order) {
                $order->load('items.product.product_variations');

                foreach ($order->items as $item) {
                    $product = $item->product;

                    if ($product) {
                        $hasVariationSelection = ! empty($item->variation_ids) && is_array($item->variation_ids);

                        // Variant item: restore selected variation stock, and keep
                        // product stock in sync with the original checkout decrement.
                        if ($hasVariationSelection) {
                            $variationIds = array_map('intval', $item->variation_ids);
                            $variations = $product->product_variations()
                                ->whereIn('id', $variationIds)
                                ->get();

                            foreach ($variations as $variation) {
                                if ($variation->stock !== null) {
                                    $variation->increment('stock', $item->quantity);
                                }
                            }

                            $product->increment('stock', $item->quantity);
                        } else {
                            // Simple item: restore only product stock.
                            $product->increment('stock', $item->quantity);
                        }
                    }
                }
            });
        }

        $order->update(['status' => $request->status]);

        if ($previousStatus !== $request->status) {
            Notification::send(
                AdminRecipients::users(),
                new \App\Notifications\Admin\OrderEvent(
                    order: $order,
                    event: 'status_updated',
                    oldStatus: $previousStatus,
                    newStatus: $request->status
                )
            );

            SendAdminOrderEventEmail::dispatch(
                orderId: $order->id,
                event: 'status_updated',
                oldStatus: $previousStatus,
                newStatus: $request->status
            )->afterCommit();
        }

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function invoice(Order $order)
    {
        $order->load([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ]);
        // For now, we'll just return the order data to a view or download a PDF.
        // Let's assume we render a simple invoice page for now.
        return Inertia::render('Admin/Order/Invoice', [
            'order' => $order,
        ]);
    }

    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ]);

        return Inertia::render('Admin/Order/Show', [
            'order' => $order,
        ]);
    }

    public function bulkInvoice(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ])->get();

        return Inertia::render('Admin/Order/Print', [
            'orders' => $orders,
        ]);
    }

    public function bulkDetails(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ])->get();

        return Inertia::render('Admin/Order/BulkDetails', [
            'orders' => $orders,
        ]);
    }
    // ── Bulk consignment creation ─────────────────────────────────────────────

    public function bulkConsignment(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'order_ids'      => 'required|array|min:1|max:500',
            'order_ids.*'    => 'integer|exists:orders,id',
            'courier'        => 'required|in:steadfast,pathao,carrybee',
            'note'           => 'nullable|string|max:500',
            'pathao_city_id' => 'required_if:courier,pathao|nullable|integer',
            'pathao_zone_id' => 'required_if:courier,pathao|nullable|integer',
            'pathao_area_id' => 'required_if:courier,pathao|nullable|integer',
        ]);

        $courier = $request->courier;
        $note    = $request->note ?? '';

        if (get_setting("{$courier}_enabled", '1') !== '1') {
            return back()->with('error', ucfirst($courier) . ' courier is currently disabled. Enable it in Courier Settings.');
        }

        if ($courier === 'steadfast') {
            return $this->bulkSteadfastConsignment($request->order_ids, $note);
        }

        $orders = Order::whereIn('id', $request->order_ids)
            ->whereNull('consignment_id')
            ->get();

        if ($orders->isEmpty()) {
            return back()->with('error', 'No eligible orders — all selected orders may already have consignments.');
        }

        $succeeded = 0;
        $failed    = 0;

        foreach ($orders as $order) {
            if ($courier === 'pathao') {
                $error = $this->createPathaoConsignmentDirect(
                    $order,
                    (int) $request->pathao_city_id,
                    (int) $request->pathao_zone_id,
                    (int) $request->pathao_area_id,
                    $note ?: 'Order #' . $order->id
                );
            } else {
                $error = $this->createCarryBeeConsignment($order, $note ?: 'Order #' . $order->id);
            }

            if ($error) { $failed++; } else { $succeeded++; }
        }

        $label = ucfirst($courier);
        $msg   = "{$succeeded} {$label} consignment(s) created.";
        if ($failed > 0) {
            $msg .= " {$failed} failed — check phone numbers and addresses.";
            return back()->with('error', $msg);
        }

        return back()->with('success', $msg);
    }

    private function bulkSteadfastConsignment(array $orderIds, string $note): \Illuminate\Http\RedirectResponse
    {
        $orders = Order::whereIn('id', $orderIds)->whereNull('consignment_id')->get();

        if ($orders->isEmpty()) {
            return back()->with('error', 'No eligible orders — all selected orders may already have consignments.');
        }

        $payload = $orders->map(fn(Order $o) => [
            'invoice'           => (string) $o->id,
            'recipient_name'    => $o->customer_name,
            'recipient_phone'   => $o->customer_phone,
            'recipient_address' => $o->customer_address,
            'cod_amount'        => $o->total,
            'note'              => $note ?: 'Order #' . $o->id,
        ])->values()->all();

        try {
            $results = \SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier::bulkCreateOrders($payload);
        } catch (\Exception $e) {
            return back()->with('error', 'Steadfast API error: ' . $e->getMessage());
        }

        if (isset($results['data']) && is_array($results['data'])) {
            $results = $results['data'];
        }

        $succeeded = 0;
        $failed    = 0;

        foreach ((array) $results as $result) {
            if (($result['status'] ?? '') === 'success' && ! empty($result['consignment_id'])) {
                $orderId = (int) ($result['invoice'] ?? 0);
                if ($orderId) {
                    Order::where('id', $orderId)->update([
                        'courier'        => 'steadfast',
                        'consignment_id' => $result['consignment_id'],
                        'tracking_code'  => $result['tracking_code'] ?? null,
                    ]);
                    $succeeded++;
                }
            } else {
                $failed++;
            }
        }

        $msg = "{$succeeded} Steadfast consignment(s) created.";
        if ($failed > 0) {
            $msg .= " {$failed} failed — check phone numbers and addresses.";
            return back()->with('error', $msg);
        }

        return back()->with('success', $msg);
    }

    private function createPathaoConsignmentDirect(Order $order, int $cityId, int $zoneId, int $areaId, string $note): ?string
    {
        try {
            $pathao   = app(\App\Services\PathaoService::class);
            $response = $pathao->createOrder([
                'merchant_order_id'   => (string) $order->id,
                'recipient_name'      => $order->customer_name,
                'recipient_phone'     => $order->customer_phone,
                'recipient_address'   => $order->customer_address,
                'recipient_city'      => $cityId,
                'recipient_zone'      => $zoneId,
                'recipient_area'      => $areaId,
                'amount_to_collect'   => $order->total,
                'special_instruction' => $note,
                'item_description'    => 'Order #' . $order->id,
            ]);

            if (($response['code'] ?? null) === 200 || isset($response['data']['consignment_id'])) {
                $order->update([
                    'courier'        => 'pathao',
                    'consignment_id' => $response['data']['consignment_id'] ?? null,
                    'pathao_city_id' => $cityId,
                    'pathao_zone_id' => $zoneId,
                    'pathao_area_id' => $areaId,
                ]);
                return null;
            }

            $msg = $response['message'] ?? 'Unknown Pathao error';
            return 'Pathao Error: ' . (is_array($msg) ? json_encode($msg) : $msg);
        } catch (\Exception $e) {
            return 'Pathao Exception: ' . $e->getMessage();
        }
    }

    // ── Private courier helpers ───────────────────────────────────────────────

    private function createSteadfastConsignment(Order $order, string $note): ?string
    {
        try {
            $response = \SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier::placeOrder([
                'invoice'          => (string) $order->id,
                'recipient_name'   => $order->customer_name,
                'recipient_phone'  => $order->customer_phone,
                'recipient_address'=> $order->customer_address,
                'cod_amount'       => $order->total,
                'note'             => $note,
            ]);

            if (isset($response['status']) && $response['status'] == 200) {
                $consignment = $response['consignment'] ?? [];
                $order->update([
                    'courier'        => 'steadfast',
                    'consignment_id' => $consignment['consignment_id'] ?? null,
                    'tracking_code'  => $consignment['tracking_code'] ?? null,
                ]);
                return null;
            }

            $msg = is_array($response['message'] ?? null)
                ? json_encode($response['message'])
                : ($response['message'] ?? 'Unknown error');

            return 'Steadfast Error: ' . $msg;
        } catch (\Exception $e) {
            return 'Steadfast Exception: ' . $e->getMessage();
        }
    }

    private function createPathaoConsignment(Order $order, \Illuminate\Http\Request $request, string $note): ?string
    {
        try {
            $pathao   = app(\App\Services\PathaoService::class);
            $response = $pathao->createOrder([
                'merchant_order_id'  => (string) $order->id,
                'recipient_name'     => $order->customer_name,
                'recipient_phone'    => $order->customer_phone,
                'recipient_address'  => $order->customer_address,
                'recipient_city'     => (int) $request->pathao_city_id,
                'recipient_zone'     => (int) $request->pathao_zone_id,
                'recipient_area'     => (int) $request->pathao_area_id,
                'amount_to_collect'  => $order->total,
                'special_instruction'=> $note,
                'item_description'   => 'Order #' . $order->id,
            ]);

            $code = $response['code'] ?? null;

            if ($code === 200 || isset($response['data']['consignment_id'])) {
                $order->update([
                    'courier'        => 'pathao',
                    'consignment_id' => $response['data']['consignment_id'] ?? null,
                    'pathao_city_id' => $request->pathao_city_id,
                    'pathao_zone_id' => $request->pathao_zone_id,
                    'pathao_area_id' => $request->pathao_area_id,
                ]);
                return null;
            }

            $msg = $response['message'] ?? 'Unknown Pathao error';
            return 'Pathao Error: ' . (is_array($msg) ? json_encode($msg) : $msg);
        } catch (\Exception $e) {
            return 'Pathao Exception: ' . $e->getMessage();
        }
    }

    private function createCarryBeeConsignment(Order $order, string $note): ?string
    {
        try {
            $carrybee = app(\App\Services\CarryBeeService::class);
            $response = $carrybee->placeOrder([
                'invoice'            => (string) $order->id,
                'recipient_name'     => $order->customer_name,
                'recipient_phone'    => $order->customer_phone,
                'recipient_address'  => $order->customer_address,
                'cod_amount'         => $order->total,
                'note'               => $note,
            ]);

            if (isset($response['status']) && $response['status'] == 200) {
                $consignment = $response['consignment'] ?? [];
                $order->update([
                    'courier'        => 'carrybee',
                    'consignment_id' => $consignment['consignment_id'] ?? null,
                    'tracking_code'  => $consignment['tracking_code']  ?? null,
                ]);
                return null;
            }

            $msg = is_array($response['message'] ?? null)
                ? json_encode($response['message'])
                : ($response['message'] ?? 'Unknown error');

            return 'CarryBee Error: ' . $msg;
        } catch (\Exception $e) {
            return 'CarryBee Exception: ' . $e->getMessage();
        }
    }

    // ── Fraud check ───────────────────────────────────────────────────────────

    public function checkFraud(Order $order, \App\Services\CourierFraudCheckerService $fraudChecker)
    {
        if (! $fraudChecker->isEnabled()) {
            return response()->json(['disabled' => true], 200);
        }

        $result = $fraudChecker->check($order->customer_phone);

        if (! $result) {
            return response()->json(['error' => 'Failed to fetch fraud data'], 500);
        }

        return response()->json([
            'success_ratio'     => $result->success_ratio,
            'total_orders'      => $result->total_orders,
            'successful_orders' => $result->successful_orders,
            'cancel_orders'     => $result->cancel_orders,
            'summaries'         => $result->summaries ?? [],
            'last_checked_at'   => $result->last_checked_at?->toIso8601String(),
        ]);
    }
}
