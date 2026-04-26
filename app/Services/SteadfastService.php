<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier;

class SteadfastService
{
    private string $baseUrl;
    private string $apiKey;
    private string $secretKey;

    public function __construct()
    {
        $this->baseUrl   = config('steadfast-courier.base_url', 'https://portal.packzy.com/api/v1');
        $this->apiKey    = config('steadfast-courier.api_key', '');
        $this->secretKey = config('steadfast-courier.secret_key', '');
    }

    private function headers(): array
    {
        return [
            'Api-Key'      => $this->apiKey,
            'Secret-Key'   => $this->secretKey,
            'Content-Type' => 'application/json',
        ];
    }

    public function getCurrentBalance(): array
    {
        return SteadfastCourier::getCurrentBalance() ?? [];
    }

    public function bulkCreateOrders(array $orders): array
    {
        $result = SteadfastCourier::bulkCreateOrders($orders);
        return is_array($result) ? $result : [];
    }

    public function checkStatusByConsignmentId(string|int $id): array
    {
        return SteadfastCourier::checkDeliveryStatusByConsignmentId($id) ?? [];
    }

    public function checkStatusByInvoice(string|int $invoice): array
    {
        return SteadfastCourier::checkDeliveryStatusByInvoiceId($invoice) ?? [];
    }

    public function getReturnRequests(): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/get_return_requests");

        return $response->json() ?? [];
    }

    public function getReturnRequest(int $id): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/get_return_request/{$id}");

        return $response->json() ?? [];
    }

    public function createReturnRequest(array $data): array
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/create_return_request", $data);

        return $response->json() ?? [];
    }

    public function getPayments(): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/payments");

        return $response->json() ?? [];
    }

    public function getPayment(int $id): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/payments/{$id}");

        return $response->json() ?? [];
    }

    public function getPoliceStations(): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/police_stations");

        return $response->json() ?? [];
    }

    public static function mapStatus(string $deliveryStatus): ?string
    {
        return match (strtolower($deliveryStatus)) {
            'pending', 'hold'                        => 'pending',
            'in_review', 'printed'                   => 'preparing',
            'sent_transit', 'in_transit', 'received' => 'shipping',
            'delivered', 'partially_delivered'       => 'completed',
            'cancelled'                              => 'cancelled',
            'returned_to_merchant'                   => 'returned',
            default                                  => null,
        };
    }
}
