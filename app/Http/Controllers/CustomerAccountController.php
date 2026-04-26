<?php

namespace App\Http\Controllers;

use App\Models\NewProductRequest;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CustomerAccountController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $recentOrders = $user->orders()->latest()->limit(5)->get();

        return Inertia::render('Customer/Account/Dashboard', [
            'stats' => [
                'totalOrders' => $user->orders()->count(),
                'pendingOrders' => $user->orders()->where('status', 'pending')->count(),
                'cartItems' => count($user->cart_data ?? []),
            ],
            'recentOrders' => $recentOrders,
        ]);
    }

    public function orders(Request $request): Response
    {
        return Inertia::render('Customer/Account/Orders', [
            'orders' => $request->user()->orders()->with('items.product')->latest()->paginate(10),
        ]);
    }

    public function orderShow(Request $request, Order $order): Response
    {
        $order = $this->orderForCustomer($request, $order);

        return Inertia::render('Customer/Account/OrderShow', [
            'order' => $order,
        ]);
    }

    public function orderInvoice(Request $request, Order $order): Response
    {
        $order = $this->orderForCustomer($request, $order);

        return Inertia::render('Customer/Account/OrderInvoice', [
            'order' => $order,
        ]);
    }

    public function orderInvoicePdf(Request $request, Order $order): SymfonyResponse
    {
        $order = $this->orderForCustomer($request, $order);

        $pdf = Pdf::loadView('pdf.customer_order_invoice', ['order' => $order]);

        return $pdf->download('order-' . $order->id . '-invoice.pdf');
    }

    protected function orderForCustomer(Request $request, Order $order): Order
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return $order->load([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge',
        ]);
    }

    public function cart(Request $request): Response
    {
        return Inertia::render('Customer/Account/Cart', [
            'cartItems' => array_values($request->user()->cart_data ?? []),
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('Customer/Account/Profile', [
            'user' => $request->user()->only(['name', 'email', 'phone', 'address']),
        ]);
    }

    public function addresses(Request $request): Response
    {
        return Inertia::render('Customer/Account/Addresses', [
            'address' => $request->user()->address,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:2000'],
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->string('password')),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function productRequests(Request $request): Response
    {
        $requests = NewProductRequest::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Account/ProductRequests', [
            'productRequests' => $requests,
        ]);
    }

    public function syncCart(Request $request): RedirectResponse
    {
        if ($request->has('items')) {
            $request->user()->update([
                'cart_data' => $request->items,
            ]);
        }
        return back();
    }
}
