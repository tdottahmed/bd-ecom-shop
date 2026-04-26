<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CarryBeeService
{
    private string $baseUrl;
    private bool   $sandbox;

    public function __construct()
    {
        $this->sandbox = (bool) config('carrybee.sandbox', false);
        $this->baseUrl = rtrim(trim(config('carrybee.base_url', 'https://developers.carrybee.com')), '/');
    }

    public function isSandbox(): bool
    {
        return $this->sandbox;
    }

    // ── Auth ──────────────────────────────────────────────────────────────────

    private function cacheKey(string $type): string
    {
        $suffix = $this->sandbox ? '_sandbox' : '';
        return "carrybee_{$type}_token{$suffix}";
    }

    /**
     * Return a valid access token.
     * Tries the cached access token first, then refresh token, then full re-auth.
     */
    public function getToken(): ?string
    {
        $accessKey = $this->cacheKey('access');

        if (Cache::has($accessKey)) {
            return Cache::get($accessKey);
        }

        // Try refresh token before doing a full credentials grant
        $refreshKey = $this->cacheKey('refresh');
        if ($refreshToken = Cache::get($refreshKey)) {
            $tokens = $this->requestToken([
                'grant_type'     => 'refresh_token',
                'client_id'      => config('carrybee.client_id'),
                'client_secret'  => config('carrybee.client_secret'),
                'client_context' => config('carrybee.client_context'),
                'refresh_token'  => $refreshToken,
            ]);

            if ($tokens) {
                $this->cacheTokens($tokens);
                return $tokens['access_token'];
            }

            Cache::forget($refreshKey);
        }

        // Full client credentials grant
        $tokens = $this->requestToken([
            'grant_type'     => 'client_credentials',
            'client_id'      => config('carrybee.client_id'),
            'client_secret'  => config('carrybee.client_secret'),
            'client_context' => config('carrybee.client_context'),
        ]);

        if ($tokens) {
            $this->cacheTokens($tokens);
            return $tokens['access_token'];
        }

        return null;
    }

    /**
     * POST to the token endpoint and return the decoded response on success.
     *
     * @return array{access_token:string,refresh_token?:string,expires_in?:int}|null
     */
    private function requestToken(array $payload): ?array
    {
        try {
            $response = Http::asJson()->post("{$this->baseUrl}/oauth/token", $payload);

            if ($response->successful() && $response->json('access_token')) {
                return $response->json();
            }

            Log::error('CarryBee: failed to obtain token', [
                'grant_type' => $payload['grant_type'],
                'body'       => $response->json(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('CarryBee: token request exception — ' . $e->getMessage());
            return null;
        }
    }

    private function cacheTokens(array $tokens): void
    {
        $expiresIn = (int) ($tokens['expires_in'] ?? 3600);
        $accessTtl = max($expiresIn - 60, 60);

        Cache::put($this->cacheKey('access'), $tokens['access_token'], $accessTtl);

        if (!empty($tokens['refresh_token'])) {
            Cache::put($this->cacheKey('refresh'), $tokens['refresh_token'], 29 * 24 * 3600);
        }
    }

    public function forgetToken(): void
    {
        Cache::forget($this->cacheKey('access'));
        Cache::forget($this->cacheKey('refresh'));
    }

    // ── HTTP helper ───────────────────────────────────────────────────────────

    private function http(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::withToken($this->getToken())->acceptJson()->asJson();
    }

    // ── Order management ──────────────────────────────────────────────────────

    /**
     * Create a Carry Bee parcel order.
     *
     * Required keys in $data:
     *   invoice, recipient_name, recipient_phone, recipient_address,
     *   cod_amount
     *
     * Optional: note
     */
    public function placeOrder(array $data): array
    {
        try {
            $response = $this->http()->post("{$this->baseUrl}/api/v1/orders", $data);
            return $response->json() ?? [];
        } catch (\Exception $e) {
            Log::error('CarryBee placeOrder: ' . $e->getMessage());
            return ['status' => 0, 'message' => $e->getMessage()];
        }
    }

    /**
     * Get delivery status by consignment ID.
     */
    public function statusByConsignment(string $consignmentId): array
    {
        try {
            $response = $this->http()->get("{$this->baseUrl}/api/v1/orders/{$consignmentId}/status");
            return $response->json() ?? [];
        } catch (\Exception $e) {
            Log::error('CarryBee statusByConsignment: ' . $e->getMessage());
            return [];
        }
    }

    // ── Status mapping ────────────────────────────────────────────────────────

    public static function mapStatus(string $deliveryStatus): ?string
    {
        return match (strtolower($deliveryStatus)) {
            'pending', 'hold'                        => 'pending',
            'in_review', 'printed', 'pickup_pending' => 'preparing',
            'in_transit', 'received', 'sent_transit' => 'shipping',
            'delivered', 'partially_delivered'       => 'completed',
            'cancelled'                              => 'cancelled',
            'returned_to_merchant', 'returned'       => 'returned',
            default                                  => null,
        };
    }
}
