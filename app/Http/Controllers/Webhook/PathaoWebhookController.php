<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PathaoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PathaoWebhookController extends Controller
{
    /**
     * Handle incoming status update webhooks from Pathao.
     *
     * Pathao sends a POST with a JSON body containing:
     *   consignment_id, merchant_order_id, order_status, ...
     */
    public function handle(Request $request): \Illuminate\Http\JsonResponse
    {
        $payload = $request->all();

        Log::info('Pathao webhook received', $payload);

        $consignmentId   = $payload['consignment_id']   ?? null;
        $merchantOrderId = $payload['merchant_order_id'] ?? null;
        $pathaoStatus    = $payload['order_status']      ?? null;

        if (! $pathaoStatus || (! $consignmentId && ! $merchantOrderId)) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        // Find the order by consignment_id first, fall back to merchant_order_id (our order ID)
        $order = null;

        if ($consignmentId) {
            $order = Order::where('consignment_id', $consignmentId)->first();
        }

        if (! $order && $merchantOrderId) {
            $order = Order::find((int) $merchantOrderId);
        }

        if (! $order) {
            Log::warning('Pathao webhook: order not found', compact('consignmentId', 'merchantOrderId'));
            return response()->json(['message' => 'Order not found'], 404);
        }

        $newStatus = PathaoService::mapStatus($pathaoStatus);

        // Only update if status actually changed
        if ($order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            Log::info("Pathao webhook: order #{$order->id} status updated to {$newStatus}");
        }

        return response()->json(['message' => 'OK']);
    }
}
