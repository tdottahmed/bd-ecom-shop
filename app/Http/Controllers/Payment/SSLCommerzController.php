<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Services\SSLCommerzService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SSLCommerzController extends Controller
{
    public function __construct(private SSLCommerzService $ssl) {}

    /**
     * SSLCommerz redirects user here after successful payment (POST).
     */
    public function success(Request $request)
    {
        $valId  = $request->input('val_id');
        $tranId = $request->input('tran_id');
        $status = $request->input('status');

        if ($status !== 'VALID' && $status !== 'VALIDATED') {
            return $this->redirectFailed($tranId, 'Payment was not validated by SSLCommerz.');
        }

        $order = $this->ssl->findOrderByTranId($tranId);
        if (! $order) {
            return redirect()->route('home')->with('error', 'Order not found.');
        }

        // Already marked paid (e.g. by IPN arriving first)
        if ($order->payment_status === 'paid') {
            return redirect()->route('order.success', ['order' => $order->id]);
        }

        try {
            $validation = $this->ssl->validatePayment($valId);

            if (in_array($validation['status'] ?? '', ['VALID', 'VALIDATED'])) {
                $order->update([
                    'payment_status' => 'paid',
                    'status'         => 'pending',
                ]);
                return redirect()->route('order.success', ['order' => $order->id]);
            }
        } catch (\Exception $e) {
            Log::error('SSLCommerz success validation error', ['error' => $e->getMessage()]);
        }

        $order->update(['payment_status' => 'failed']);
        return redirect()->route('payment.failed', ['order' => $order->id]);
    }

    /**
     * SSLCommerz redirects user here on failed payment (POST).
     */
    public function fail(Request $request)
    {
        $tranId = $request->input('tran_id');
        return $this->redirectFailed($tranId, 'Payment failed. Please try again.');
    }

    /**
     * SSLCommerz redirects user here when they cancel (POST).
     */
    public function cancel(Request $request)
    {
        $tranId = $request->input('tran_id');

        if ($tranId) {
            $order = $this->ssl->findOrderByTranId($tranId);
            $order?->update(['payment_status' => 'cancelled']);
        }

        return redirect()->route('checkout.index')->with('info', 'Payment cancelled. Your cart is intact.');
    }

    /**
     * SSLCommerz instant payment notification (IPN) — server-to-server (POST).
     */
    public function ipn(Request $request)
    {
        $valId  = $request->input('val_id');
        $tranId = $request->input('tran_id');
        $status = $request->input('status');

        if (! in_array($status, ['VALID', 'VALIDATED']) || ! $tranId) {
            return response()->json(['status' => 'ignored']);
        }

        $order = $this->ssl->findOrderByTranId($tranId);
        if (! $order || $order->payment_status === 'paid') {
            return response()->json(['status' => 'ok']);
        }

        try {
            $validation = $this->ssl->validatePayment($valId);
            if (in_array($validation['status'] ?? '', ['VALID', 'VALIDATED'])) {
                $order->update(['payment_status' => 'paid', 'status' => 'pending']);
            }
        } catch (\Exception $e) {
            Log::error('SSLCommerz IPN error', ['error' => $e->getMessage()]);
        }

        return response()->json(['status' => 'ok']);
    }

    private function redirectFailed(?string $tranId, string $message): \Illuminate\Http\RedirectResponse
    {
        if ($tranId) {
            $order = $this->ssl->findOrderByTranId($tranId);
            if ($order && $order->payment_status !== 'paid') {
                $order->update(['payment_status' => 'failed']);
                return redirect()->route('payment.failed', ['order' => $order->id]);
            }
        }
        return redirect()->route('payment.failed');
    }
}
