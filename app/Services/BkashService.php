<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashService
{
    private string $appKey;
    private string $appSecret;
    private string $username;
    private string $password;
    private string $baseUrl;

    public function __construct()
    {
        $this->appKey    = env('BKASH_APP_KEY', '');
        $this->appSecret = env('BKASH_APP_SECRET', '');
        $this->username  = env('BKASH_USERNAME', '');
        $this->password  = env('BKASH_PASSWORD', '');

        $sandbox        = env('BKASH_SANDBOX', 'false') === 'true';
        $this->baseUrl  = $sandbox
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout'
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout';
    }

    /**
     * Obtain (or refresh from cache) an id_token from bKash.
     */
    private function getToken(): string
    {
        return Cache::remember('bkash_id_token', 3500, function () {
            $response = Http::withHeaders([
                'username'     => $this->username,
                'password'     => $this->password,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($this->baseUrl . '/token/grant', [
                'app_key'    => $this->appKey,
                'app_secret' => $this->appSecret,
            ]);

            $data = $response->json();

            if (! empty($data['id_token'])) {
                return $data['id_token'];
            }

            Log::error('bKash token grant failed', $data);
            throw new \RuntimeException('bKash token grant failed: ' . ($data['statusMessage'] ?? 'Unknown'));
        });
    }

    /**
     * Create a bKash payment and return the bKashURL for redirect.
     */
    public function createPayment(Order $order): string
    {
        $token = $this->getToken();

        $response = Http::withHeaders([
            'Authorization' => $token,
            'X-APP-Key'     => $this->appKey,
            'Content-Type'  => 'application/json',
        ])->timeout(30)->post($this->baseUrl . '/create', [
            'mode'                  => '0011',
            'payerReference'        => (string) $order->id,
            'callbackURL'           => route('payment.bkash.callback', ['order_id' => $order->id]),
            'amount'                => number_format((float) $order->total, 2, '.', ''),
            'currency'              => 'BDT',
            'intent'                => 'sale',
            'merchantInvoiceNumber' => 'ORDER-' . $order->id,
        ]);

        $data = $response->json();

        if (($data['statusCode'] ?? '') === '0000' && ! empty($data['bkashURL'])) {
            $order->update(['payment_transaction_id' => $data['paymentID']]);
            return $data['bkashURL'];
        }

        Log::error('bKash createPayment failed', $data);
        throw new \RuntimeException('bKash: ' . ($data['statusMessage'] ?? 'Unknown error'));
    }

    /**
     * Execute (confirm) a bKash payment after the user completes checkout.
     */
    public function executePayment(string $paymentId): array
    {
        // Always use a fresh token for execute to avoid expiry edge cases
        Cache::forget('bkash_id_token');
        $token = $this->getToken();

        $response = Http::withHeaders([
            'Authorization' => $token,
            'X-APP-Key'     => $this->appKey,
            'Content-Type'  => 'application/json',
        ])->timeout(30)->post($this->baseUrl . '/execute', [
            'paymentID' => $paymentId,
        ]);

        return $response->json() ?? [];
    }

    /**
     * Query payment status (useful for reconciliation).
     */
    public function queryPayment(string $paymentId): array
    {
        $token = $this->getToken();

        $response = Http::withHeaders([
            'Authorization' => $token,
            'X-APP-Key'     => $this->appKey,
            'Content-Type'  => 'application/json',
        ])->timeout(30)->post($this->baseUrl . '/payment/status', [
            'paymentID' => $paymentId,
        ]);

        return $response->json() ?? [];
    }
}
