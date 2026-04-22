<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SteadfastWebhookController extends Controller
{
    /**
     * Steadfast delivery status → internal order status.
     *
     * Steadfast sends one of these string values in `delivery_status`:
     *   pending, in_review, printed, sent_transit, in_transit, received,
     *   partially_delivered, delivered, cancelled, hold, unknown,
     *   returned_to_merchant
     */
    private static function mapStatus(string $deliveryStatus): ?string
    {
        return match (strtolower($deliveryStatus)) {
            'pending', 'hold'                            => 'pending',
            'in_review', 'printed'                       => 'preparing',
            'sent_transit', 'in_transit', 'received'     => 'shipping',
            'delivered', 'partially_delivered'           => 'completed',
            'cancelled'                                  => 'cancelled',
            'returned_to_merchant'                       => 'returned',
            default                                      => null,
        };
    }

    /**
     * Handle incoming Steadfast status-update webhooks.
     *
     * Steadfast POSTs JSON with at minimum:
     *   consignment_id  – Steadfast's own ID
     *   invoice         – the merchant order ID passed when creating the consignment
     *   delivery_status – string status (see mapStatus above)
     *
     * Signature verification uses HMAC-SHA256 over the raw body with the
     * configured Secret-Key, sent in the `X-Steadfast-Signature` header.
     * If the header is absent (older Steadfast integrations), we skip verification
     * and rely on the consignment_id lookup instead.
     */
    public function handle(Request $request): \Illuminate\Http\JsonResponse
    {
        $rawBody = $request->getContent();
        $payload = $request->all();

        Log::info('Steadfast webhook received', $payload);

        // ── Signature verification (optional but recommended) ──────────────────
        $signature = $request->header('X-Steadfast-Signature');
        $secretKey = config('steadfast-courier.secret_key');

        if ($signature && $secretKey) {
            $expected = hash_hmac('sha256', $rawBody, $secretKey);
            if (! hash_equals($expected, $signature)) {
                Log::warning('Steadfast webhook: signature mismatch');
                return response()->json(['message' => 'Invalid signature'], 401);
            }
        }

        // ── Payload extraction ─────────────────────────────────────────────────
        $consignmentId  = $payload['consignment_id'] ?? null;
        $invoice        = $payload['invoice']         ?? null;   // our order ID
        $deliveryStatus = $payload['delivery_status'] ?? null;

        if (! $deliveryStatus || (! $consignmentId && ! $invoice)) {
            Log::warning('Steadfast webhook: missing required fields', $payload);
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
            Log::warning('Steadfast webhook: order not found', compact('consignmentId', 'invoice'));
            return response()->json(['message' => 'Order not found'], 404);
        }

        // ── Status update ──────────────────────────────────────────────────────
        $newStatus = self::mapStatus($deliveryStatus);

        if ($newStatus === null) {
            Log::info("Steadfast webhook: unrecognised status '{$deliveryStatus}' for order #{$order->id}, ignoring");
            return response()->json(['message' => 'Status ignored']);
        }

        if ($order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            Log::info("Steadfast webhook: order #{$order->id} → {$newStatus} (was {$order->status})");
        }

        return response()->json(['message' => 'OK']);
    }
}
