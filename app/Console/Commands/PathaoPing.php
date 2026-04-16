<?php

namespace App\Console\Commands;

use App\Services\PathaoService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class PathaoPing extends Command
{
    protected $signature   = 'pathao:ping';
    protected $description = 'Diagnose Pathao API connectivity step by step';

    public function handle(PathaoService $pathao): int
    {
        $this->info('── Pathao diagnostics ────────────────────────────');

        // 1. Config
        $sandbox   = config('pathao.sandbox');
        $baseUrl   = rtrim(trim(config('pathao.base_url')), '/');
        $clientId  = config('pathao.client_id');
        $clientSec = config('pathao.client_secret');
        $username  = config('pathao.username');
        $password  = config('pathao.password');
        $storeId   = config('pathao.store_id');

        $this->line("Sandbox   : " . ($sandbox ? '<fg=yellow>true</>' : '<fg=green>false</>'));
        $this->line("Base URL  : {$baseUrl}");
        $this->line("Client ID : " . ($clientId  ?: '<fg=red>MISSING</>'));
        $this->line("Secret    : " . ($clientSec ? str_repeat('*', 8) . substr($clientSec, -4) : '<fg=red>MISSING</>'));
        $this->line("Username  : " . ($username  ?: '<fg=red>MISSING</>'));
        $this->line("Password  : " . ($password  ? '(set)' : '<fg=red>MISSING</>'));
        $this->line("Store ID  : " . ($storeId   ?: '<fg=red>MISSING</>'));
        $this->newLine();

        if (! $clientId || ! $clientSec || ! $username || ! $password) {
            $this->error('One or more required credentials are missing. Check your .env file.');
            return self::FAILURE;
        }

        // 2. Issue token (raw HTTP so we always see the real response)
        $this->info('Step 1 — Issue token …');
        $tokenUrl = "{$baseUrl}/aladdin/api/v1/issue-token";
        $this->line("POST {$tokenUrl}");

        try {
            $response = Http::asJson()->post($tokenUrl, [
                'client_id'     => $clientId,
                'client_secret' => $clientSec,
                'grant_type'    => 'password',
                'username'      => $username,
                'password'      => $password,
            ]);

            $this->line("HTTP status : {$response->status()}");
            $this->line("Body        : " . $response->body());

            if (! $response->successful() || ! $response->json('access_token')) {
                $this->error('Failed to obtain access token. See body above.');
                return self::FAILURE;
            }

            $token = $response->json('access_token');
            $this->info("Token obtained: " . substr($token, 0, 20) . '…');
        } catch (\Exception $e) {
            $this->error("Exception: " . $e->getMessage());
            return self::FAILURE;
        }
        $this->newLine();

        // 3. Fetch cities with the fresh token
        $this->info('Step 2 — GET cities …');
        $citiesUrl = "{$baseUrl}/aladdin/api/v1/cities";
        $this->line("GET {$citiesUrl}");

        try {
            $response = Http::withToken($token)->acceptJson()->get($citiesUrl);
            $this->line("HTTP status : {$response->status()}");
            $this->line("Body (truncated) : " . substr($response->body(), 0, 400));

            $cities = $response->json('data.data', []);
            $this->info("Cities returned : " . count($cities));
        } catch (\Exception $e) {
            $this->error("Exception: " . $e->getMessage());
            return self::FAILURE;
        }
        $this->newLine();

        // 4. Flush cached tokens so next real request uses fresh ones
        $pathao->forgetToken();
        $this->info('Cached tokens flushed. All steps passed.');

        return self::SUCCESS;
    }
}
