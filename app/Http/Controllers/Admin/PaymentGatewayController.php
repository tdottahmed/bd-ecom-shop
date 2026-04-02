<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentGatewayController extends Controller
{
    private const SETTING_KEYS = [
        'cod_enabled', 'bkash_enabled', 'nagad_enabled',
        'sslcommerz_enabled', 'shurjopay_enabled', 'aamarpay_enabled',
    ];

    public function index()
    {
        $settings = Setting::whereIn('key', self::SETTING_KEYS)
            ->pluck('value', 'key');

        return Inertia::render('Admin/Settings/PaymentGateways/Index', [
            'gateways' => [
                'cod' => [
                    'enabled' => ($settings['cod_enabled'] ?? '1') === '1',
                ],
                'bkash' => [
                    'enabled'    => ($settings['bkash_enabled'] ?? '0') === '1',
                    'app_key'    => env('BKASH_APP_KEY'),
                    'app_secret' => env('BKASH_APP_SECRET'),
                    'username'   => env('BKASH_USERNAME'),
                    'password'   => env('BKASH_PASSWORD'),
                    'sandbox'    => env('BKASH_SANDBOX', 'false') === 'true',
                ],
                'nagad' => [
                    'enabled'              => ($settings['nagad_enabled'] ?? '0') === '1',
                    'merchant_id'          => env('NAGAD_MERCHANT_ID'),
                    'merchant_private_key' => env('NAGAD_MERCHANT_PRIVATE_KEY'),
                    'sandbox'              => env('NAGAD_SANDBOX', 'false') === 'true',
                ],
                'sslcommerz' => [
                    'enabled'        => ($settings['sslcommerz_enabled'] ?? '0') === '1',
                    'store_id'       => env('SSLCOMMERZ_STORE_ID'),
                    'store_password' => env('SSLCOMMERZ_STORE_PASSWORD'),
                    'sandbox'        => env('SSLCOMMERZ_SANDBOX', 'false') === 'true',
                ],
                'shurjopay' => [
                    'enabled'  => ($settings['shurjopay_enabled'] ?? '0') === '1',
                    'username' => env('SHURJOPAY_USERNAME'),
                    'password' => env('SHURJOPAY_PASSWORD'),
                    'sandbox'  => env('SHURJOPAY_SANDBOX', 'false') === 'true',
                ],
                'aamarpay' => [
                    'enabled'       => ($settings['aamarpay_enabled'] ?? '0') === '1',
                    'store_id'      => env('AAMARPAY_STORE_ID'),
                    'signature_key' => env('AAMARPAY_SIGNATURE_KEY'),
                    'sandbox'       => env('AAMARPAY_SANDBOX', 'false') === 'true',
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            // COD
            'cod_enabled'              => 'boolean',
            // bKash
            'bkash_enabled'            => 'boolean',
            'bkash_app_key'            => 'nullable|string',
            'bkash_app_secret'         => 'nullable|string',
            'bkash_username'           => 'nullable|string',
            'bkash_password'           => 'nullable|string',
            'bkash_sandbox'            => 'boolean',
            // Nagad
            'nagad_enabled'            => 'boolean',
            'nagad_merchant_id'        => 'nullable|string',
            'nagad_merchant_private_key' => 'nullable|string',
            'nagad_sandbox'            => 'boolean',
            // SSLCommerz
            'sslcommerz_enabled'       => 'boolean',
            'sslcommerz_store_id'      => 'nullable|string',
            'sslcommerz_store_password' => 'nullable|string',
            'sslcommerz_sandbox'       => 'boolean',
            // ShurjoPay
            'shurjopay_enabled'        => 'boolean',
            'shurjopay_username'       => 'nullable|string',
            'shurjopay_password'       => 'nullable|string',
            'shurjopay_sandbox'        => 'boolean',
            // AamarPay
            'aamarpay_enabled'         => 'boolean',
            'aamarpay_store_id'        => 'nullable|string',
            'aamarpay_signature_key'   => 'nullable|string',
            'aamarpay_sandbox'         => 'boolean',
        ]);

        // Persist enabled flags to settings table
        $enabledKeys = [
            'cod_enabled', 'bkash_enabled', 'nagad_enabled',
            'sslcommerz_enabled', 'shurjopay_enabled', 'aamarpay_enabled',
        ];
        foreach ($enabledKeys as $key) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => ($data[$key] ?? false) ? '1' : '0']
            );
        }

        // Persist credentials to .env
        $this->writeEnv([
            'BKASH_APP_KEY'               => $data['bkash_app_key'] ?? '',
            'BKASH_APP_SECRET'            => $data['bkash_app_secret'] ?? '',
            'BKASH_USERNAME'              => $data['bkash_username'] ?? '',
            'BKASH_PASSWORD'              => $data['bkash_password'] ?? '',
            'BKASH_SANDBOX'               => ($data['bkash_sandbox'] ?? false) ? 'true' : 'false',
            'NAGAD_MERCHANT_ID'           => $data['nagad_merchant_id'] ?? '',
            'NAGAD_MERCHANT_PRIVATE_KEY'  => $data['nagad_merchant_private_key'] ?? '',
            'NAGAD_SANDBOX'               => ($data['nagad_sandbox'] ?? false) ? 'true' : 'false',
            'SSLCOMMERZ_STORE_ID'         => $data['sslcommerz_store_id'] ?? '',
            'SSLCOMMERZ_STORE_PASSWORD'   => $data['sslcommerz_store_password'] ?? '',
            'SSLCOMMERZ_SANDBOX'          => ($data['sslcommerz_sandbox'] ?? false) ? 'true' : 'false',
            'SHURJOPAY_USERNAME'          => $data['shurjopay_username'] ?? '',
            'SHURJOPAY_PASSWORD'          => $data['shurjopay_password'] ?? '',
            'SHURJOPAY_SANDBOX'           => ($data['shurjopay_sandbox'] ?? false) ? 'true' : 'false',
            'AAMARPAY_STORE_ID'           => $data['aamarpay_store_id'] ?? '',
            'AAMARPAY_SIGNATURE_KEY'      => $data['aamarpay_signature_key'] ?? '',
            'AAMARPAY_SANDBOX'            => ($data['aamarpay_sandbox'] ?? false) ? 'true' : 'false',
        ]);

        return back()->with('success', 'Payment gateway settings updated successfully.');
    }

    protected function writeEnv(array $replacements): void
    {
        $path = base_path('.env');
        if (! file_exists($path)) {
            return;
        }

        $env = file_get_contents($path);

        foreach ($replacements as $key => $value) {
            $value = $value ?? '';
            if (str_contains($value, ' ') && ! str_contains($value, '"')) {
                $value = '"' . $value . '"';
            }

            if (preg_match("/^{$key}=.*/m", $env)) {
                $env = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $env);
            } else {
                $env .= "\n{$key}={$value}";
            }
        }

        file_put_contents($path, $env);
    }
}
