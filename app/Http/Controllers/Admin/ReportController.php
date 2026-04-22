<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    // ──────────────────────────────────────────
    //  Shared helpers
    // ──────────────────────────────────────────

    private function resolveDateRange(Request $request): array
    {
        $preset     = $request->input('date_range', 'last_30_days');
        $startInput = $request->input('start_date');
        $endInput   = $request->input('end_date');

        [$start, $end] = match ($preset) {
            'today'          => [Carbon::today()->startOfDay(),              Carbon::today()->endOfDay()],
            'yesterday'      => [Carbon::yesterday()->startOfDay(),          Carbon::yesterday()->endOfDay()],
            'last_7_days'    => [Carbon::now()->subDays(6)->startOfDay(),    Carbon::now()->endOfDay()],
            'last_30_days'   => [Carbon::now()->subDays(29)->startOfDay(),   Carbon::now()->endOfDay()],
            'last_3_months'  => [Carbon::now()->subMonths(3)->startOfDay(),  Carbon::now()->endOfDay()],
            'last_12_months' => [Carbon::now()->subMonths(12)->startOfDay(), Carbon::now()->endOfDay()],
            'custom'         => $startInput && $endInput
                ? [Carbon::parse($startInput)->startOfDay(), Carbon::parse($endInput)->endOfDay()]
                : [Carbon::now()->subDays(29)->startOfDay(), Carbon::now()->endOfDay()],
            default          => [Carbon::now()->subDays(29)->startOfDay(), Carbon::now()->endOfDay()],
        };

        return compact('start', 'end', 'preset') + [
            'start_date' => $startInput,
            'end_date'   => $endInput,
        ];
    }

    private function ordersInRange(Carbon $start, Carbon $end)
    {
        return Order::whereBetween('created_at', [$start, $end]);
    }

    // ──────────────────────────────────────────
    //  1. Overview
    // ──────────────────────────────────────────

    public function index(Request $request): Response
    {
        $dr             = $this->resolveDateRange($request);
        $additionalCost = get_setting('additional_cost', 0);

        $orders  = $this->ordersInRange($dr['start'], $dr['end'])->with('items.product')->get();
        $active  = $orders->where('status', '!=', 'cancelled');
        $done    = $orders->where('status', 'completed');

        $revenue = $active->sum('total');
        $profit  = $active->sum(fn ($o) => $o->items->sum(
            fn ($i) => (($i->price ?? 0) - (($i->product->purchase_price ?? 0) + $additionalCost)) * $i->quantity
        ));
        $totalOrders = $orders->count();

        $revenueTrend = $active
            ->groupBy(fn ($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(fn ($rows, $date) => [
                'date'    => Carbon::parse($date)->format('d M'),
                'revenue' => round($rows->sum('total'), 2),
            ])
            ->sortKeys()->values();

        $statusChart = $orders->groupBy('status')
            ->map(fn ($rows, $status) => ['name' => ucfirst($status), 'value' => $rows->count()])
            ->values();

        return Inertia::render('Admin/Reports/Overview', [
            'filters' => $dr,
            'kpis' => [
                'revenue'   => round($revenue, 2),
                'profit'    => round($profit, 2),
                'orders'    => $totalOrders,
                'aov'       => $totalOrders > 0 ? round($revenue / $totalOrders, 2) : 0,
                'completed' => $done->count(),
                'cancelled' => $orders->where('status', 'cancelled')->count(),
                'pending'   => $orders->filter(fn ($o) => !in_array($o->status, ['completed', 'cancelled']))->count(),
            ],
            'charts' => [
                'revenue_trend' => $revenueTrend,
                'order_status'  => $statusChart,
            ],
        ]);
    }

    // ──────────────────────────────────────────
    //  2. Sales performance
    // ──────────────────────────────────────────

    public function sales(Request $request): Response
    {
        $dr             = $this->resolveDateRange($request);
        $additionalCost = get_setting('additional_cost', 0);

        $orders = $this->ordersInRange($dr['start'], $dr['end'])->with('items.product')->get();
        $active = $orders->where('status', '!=', 'cancelled');

        $revenue  = $active->sum('total');
        $profit   = $active->sum(fn ($o) => $o->items->sum(
            fn ($i) => (($i->price ?? 0) - (($i->product->purchase_price ?? 0) + $additionalCost)) * $i->quantity
        ));
        $count    = $active->count();

        $daily = $active
            ->groupBy(fn ($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(function ($rows, $date) use ($additionalCost) {
                $p = $rows->sum(fn ($o) => $o->items->sum(
                    fn ($i) => (($i->price ?? 0) - (($i->product->purchase_price ?? 0) + $additionalCost)) * $i->quantity
                ));
                return [
                    'date'    => Carbon::parse($date)->format('d M'),
                    'revenue' => round($rows->sum('total'), 2),
                    'profit'  => round($p, 2),
                    'orders'  => $rows->count(),
                ];
            })
            ->sortKeys()->values();

        return Inertia::render('Admin/Reports/Sales', [
            'filters' => $dr,
            'kpis'    => [
                'revenue'            => round($revenue, 2),
                'profit'             => round($profit, 2),
                'completed_revenue'  => round($orders->where('status', 'completed')->sum('total'), 2),
                'orders'             => $count,
                'aov'                => $count > 0 ? round($revenue / $count, 2) : 0,
            ],
            'charts'  => ['daily' => $daily],
        ]);
    }

    // ──────────────────────────────────────────
    //  3. Orders
    // ──────────────────────────────────────────

    public function orders(Request $request): Response
    {
        $dr     = $this->resolveDateRange($request);
        $orders = $this->ordersInRange($dr['start'], $dr['end'])->get();

        $total     = $orders->count();
        $completed = $orders->where('status', 'completed')->count();
        $cancelled = $orders->where('status', 'cancelled')->count();
        $returned  = $orders->where('status', 'returned')->count();
        $pending   = $orders->filter(fn ($o) => !in_array($o->status, ['completed', 'cancelled', 'returned']))->count();

        $statusChart = $orders->groupBy('status')
            ->map(fn ($rows, $s) => [
                'name'  => ucfirst($s),
                'value' => $rows->count(),
                'pct'   => $total > 0 ? round($rows->count() / $total * 100, 1) : 0,
            ])->values();

        $daily = $orders
            ->groupBy(fn ($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(fn ($rows, $date) => [
                'date'      => Carbon::parse($date)->format('d M'),
                'orders'    => $rows->count(),
                'completed' => $rows->where('status', 'completed')->count(),
                'cancelled' => $rows->where('status', 'cancelled')->count(),
            ])
            ->sortKeys()->values();

        return Inertia::render('Admin/Reports/Orders', [
            'filters' => $dr,
            'kpis'    => [
                'total'       => $total,
                'completed'   => $completed,
                'cancelled'   => $cancelled,
                'pending'     => $pending,
                'returned'    => $returned,
                'cancel_rate' => $total > 0 ? round($cancelled / $total * 100, 1) : 0,
            ],
            'charts'  => [
                'status_data' => $statusChart,
                'daily_data'  => $daily,
            ],
        ]);
    }

    // ──────────────────────────────────────────
    //  4. Products
    // ──────────────────────────────────────────

    public function products(Request $request): Response
    {
        $dr = $this->resolveDateRange($request);

        $items = OrderItem::whereHas('order', fn ($q) =>
            $q->whereBetween('created_at', [$dr['start'], $dr['end']])
              ->where('status', '!=', 'cancelled')
        )->with('product:id,name,purchase_price', 'product.category:id,name')->get();

        $topByRevenue = $items->groupBy('product_id')
            ->map(function ($rows) {
                $p = $rows->first()->product;
                return [
                    'name'     => $p?->name ?? 'Unknown',
                    'revenue'  => round($rows->sum(fn ($i) => $i->price * $i->quantity), 2),
                    'quantity' => $rows->sum('quantity'),
                    'orders'   => $rows->pluck('order_id')->unique()->count(),
                ];
            })
            ->sortByDesc('revenue')->values();

        $byCategory = $items->groupBy(fn ($i) => $i->product?->category?->name ?? 'Uncategorized')
            ->map(fn ($rows, $cat) => [
                'name'    => $cat,
                'revenue' => round($rows->sum(fn ($i) => $i->price * $i->quantity), 2),
                'qty'     => $rows->sum('quantity'),
            ])
            ->sortByDesc('revenue')->values();

        return Inertia::render('Admin/Reports/Products', [
            'filters' => $dr,
            'kpis'    => [
                'total_sold'      => $items->sum('quantity'),
                'total_revenue'   => round($items->sum(fn ($i) => $i->price * $i->quantity), 2),
                'unique_products' => $items->pluck('product_id')->unique()->count(),
                'total_orders'    => $items->pluck('order_id')->unique()->count(),
            ],
            'charts'      => [
                'top_by_revenue' => $topByRevenue->take(7),
                'by_category'    => $byCategory->take(7),
            ],
            'top_products' => $topByRevenue->take(30),
        ]);
    }

    // ──────────────────────────────────────────
    //  5. Inventory
    // ──────────────────────────────────────────

    public function inventory(Request $request): Response
    {
        $threshold = (int) get_setting('low_stock_threshold', 10);

        $products = Product::with('category:id,title')
            ->select(['id', 'name', 'stock', 'sale_price', 'purchase_price', 'category_id', 'images'])
            ->orderBy('stock', 'asc')
            ->get();

        $inStock    = $products->where('stock', '>', $threshold)->count();
        $lowStock   = $products->where('stock', '>', 0)->where('stock', '<=', $threshold)->count();
        $outOfStock = $products->where('stock', '<=', 0)->count();
        $totalValue = round($products->sum(fn ($p) => $p->sale_price * max($p->stock, 0)), 2);

        $productList = $products->map(fn ($p) => [
            'id'       => $p->id,
            'name'     => $p->name,
            'category' => $p->category?->title ?? '—',
            'stock'    => $p->stock,
            'price'    => $p->sale_price,
            'value'    => round($p->sale_price * max($p->stock, 0), 2),
            'image'    => is_array($p->images) && count($p->images) > 0 ? $p->images[0] : null,
        ])->values();

        return Inertia::render('Admin/Reports/Inventory', [
            'kpis' => [
                'total'        => $products->count(),
                'in_stock'     => $inStock,
                'low_stock'    => $lowStock,
                'out_of_stock' => $outOfStock,
                'total_value'  => $totalValue,
                'threshold'    => $threshold,
            ],
            'distribution' => [
                ['label' => 'Out of stock', 'value' => $outOfStock, 'color' => '#EF4444'],
                ['label' => 'Low stock',    'value' => $lowStock,   'color' => '#F59E0B'],
                ['label' => 'In stock',     'value' => $inStock,    'color' => '#2DE3A7'],
            ],
            'products'  => $productList,
            'threshold' => $threshold,
        ]);
    }

    // ──────────────────────────────────────────
    //  6. Customers
    // ──────────────────────────────────────────

    public function customers(Request $request): Response
    {
        $dr     = $this->resolveDateRange($request);
        $orders = $this->ordersInRange($dr['start'], $dr['end'])
            ->where('status', '!=', 'cancelled')
            ->get(['id', 'customer_name', 'customer_phone', 'total', 'created_at']);

        $total   = $orders->count();
        $phones  = $orders->pluck('customer_phone')->unique();
        $phoneCounts = $orders->groupBy('customer_phone')->map->count();
        $returning   = $phoneCounts->filter(fn ($c) => $c > 1)->count();
        $new         = $phones->count() - $returning;
        $revenue     = $orders->sum('total');

        $newPerDay = $orders
            ->groupBy(fn ($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(fn ($rows, $date) => [
                'date'      => Carbon::parse($date)->format('d M'),
                'customers' => $rows->pluck('customer_phone')->unique()->count(),
                'orders'    => $rows->count(),
            ])
            ->sortKeys()->values();

        $topCustomers = $orders->groupBy('customer_phone')
            ->map(function ($rows) {
                $first = $rows->first();
                $cnt   = $rows->count();
                return [
                    'name'    => $first->customer_name,
                    'phone'   => $first->customer_phone,
                    'orders'  => $cnt,
                    'revenue' => round($rows->sum('total'), 2),
                    'aov'     => $cnt > 0 ? round($rows->sum('total') / $cnt, 2) : 0,
                ];
            })
            ->sortByDesc('revenue')->take(20)->values();

        return Inertia::render('Admin/Reports/Customers', [
            'filters' => $dr,
            'kpis'    => [
                'total'       => $phones->count(),
                'new'         => $new,
                'returning'   => $returning,
                'return_rate' => $phones->count() > 0 ? round($returning / $phones->count() * 100, 1) : 0,
                'total_orders'=> $total,
                'avg_ltv'     => $phones->count() > 0 ? round($revenue / $phones->count(), 2) : 0,
            ],
            'charts'       => ['new_per_day' => $newPerDay],
            'top_customers'=> $topCustomers,
        ]);
    }

    // ──────────────────────────────────────────
    //  7. Shipping & delivery
    // ──────────────────────────────────────────

    public function shipping(Request $request): Response
    {
        $dr     = $this->resolveDateRange($request);
        $orders = $this->ordersInRange($dr['start'], $dr['end'])
            ->where('status', '!=', 'cancelled')
            ->get(['id', 'courier', 'payment_method', 'delivery_cost', 'total']);

        $total   = $orders->count();
        $delCost = $orders->sum('delivery_cost');
        $cod     = $orders->where('payment_method', 'cod')->count();
        $prepaid = $orders->where('payment_method', '!=', 'cod')->count();

        $byCourier = $orders->groupBy(fn ($o) => $o->courier ?? 'Manual')
            ->map(fn ($rows, $name) => [
                'name'    => ucfirst($name),
                'orders'  => $rows->count(),
                'revenue' => round($rows->sum('delivery_cost'), 2),
            ])->values();

        return Inertia::render('Admin/Reports/Shipping', [
            'filters' => $dr,
            'kpis'    => [
                'total_orders'   => $total,
                'total_delivery' => round($delCost, 2),
                'cod_orders'     => $cod,
                'prepaid_orders' => $prepaid,
                'avg_delivery'   => $total > 0 ? round($delCost / $total, 2) : 0,
                'cod_pct'        => $total > 0 ? round($cod / $total * 100, 1) : 0,
            ],
            'charts'  => [
                'by_courier'    => $byCourier,
                'payment_split' => [
                    ['name' => 'COD',     'value' => $cod],
                    ['name' => 'Prepaid', 'value' => $prepaid],
                ],
            ],
        ]);
    }

    // ──────────────────────────────────────────
    //  8. Refunds & returns
    // ──────────────────────────────────────────

    public function refunds(Request $request): Response
    {
        $dr          = $this->resolveDateRange($request);
        $allCount    = $this->ordersInRange($dr['start'], $dr['end'])->count();
        $returned    = $this->ordersInRange($dr['start'], $dr['end'])
            ->where('status', 'returned')
            ->with('items.product:id,name')
            ->get();

        $totalVal = $returned->sum('total');

        $topProducts = $returned->flatMap->items
            ->groupBy('product_id')
            ->map(function ($rows) {
                $p = $rows->first()->product;
                return [
                    'name'     => $p?->name ?? 'Unknown',
                    'quantity' => $rows->sum('quantity'),
                    'value'    => round($rows->sum(fn ($i) => $i->price * $i->quantity), 2),
                ];
            })
            ->sortByDesc('quantity')->take(10)->values();

        $daily = $returned
            ->groupBy(fn ($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(fn ($rows, $date) => [
                'date'    => Carbon::parse($date)->format('d M'),
                'returns' => $rows->count(),
                'value'   => round($rows->sum('total'), 2),
            ])
            ->sortKeys()->values();

        $refundList = $returned->map(fn ($o) => [
            'id'       => $o->id,
            'customer' => $o->customer_name,
            'phone'    => $o->customer_phone,
            'total'    => $o->total,
            'items'    => $o->items->count(),
            'date'     => Carbon::parse($o->created_at)->format('d M Y'),
        ])->values();

        return Inertia::render('Admin/Reports/Refunds', [
            'filters' => $dr,
            'kpis'    => [
                'total_returned' => $returned->count(),
                'total_value'    => round($totalVal, 2),
                'return_rate'    => $allCount > 0 ? round($returned->count() / $allCount * 100, 1) : 0,
                'all_orders'     => $allCount,
            ],
            'charts'               => ['daily_refunds' => $daily],
            'top_returned_products'=> $topProducts,
            'refund_list'          => $refundList,
        ]);
    }

    // ──────────────────────────────────────────
    //  9. Geography
    // ──────────────────────────────────────────

    public function geography(Request $request): Response
    {
        $dr     = $this->resolveDateRange($request);
        $orders = $this->ordersInRange($dr['start'], $dr['end'])
            ->where('status', '!=', 'cancelled')
            ->get(['id', 'customer_address', 'total']);

        $total = $orders->count();

        $byLocation = $orders->groupBy(function ($o) {
            $addr  = trim($o->customer_address ?? '');
            if (empty($addr)) return 'Unknown';
            $parts = array_values(array_filter(array_map('trim', preg_split('/[,\n]+/', $addr))));
            // Use second-to-last segment as city (last is often country/postal)
            if (count($parts) >= 2) return $parts[count($parts) - 2];
            return $parts[0];
        })->map(fn ($rows, $loc) => [
            'location' => $loc,
            'orders'   => $rows->count(),
            'revenue'  => round($rows->sum('total'), 2),
            'pct'      => $total > 0 ? round($rows->count() / $total * 100, 1) : 0,
        ])->sortByDesc('orders')->values();

        return Inertia::render('Admin/Reports/Geography', [
            'filters' => $dr,
            'kpis'    => [
                'total_orders'     => $total,
                'unique_locations' => $byLocation->count(),
                'top_location'     => $byLocation->first()['location'] ?? '—',
                'top_pct'          => $byLocation->first()['pct'] ?? 0,
            ],
            'charts'         => ['by_location' => $byLocation->take(10)],
            'location_table' => $byLocation,
        ]);
    }

    // ──────────────────────────────────────────
    //  Stubs (routes registered but not in sidebar)
    // ──────────────────────────────────────────

    public function discounts(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title'       => 'Discounts & coupons',
            'description' => 'Promotion usage, discount amounts, and code performance.',
        ]);
    }

    public function payments(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title'       => 'Payments',
            'description' => 'Totals by payment method, pending and failed payments.',
        ]);
    }

    public function tax(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title'       => 'Tax',
            'description' => 'Tax collected by rate and jurisdiction when tax rules are enabled.',
        ]);
    }

    public function abandonedCheckouts(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title'       => 'Abandoned checkouts',
            'description' => 'Sessions that reached checkout without completing payment.',
        ]);
    }
}
