<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\BkashService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BkashController extends Controller
{
    public function __construct(private BkashService $bkash) {}

    /**
     * bKash redirects here after user completes or cancels payment (GET).
     * Query params: paymentID, status, order_id (our custom param).
     */
    public function callback(Request $request)
    {
        $paymentId = $request->input('paymentID');
        $status    = $request->input('status');
        $orderId   = $request->input('order_id');

        $order = Order::find($orderId);
        if (! $order) {
            return redirect()->route('home')->with('error', 'Order not found.');
        }

        // Already processed (e.g. duplicate callback)
        if ($order->payment_status === 'paid') {
            return redirect()->route('order.success', ['order' => $order->id]);
        }

        if ($status === 'cancel') {
            $order->update(['payment_status' => 'cancelled']);
            return redirect()->route('checkout.index')->with('info', 'Payment cancelled. Your cart is intact.');
        }

        if ($status === 'failure' || ! $paymentId) {
            $order->update(['payment_status' => 'failed']);
            return redirect()->route('payment.failed', ['order' => $order->id]);
        }

        // Execute the payment
        try {
            $result = $this->bkash->executePayment($paymentId);

            if (
                ($result['statusCode'] ?? '') === '0000'
                && in_array($result['transactionStatus'] ?? '', ['Completed', 'completed'])
            ) {
                $order->update([
                    'payment_status'         => 'paid',
                    'status'                 => 'pending',
                    'payment_transaction_id' => $result['trxID'] ?? $paymentId,
                ]);
                return redirect()->route('order.success', ['order' => $order->id]);
            }

            Log::warning('bKash executePayment not completed', [
                'order_id' => $order->id,
                'result'   => $result,
            ]);
            $order->update(['payment_status' => 'failed']);
            return redirect()->route('payment.failed', ['order' => $order->id]);

        } catch (\Exception $e) {
            Log::error('bKash executePayment exception', [
                'order_id' => $order->id,
                'error'    => $e->getMessage(),
            ]);
            $order->update(['payment_status' => 'failed']);
            return redirect()->route('payment.failed', ['order' => $order->id]);
        }
    }
}
