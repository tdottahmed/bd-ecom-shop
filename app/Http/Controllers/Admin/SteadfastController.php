<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\SteadfastService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SteadfastController extends Controller
{
    public function __construct(private SteadfastService $steadfast) {}

    public function index(): \Inertia\Response
    {
        try {
            $balanceData = $this->steadfast->getCurrentBalance();
            $balance = $balanceData['current_balance'] ?? null;
        } catch (\Exception) {
            $balance = null;
        }

        try {
            $returnRequests = $this->steadfast->getReturnRequests();
            $returnRequests = is_array($returnRequests) ? $returnRequests : [];
        } catch (\Exception) {
            $returnRequests = [];
        }

        try {
            $payments = $this->steadfast->getPayments();
            $payments = is_array($payments) ? $payments : [];
        } catch (\Exception) {
            $payments = [];
        }

        return Inertia::render('Admin/Steadfast/Index', [
            'balance'         => $balance,
            'return_requests' => $returnRequests,
            'payments'        => $payments,
        ]);
    }

    public function balance(): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->steadfast->getCurrentBalance();
            return response()->json(['balance' => $result['current_balance'] ?? null]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function bulkConsignment(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'order_ids'   => 'required|array|min:1|max:500',
            'order_ids.*' => 'integer|exists:orders,id',
        ]);

        $orders = Order::whereIn('id', $request->order_ids)
            ->whereNull('consignment_id')
            ->get();

        if ($orders->isEmpty()) {
            return back()->with('error', 'No eligible orders — selected orders may already have consignments.');
        }

        $payload = $orders->map(fn(Order $o) => [
            'invoice'           => (string) $o->id,
            'recipient_name'    => $o->customer_name,
            'recipient_phone'   => $o->customer_phone,
            'recipient_address' => $o->customer_address,
            'cod_amount'        => $o->total,
            'note'              => 'Order #' . $o->id,
        ])->values()->all();

        try {
            $results = $this->steadfast->bulkCreateOrders($payload);
        } catch (\Exception $e) {
            return back()->with('error', 'Steadfast API error: ' . $e->getMessage());
        }

        // API may return flat array or wrap in {data: [...]}
        if (isset($results['data']) && is_array($results['data'])) {
            $results = $results['data'];
        }

        $succeeded = 0;
        $failed    = 0;

        foreach ($results as $result) {
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

        $msg = "{$succeeded} consignment(s) created successfully.";
        if ($failed > 0) {
            $msg .= " {$failed} failed — check that phone numbers and addresses are valid.";
            return back()->with('error', $msg);
        }

        return back()->with('success', $msg);
    }

    public function syncStatus(Order $order): \Illuminate\Http\JsonResponse
    {
        if (! $order->consignment_id || $order->courier !== 'steadfast') {
            return response()->json(['error' => 'Order has no Steadfast consignment.'], 422);
        }

        try {
            $result = $this->steadfast->checkStatusByConsignmentId($order->consignment_id);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $deliveryStatus = $result['delivery_status'] ?? null;

        if (! $deliveryStatus) {
            return response()->json(['error' => 'No delivery status returned from Steadfast.'], 500);
        }

        $newStatus = SteadfastService::mapStatus($deliveryStatus);
        $updated   = false;

        if ($newStatus && $order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            $updated = true;
        }

        return response()->json([
            'delivery_status' => $deliveryStatus,
            'internal_status' => $newStatus ?? $order->status,
            'updated'         => $updated,
        ]);
    }

    public function createReturnRequest(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'consignment_id' => 'nullable|string',
            'invoice'        => 'nullable|string',
            'tracking_code'  => 'nullable|string',
            'reason'         => 'nullable|string|max:500',
        ]);

        $payload = array_filter([
            'consignment_id' => $request->consignment_id ?: null,
            'invoice'        => $request->invoice ?: null,
            'tracking_code'  => $request->tracking_code ?: null,
            'reason'         => $request->reason ?: null,
        ]);

        if (empty($payload['consignment_id']) && empty($payload['invoice']) && empty($payload['tracking_code'])) {
            return back()->with('error', 'Provide a consignment ID, invoice number, or tracking code.');
        }

        try {
            $result = $this->steadfast->createReturnRequest($payload);
        } catch (\Exception $e) {
            return back()->with('error', 'Return request failed: ' . $e->getMessage());
        }

        if (isset($result['id'])) {
            return redirect()->route('admin.steadfast.index')
                ->with('success', 'Return request #' . $result['id'] . ' created successfully.');
        }

        return back()->with('error', 'Could not create return request. Check the consignment details and try again.');
    }

    public function payment(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $payment = $this->steadfast->getPayment($id);
            return response()->json($payment);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
