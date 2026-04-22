<?php

namespace App\Services;

use App\Models\CourierOrderHistory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CourierFraudCheckerService
{
    private const BASE = 'https://dash.hoorin.com/api/courier';
    private const CACHE_HOURS = 24;

    // ── Public entry point ────────────────────────────────────────────────────

    /**
     * Run a fraud check for a phone number via the Hoorin courier search API.
     *
     * Returns the stored CourierOrderHistory row (fresh or cached), or null if
     * the feature is disabled or the API call fails.
     */
    public function check(string $phone): ?CourierOrderHistory
    {
        if (! $this->isEnabled()) {
            return null;
        }

        // Return cached result if still fresh
        $history = CourierOrderHistory::where('phone', $phone)
            ->where('last_checked_at', '>=', now()->subHours(self::CACHE_HOURS))
            ->first();

        if ($history) {
            return $history;
        }

        $apiKey = get_setting('hoorin_api_key', '');
        if (! $apiKey) {
            Log::warning('CourierFraudChecker: hoorin_api_key is not configured');
            return null;
        }

        try {
            [$summariesRaw, $totalRaw] = $this->fetchBoth($apiKey, $phone);

            $summaries = $this->normaliseSummaries($summariesRaw);
            $total     = $this->normaliseTotal($totalRaw, $summaries);

            $history = CourierOrderHistory::updateOrCreate(
                ['phone' => $phone],
                [
                    'data'               => ['summaries' => $summariesRaw, 'total' => $totalRaw],
                    'summaries'          => $summaries,
                    'total_orders'       => $total['total'],
                    'successful_orders'  => $total['delivered'],
                    'cancel_orders'      => $total['cancelled'],
                    'success_ratio'      => $total['total'] > 0
                                               ? round(($total['delivered'] / $total['total']) * 100, 2)
                                               : 0,
                    'last_checked_at'    => now(),
                ]
            );

            return $history;
        } catch (\Exception $e) {
            Log::error('CourierFraudChecker: ' . $e->getMessage());
            return null;
        }
    }

    public function isEnabled(): bool
    {
        return get_setting('fraud_check_enabled', '0') === '1';
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /** Fire both API calls concurrently. */
    private function fetchBoth(string $apiKey, string $phone): array
    {
        $params = ['apiKey' => $apiKey, 'searchTerm' => $phone];

        $summariesResponse = Http::timeout(15)->get(self::BASE . '/api', $params);
        $totalResponse     = Http::timeout(15)->get(self::BASE . '/sheet', $params);

        Log::info('Hoorin fraud check', [
            'phone'      => $phone,
            'summaries'  => $summariesResponse->json(),
            'total'      => $totalResponse->json(),
        ]);

        return [
            $summariesResponse->json('Summaries', []),
            $totalResponse->json('totalSummary', []),
        ];
    }

    /**
     * Normalise each courier's summary into a consistent shape:
     *   { total, delivered, cancelled }
     *
     * Pathao uses different field names to other couriers.
     */
    private function normaliseSummaries(array $summaries): array
    {
        $normalised = [];

        foreach ($summaries as $courier => $stats) {
            // Pathao uses "Total Delivery" / "Successful Delivery" / "Canceled Delivery"
            // Others use "Total Parcels" / "Delivered Parcels" / "Canceled Parcels"
            $normalised[$courier] = [
                'total'     => (int) ($stats['Total Parcels']       ?? $stats['Total Delivery']       ?? 0),
                'delivered' => (int) ($stats['Delivered Parcels']   ?? $stats['Successful Delivery']  ?? 0),
                'cancelled' => (int) ($stats['Canceled Parcels']    ?? $stats['Canceled Delivery']    ?? 0),
            ];
        }

        return $normalised;
    }

    /**
     * Build a total summary — use the /sheet endpoint if available,
     * fall back to summing the individual couriers.
     */
    private function normaliseTotal(array $totalRaw, array $normalisedSummaries): array
    {
        if (! empty($totalRaw)) {
            return [
                'total'     => (int) ($totalRaw['Total Parcels']     ?? 0),
                'delivered' => (int) ($totalRaw['Delivered Parcels'] ?? 0),
                'cancelled' => (int) ($totalRaw['Canceled Parcels']  ?? 0),
            ];
        }

        // Fallback: aggregate from individual summaries
        return array_reduce(
            $normalisedSummaries,
            fn ($carry, $s) => [
                'total'     => $carry['total']     + $s['total'],
                'delivered' => $carry['delivered'] + $s['delivered'],
                'cancelled' => $carry['cancelled'] + $s['cancelled'],
            ],
            ['total' => 0, 'delivered' => 0, 'cancelled' => 0]
        );
    }
}
