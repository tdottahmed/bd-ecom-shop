<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOrderEventEmail;
use App\Models\Order;
use App\Support\AdminRecipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

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
            $previousStatus = $order->status;

            // Restore stock when an order is cancelled via webhook
            if ($newStatus === 'cancelled') {
                DB::transaction(function () use ($order, $newStatus) {
                    $order->load('items.product.product_variations');

                    foreach ($order->items as $item) {
                        $product = $item->product;

                        if (! $product) {
                            continue;
                        }

                        $hasVariationSelection = ! empty($item->variation_ids) && is_array($item->variation_ids);

                        if ($hasVariationSelection) {
                            $variationIds = array_map('intval', $item->variation_ids);
                            $product->product_variations()
                                ->whereIn('id', $variationIds)
                                ->each(function ($variation) use ($item) {
                                    if ($variation->stock !== null) {
                                        $variation->increment('stock', $item->quantity);
                                    }
                                });
                        }

                        $product->increment('stock', $item->quantity);
                    }

                    $order->update(['status' => $newStatus]);
                });
            } else {
                $order->update(['status' => $newStatus]);
            }

            Log::info("Steadfast webhook: order #{$order->id} → {$newStatus} (was {$previousStatus})");

            Notification::send(
                AdminRecipients::users(),
                new \App\Notifications\Admin\OrderEvent(
                    order: $order,
                    event: 'status_updated',
                    oldStatus: $previousStatus,
                    newStatus: $newStatus
                )
            );

            SendAdminOrderEventEmail::dispatch(
                orderId: $order->id,
                event: 'status_updated',
                oldStatus: $previousStatus,
                newStatus: $newStatus
            )->afterCommit();
        }

        return response()->json(['message' => 'OK']);
    }
}
