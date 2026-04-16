<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Courier/Index', [
            'credentials' => [
                'pathao_user'          => env('PATHAO_USER'),
                'pathao_password'      => env('PATHAO_PASSWORD'),
                'pathao_client_id'     => env('PATHAO_CLIENT_ID'),
                'pathao_client_secret' => env('PATHAO_CLIENT_SECRET'),
                'pathao_store_id'      => env('PATHAO_STORE_ID'),
                'pathao_sandbox'       => env('PATHAO_SANDBOX', 'false') === 'true',
                'steadfast_user'       => env('STEADFAST_USER'),
                'steadfast_password'   => env('STEADFAST_PASSWORD'),
                'steadfast_api_key'    => env('STEADFAST_API_KEY'),
                'steadfast_secret_key' => env('STEADFAST_SECRET_KEY'),
                'redx_phone'           => env('REDX_PHONE'),
                'redx_password'        => env('REDX_PASSWORD'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'pathao_user'          => 'nullable|string',
            'pathao_password'      => 'nullable|string',
            'pathao_client_id'     => 'nullable|string',
            'pathao_client_secret' => 'nullable|string',
            'pathao_store_id'      => 'nullable|string',
            'pathao_sandbox'       => 'nullable|boolean',
            'steadfast_user'       => 'nullable|string',
            'steadfast_password'   => 'nullable|string',
            'steadfast_api_key'    => 'nullable|string',
            'steadfast_secret_key' => 'nullable|string',
            'redx_phone'           => 'nullable|string',
            'redx_password'        => 'nullable|string',
        ]);

        $this->updateEnv($data);

        // Clear cached Pathao tokens whenever credentials change
        app(\App\Services\PathaoService::class)->forgetToken();

        return back()->with('success', 'Courier credentials updated successfully.');
    }

    protected function updateEnv(array $data)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            $env = file_get_contents($path);

            $replacements = [
                'PATHAO_USER'          => $data['pathao_user'] ?? '',
                'PATHAO_PASSWORD'      => $data['pathao_password'] ?? '',
                'PATHAO_CLIENT_ID'     => $data['pathao_client_id'] ?? '',
                'PATHAO_CLIENT_SECRET' => $data['pathao_client_secret'] ?? '',
                'PATHAO_STORE_ID'      => $data['pathao_store_id'] ?? '',
                'PATHAO_SANDBOX'       => ($data['pathao_sandbox'] ?? false) ? 'true' : 'false',
                'STEADFAST_USER'       => $data['steadfast_user'] ?? '',
                'STEADFAST_PASSWORD'   => $data['steadfast_password'] ?? '',
                'STEADFAST_API_KEY'    => $data['steadfast_api_key'] ?? '',
                'STEADFAST_SECRET_KEY' => $data['steadfast_secret_key'] ?? '',
                'REDX_PHONE'           => $data['redx_phone'] ?? '',
                'REDX_PASSWORD'        => $data['redx_password'] ?? '',
            ];

            foreach ($replacements as $key => $value) {
                // Quote value if it contains spaces
                if (strpos($value, ' ') !== false && strpos($value, '"') === false) {
                    $value = '"' . $value . '"';
                }
                
                // Check if key exists
                if (preg_match("/^{$key}=.*/m", $env)) {
                    $env = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $env);
                } else {
                    $env .= "\n{$key}={$value}";
                }
            }

            file_put_contents($path, $env);
        }
    }
}
