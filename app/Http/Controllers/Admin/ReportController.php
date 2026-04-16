<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Reports overview',
            'description' => 'Summary KPIs and quick links to detailed reports. Charts and exports will appear here as we connect your store data.',
        ]);
    }

    public function sales(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Sales performance',
            'description' => 'Revenue, orders count, and average order value over time. Filter by date range, channel, and currency.',
        ]);
    }

    public function orders(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Orders',
            'description' => 'Order volume, status breakdown, fulfillment time, and cancellations.',
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Products',
            'description' => 'Best sellers, slow movers, sales by category and brand, and product-level revenue.',
        ]);
    }

    public function inventory(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Inventory',
            'description' => 'Stock on hand, low-stock alerts, stock movement, and valuation.',
        ]);
    }

    public function customers(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Customers',
            'description' => 'New vs returning customers, lifetime value, order frequency, and top accounts.',
        ]);
    }

    public function discounts(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Discounts & coupons',
            'description' => 'Promotion usage, discount amounts, and code performance.',
        ]);
    }

    public function payments(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Payments',
            'description' => 'Totals by payment method, pending and failed payments, and reconciliation helpers.',
        ]);
    }

    public function shipping(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Shipping & delivery',
            'description' => 'Courier usage, delivery charges, COD vs prepaid, and regional performance.',
        ]);
    }

    public function refunds(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Refunds & returns',
            'description' => 'Refund amounts, reasons, and items returned by category.',
        ]);
    }

    public function tax(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Tax',
            'description' => 'Tax collected by rate and jurisdiction when tax rules are enabled.',
        ]);
    }

    public function abandonedCheckouts(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Abandoned checkouts',
            'description' => 'Sessions that reached checkout without completing payment. Useful for recovery campaigns.',
        ]);
    }

    public function geography(): Response
    {
        return Inertia::render('Admin/Reports/Generic', [
            'title' => 'Geography',
            'description' => 'Sales and orders by city, zone, and region from shipping addresses.',
        ]);
    }
}
