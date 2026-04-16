<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CarryBeeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CarryBeeWebhookController extends Controller
{
    /**
     * Handle incoming Carry Bee delivery status webhooks.
     *
     * Carry Bee POSTs JSON with at minimum:
     *   consignment_id  – Carry Bee's own parcel ID
     *   invoice         – the merchant order ID passed at consignment creation
     *   delivery_status – string status
     *
     * Signature verification: HMAC-SHA256 over the raw body using the
     * configured secret key, sent in the `X-CarryBee-Signature` header.
     */
    public function handle(Request $request): \Illuminate\Http\JsonResponse
    {
        $rawBody = $request->getContent();
        $payload = $request->all();

        Log::info('CarryBee webhook received', $payload);

        // ── Signature verification ─────────────────────────────────────────────
        $signature = $request->header('X-CarryBee-Signature');
        $secretKey = config('carrybee.secret_key');

        if ($signature && $secretKey) {
            $expected = hash_hmac('sha256', $rawBody, $secretKey);
            if (! hash_equals($expected, $signature)) {
                Log::warning('CarryBee webhook: signature mismatch');
                return response()->json(['message' => 'Invalid signature'], 401);
            }
        }

        // ── Payload extraction ─────────────────────────────────────────────────
        $consignmentId  = $payload['consignment_id'] ?? null;
        $invoice        = $payload['invoice']         ?? null;
        $deliveryStatus = $payload['delivery_status'] ?? null;

        if (! $deliveryStatus || (! $consignmentId && ! $invoice)) {
            Log::warning('CarryBee webhook: missing required fields', $payload);
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        // ── Order lookup ───────────────────────────────────────────────────────
        $order = null;

        if ($consignmentId) {
            $order = Order::where('consignment_id', $consignmentId)->first();
        }

        if (! $order && $invoice) {
            $order = Order::find((int) $invoice);
        }

        if (! $order) {
            Log::warning('CarryBee webhook: order not found', compact('consignmentId', 'invoice'));
            return response()->json(['message' => 'Order not found'], 404);
        }

        // ── Status update ──────────────────────────────────────────────────────
        $newStatus = CarryBeeService::mapStatus($deliveryStatus);

        if ($newStatus === null) {
            Log::info("CarryBee webhook: unrecognised status '{$deliveryStatus}' for order #{$order->id}, ignoring");
            return response()->json(['message' => 'Status ignored']);
        }

        if ($order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            Log::info("CarryBee webhook: order #{$order->id} → {$newStatus} (was {$order->status})");
        }

        return response()->json(['message' => 'OK']);
    }
}
