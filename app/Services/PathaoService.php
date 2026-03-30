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
        $this->baseUrl = rtrim(config('pathao.base_url', 'https://hermes.pathao.com'), '/');
    }

    public function isSandbox(): bool
    {
        return $this->sandbox;
    }

    // ── Auth ──────────────────────────────────────────────────────────────────

    /**
     * Return a valid access token, fetching a new one if the cached one has expired.
     */
    public function getToken(): ?string
    {
        $cacheKey = $this->sandbox ? 'pathao_access_token_sandbox' : 'pathao_access_token';
        return Cache::remember($cacheKey, 3500, function () {
            return $this->issueToken();
        });
    }

    private function issueToken(): ?string
    {
        try {
            $response = Http::asJson()->post("{$this->baseUrl}/aladdin/api/v1/issue-token", [
                'client_id'     => config('pathao.client_id'),
                'client_secret' => config('pathao.client_secret'),
                'username'      => config('pathao.username'),
                'password'      => config('pathao.password'),
                'grant_type'    => 'password',
            ]);

            if ($response->successful() && $response->json('access_token')) {
                return $response->json('access_token');
            }

            Log::error('Pathao: failed to issue token', ['body' => $response->json()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Pathao: token exception — ' . $e->getMessage());
            return null;
        }
    }

    public function forgetToken(): void
    {
        Cache::forget('pathao_access_token');
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
