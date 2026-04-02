<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SSLCommerzService
{
    private string $storeId;
    private string $storePassword;
    private bool $sandbox;
    private string $gatewayUrl;
    private string $validatorUrl;

    public function __construct()
    {
        // Read directly from .env file so admin-panel credential updates take effect
        // without needing a server restart (env() is process-cached after bootstrap).
        $this->storeId       = $this->readEnv('SSLCOMMERZ_STORE_ID')       ?? env('SSLCOMMERZ_STORE_ID', '');
        $this->storePassword = $this->readEnv('SSLCOMMERZ_STORE_PASSWORD')  ?? env('SSLCOMMERZ_STORE_PASSWORD', '');
        $sandboxRaw          = $this->readEnv('SSLCOMMERZ_SANDBOX')         ?? env('SSLCOMMERZ_SANDBOX', 'false');
        $this->sandbox       = $sandboxRaw === 'true';

        if ($this->sandbox) {
            $this->gatewayUrl   = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
            $this->validatorUrl = 'https://sandbox.sslcommerz.com/validator/api/validPaymentIPN.php';
        } else {
            $this->gatewayUrl   = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
            $this->validatorUrl = 'https://securepay.sslcommerz.com/validator/api/validPaymentIPN.php';
        }
    }

    /**
     * Initiate a payment and return the gateway redirect URL.
     */
    public function initiatePayment(Order $order): string
    {
        if (empty($this->storeId) || empty($this->storePassword)) {
            throw new \RuntimeException('SSLCommerz credentials are not configured. Please set Store ID and Store Password in Payment Gateway settings.');
        }

        $tranId = 'ORDER-' . $order->id . '-' . time();

        $order->update(['payment_transaction_id' => $tranId]);

        $params = [
            'store_id'         => $this->storeId,
            'store_passwd'     => $this->storePassword,
            'total_amount'     => number_format((float) $order->total, 2, '.', ''),
            'currency'         => 'BDT',
            'tran_id'          => $tranId,
            'success_url'      => route('payment.sslcommerz.success'),
            'fail_url'         => route('payment.sslcommerz.fail'),
            'cancel_url'       => route('payment.sslcommerz.cancel'),
            'ipn_url'          => route('payment.sslcommerz.ipn'),
            'cus_name'         => $order->customer_name,
            'cus_email'        => $order->customer_email ?: 'noemail@noemail.com',
            'cus_phone'        => $order->customer_phone,
            'cus_add1'         => $order->customer_address,
            'cus_city'         => 'Dhaka',
            'cus_country'      => 'Bangladesh',
            'product_name'     => 'Order #' . $order->id,
            'product_category' => 'General',
            'product_profile'  => 'general',
            'shipping_method'  => 'NO',
            'num_of_item'      => $order->items()->count(),
        ];

        $response = Http::asForm()->timeout(30)->post($this->gatewayUrl, $params);
        $data     = $response->json();

        if (($data['status'] ?? '') === 'SUCCESS' && ! empty($data['GatewayPageURL'])) {
            return $data['GatewayPageURL'];
        }

        Log::error('SSLCommerz initiation failed', ['response' => $data]);
        throw new \RuntimeException('SSLCommerz: ' . ($data['failedreason'] ?? 'Unknown error'));
    }

    /**
     * Validate a payment using val_id returned by SSLCommerz.
     */
    public function validatePayment(string $valId): array
    {
        $response = Http::timeout(30)->get($this->validatorUrl, [
            'val_id'       => $valId,
            'store_id'     => $this->storeId,
            'store_passwd' => $this->storePassword,
            'format'       => 'json',
        ]);

        return $response->json() ?? [];
    }

    public function findOrderByTranId(string $tranId): ?Order
    {
        return Order::where('payment_transaction_id', $tranId)->first();
    }

    /**
     * Read a single key from the .env file on disk (bypasses PHP process env cache).
     */
    private function readEnv(string $key): ?string
    {
        $path = base_path('.env');
        if (! file_exists($path)) {
            return null;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (str_starts_with(trim($line), '#')) {
                continue;
            }
            [$envKey, $envValue] = array_pad(explode('=', $line, 2), 2, null);
            if (trim($envKey) === $key) {
                return trim($envValue ?? '', " \t\n\r\0\x0B\"'");
            }
        }

        return null;
    }
}
