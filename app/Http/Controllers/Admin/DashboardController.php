<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('date_range', 'all');
        $startDate = $request->input('start_date');
        $endDate   = $request->input('end_date');

        $query = Order::query();

        if ($dateRange === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        } else {
            match ($dateRange) {
                'today'        => $query->whereDate('created_at', Carbon::today()),
                'yesterday'    => $query->whereDate('created_at', Carbon::yesterday()),
                'last_week'    => $query->whereBetween('created_at', [Carbon::now()->subWeek()->startOfDay(), Carbon::now()->endOfDay()]),
                'last_month'   => $query->whereBetween('created_at', [Carbon::now()->subMonth()->startOfDay(), Carbon::now()->endOfDay()]),
                'last_6_months'=> $query->whereBetween('created_at', [Carbon::now()->subMonths(6)->startOfDay(), Carbon::now()->endOfDay()]),
                'last_year'    => $query->whereBetween('created_at', [Carbon::now()->subYear()->startOfDay(), Carbon::now()->endOfDay()]),
                default        => null,
            };
        }

        $orders = $query->with(['items.product'])->get();

        $additionalCost = get_setting('additional_cost', 0);

        $activeOrders = $orders->where('status', '!=', 'cancelled');

        $totalSell = $activeOrders->sum('total');

        $profit = $activeOrders->sum(function ($order) use ($additionalCost) {
            return $order->items->sum(function ($item) use ($additionalCost) {
                $purchasePrice = $item->product->purchase_price ?? 0;
                return ($item->price - ($purchasePrice + $additionalCost)) * $item->quantity;
            });
        });

        $completedOrders = $orders->where('status', 'completed');
        $completedSell   = $completedOrders->sum('total');

        $completedProfit = $completedOrders->sum(function ($order) use ($additionalCost) {
            return $order->items->sum(function ($item) use ($additionalCost) {
                $purchasePrice = $item->product->purchase_price ?? 0;
                return ($item->price - ($purchasePrice + $additionalCost)) * $item->quantity;
            });
        });

        $totalOrders        = $orders->count();
        $completedCount     = $completedOrders->count();
        $canceledCount      = $orders->where('status', 'cancelled')->count();
        $pendingCount       = $orders->filter(fn($o) => !in_array($o->status, ['completed', 'cancelled']))->count();

        // Sales trend grouped by day
        $salesTrend = $orders->groupBy(fn($o) => Carbon::parse($o->created_at)->format('Y-m-d'))
            ->map(fn($rows, $date) => [
                'date'   => $date,
                'sales'  => $rows->where('status', '!=', 'cancelled')->sum('total'),
                'profit' => $rows->where('status', '!=', 'cancelled')->sum(function ($order) use ($additionalCost) {
                    return $order->items->sum(function ($item) use ($additionalCost) {
                        $purchasePrice = $item->product->purchase_price ?? 0;
                        return ($item->price - ($purchasePrice + $additionalCost)) * $item->quantity;
                    });
                }),
            ])
            ->values();

        // Order status distribution
        $orderStatus = $orders->groupBy('status')
            ->map(fn($rows, $status) => ['name' => ucfirst($status), 'value' => $rows->count()])
            ->values();

        // Recent orders — always latest 8 regardless of date filter
        $recentOrders = Order::latest()->limit(8)->get(['id', 'customer_name', 'customer_phone', 'total', 'status', 'created_at']);

        return inertia('Dashboard', [
            'metrics' => [
                'total_sell'       => $totalSell,
                'profit'           => $profit,
                'completed_sell'   => $completedSell,
                'completed_profit' => $completedProfit,
                'total_orders'     => $totalOrders,
                'completed_orders' => $completedCount,
                'canceled_orders'  => $canceledCount,
                'pending_orders'   => $pendingCount,
                'avg_order_value'  => $totalOrders > 0 ? round($totalSell / $totalOrders) : 0,
            ],
            'charts' => [
                'sales_trend'  => $salesTrend,
                'order_status' => $orderStatus,
            ],
            'recent_orders' => $recentOrders,
            'filters' => [
                'date_range' => $dateRange,
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }

    public function settings()
    {
        return inertia('Admin/Settings/Index');
    }
}
