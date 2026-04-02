<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialLoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Social/Index', [
            'credentials' => [
                'google_client_id'     => env('GOOGLE_CLIENT_ID'),
                'google_client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'google_enabled'       => env('GOOGLE_LOGIN_ENABLED', '0') === '1',
                'facebook_client_id'     => env('FACEBOOK_CLIENT_ID'),
                'facebook_client_secret' => env('FACEBOOK_CLIENT_SECRET'),
                'facebook_enabled'       => env('FACEBOOK_LOGIN_ENABLED', '0') === '1',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'google_client_id'       => 'nullable|string',
            'google_client_secret'   => 'nullable|string',
            'google_enabled'         => 'nullable|boolean',
            'facebook_client_id'     => 'nullable|string',
            'facebook_client_secret' => 'nullable|string',
            'facebook_enabled'       => 'nullable|boolean',
        ]);

        $this->writeEnv([
            'GOOGLE_CLIENT_ID'       => $data['google_client_id'] ?? '',
            'GOOGLE_CLIENT_SECRET'   => $data['google_client_secret'] ?? '',
            'GOOGLE_LOGIN_ENABLED'   => ($data['google_enabled'] ?? false) ? '1' : '0',
            'FACEBOOK_CLIENT_ID'     => $data['facebook_client_id'] ?? '',
            'FACEBOOK_CLIENT_SECRET' => $data['facebook_client_secret'] ?? '',
            'FACEBOOK_LOGIN_ENABLED' => ($data['facebook_enabled'] ?? false) ? '1' : '0',
        ]);

        return back()->with('success', 'Social login settings updated successfully.');
    }

    protected function writeEnv(array $replacements): void
    {
        $path = base_path('.env');
        if (! file_exists($path)) {
            return;
        }

        $env = file_get_contents($path);

        foreach ($replacements as $key => $value) {
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
