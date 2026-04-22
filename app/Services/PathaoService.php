<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PathaoService
{
    private string $baseUrl;

    private bool $sandbox;

    public function __construct()
    {
        $this->sandbox = (bool) config('pathao.sandbox', false);
        $this->baseUrl = rtrim(trim(config('pathao.base_url', 'https://api-hermes.pathao.com')), '/');
    }

    public function isSandbox(): bool
    {
        return $this->sandbox;
    }

    // ── Auth ──────────────────────────────────────────────────────────────────

    private function cacheKey(string $type): string
    {
        $suffix = $this->sandbox ? '_sandbox' : '';
        return "pathao_{$type}_token{$suffix}";
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

        // Try refresh token before doing a full password grant
        $refreshKey = $this->cacheKey('refresh');
        if ($refreshToken = Cache::get($refreshKey)) {
            $tokens = $this->requestToken([
                'client_id'     => config('pathao.client_id'),
                'client_secret' => config('pathao.client_secret'),
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
            ]);

            if ($tokens) {
                $this->cacheTokens($tokens);
                return $tokens['access_token'];
            }

            // Refresh token invalid — forget it and fall through to password grant
            Cache::forget($refreshKey);
        }

        // Full password grant
        $tokens = $this->requestToken([
            'client_id'     => config('pathao.client_id'),
            'client_secret' => config('pathao.client_secret'),
            'grant_type'    => 'password',
            'username'      => config('pathao.username'),
            'password'      => config('pathao.password'),
        ]);

        if ($tokens) {
            $this->cacheTokens($tokens);
            return $tokens['access_token'];
        }

        return null;
    }

    /**
     * POST to the issue-token endpoint and return the decoded response on success.
     *
     * @return array{access_token:string,refresh_token?:string,expires_in?:int}|null
     */
    private function requestToken(array $payload): ?array
    {
        try {
            $response = Http::asJson()->post("{$this->baseUrl}/aladdin/api/v1/issue-token", $payload);

            if ($response->successful() && $response->json('access_token')) {
                return $response->json();
            }

            Log::error('Pathao: failed to obtain token', [
                'grant_type' => $payload['grant_type'],
                'body'       => $response->json(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Pathao: token request exception — ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Persist access token (and optionally refresh token) from a token response.
     * TTL is derived from `expires_in`; a 60-second buffer prevents using a stale token.
     */
    private function cacheTokens(array $tokens): void
    {
        $expiresIn = (int) ($tokens['expires_in'] ?? 3600);
        $accessTtl = max($expiresIn - 60, 60);

        Cache::put($this->cacheKey('access'), $tokens['access_token'], $accessTtl);

        if (!empty($tokens['refresh_token'])) {
            // Refresh tokens are typically long-lived (30 days). Cache for 29 days.
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

    // ── Address lookup ────────────────────────────────────────────────────────

    public function getCities(): array
    {
        try {
            $res = $this->http()->get("{$this->baseUrl}/aladdin/api/v1/cities");
            return $res->json('data.data', []);
        } catch (\Exception $e) {
            Log::error('Pathao getCities: ' . $e->getMessage());
            return [];
        }
    }

    public function getZones(int $cityId): array
    {
        try {
            $res = $this->http()->get("{$this->baseUrl}/aladdin/api/v1/cities/{$cityId}/zone-list");
            return $res->json('data.data', []);
        } catch (\Exception $e) {
            Log::error('Pathao getZones: ' . $e->getMessage());
            return [];
        }
    }

    public function getAreas(int $zoneId): array
    {
        try {
            $res = $this->http()->get("{$this->baseUrl}/aladdin/api/v1/zones/{$zoneId}/area-list");
            return $res->json('data.data', []);
        } catch (\Exception $e) {
            Log::error('Pathao getAreas: ' . $e->getMessage());
            return [];
        }
    }

    // ── Order management ──────────────────────────────────────────────────────

    /**
     * Create a Pathao parcel order.
     *
     * Required keys in $data:
     *   merchant_order_id, recipient_name, recipient_phone,
     *   recipient_address, recipient_city, recipient_zone,
     *   recipient_area, amount_to_collect
     *
     * Optional: delivery_type (48=normal,12=on-demand), item_type (2=parcel),
     *           item_quantity, item_weight, special_instruction, item_description
     */
    public function createOrder(array $data): array
    {
        try {
            $payload = array_merge([
                'store_id'      => (int) config('pathao.store_id'),
                'delivery_type' => 48,
                'item_type'     => 2,
                'item_quantity' => 1,
                'item_weight'   => 0.5,
            ], $data);

            $res = $this->http()->post("{$this->baseUrl}/aladdin/api/v1/orders", $payload);
            return $res->json() ?? [];
        } catch (\Exception $e) {
            Log::error('Pathao createOrder: ' . $e->getMessage());
            return ['code' => 'exception', 'message' => $e->getMessage()];
        }
    }

    /**
     * Get live status of an order by Pathao consignment ID.
     */
    public function getOrderInfo(string $consignmentId): array
    {
        try {
            $res = $this->http()->get("{$this->baseUrl}/aladdin/api/v1/orders/{$consignmentId}/info");
            return $res->json() ?? [];
        } catch (\Exception $e) {
            Log::error('Pathao getOrderInfo: ' . $e->getMessage());
            return [];
        }
    }

    // ── Status mapping ────────────────────────────────────────────────────────

    /**
     * Map a Pathao order_status string to the internal order status.
     */
    public static function mapStatus(string $pathaoStatus): string
    {
        return match (strtolower($pathaoStatus)) {
            'pending'                         => 'pending',
            'pickup requested'                => 'preparing',
            'picked up', 'in review'          => 'shipping',
            'in-transit', 'transfer to hub'   => 'shipping',
            'out for delivery'                => 'shipping',
            'delivered', 'partial delivery'   => 'completed',
            'cancelled'                       => 'cancelled',
            'hold', 'return', 'return picked',
            'return in transit', 'returned'   => 'returned',
            default                           => 'shipping',
        };
    }
}
