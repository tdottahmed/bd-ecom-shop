<?php

namespace App\Http\Controllers;

use App\Models\NewProductRequest;
use App\Notifications\Admin\NewProductRequestReceived;
use App\Support\AdminRecipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class NewProductRequestController extends Controller
{
    public function create()
    {
        $user = auth()->user();

        return Inertia::render('Customer/RequestNewProduct', [
            'auth_user' => $user ? [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            '_hp'            => ['nullable', 'string', 'max:0'],
            'customer_name'  => ['required', 'string', 'max:100'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'product_name'   => ['required', 'string', 'max:255'],
            'category'       => ['nullable', 'string', 'max:100'],
            'description'    => ['required', 'string', 'max:2000'],
            'reference_url'  => ['nullable', 'url', 'max:500'],
            'quantity'       => ['nullable', 'integer', 'min:1', 'max:999'],
            'budget'         => ['nullable', 'numeric', 'min:0'],
        ]);

        $productRequest = NewProductRequest::create([
            'user_id'        => auth()->id(),
            'customer_name'  => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'] ?? null,
            'product_name'   => $data['product_name'],
            'category'       => $data['category'] ?? null,
            'description'    => $data['description'],
            'reference_url'  => $data['reference_url'] ?? null,
            'quantity'       => $data['quantity'] ?? 1,
            'budget'         => isset($data['budget']) ? (float) $data['budget'] : null,
        ]);

        try {
            Notification::send(
                AdminRecipients::users(),
                new NewProductRequestReceived($productRequest)
            );
        } catch (\Throwable) {
        }

        return back()->with('success', 'Your product request has been submitted! We will review it and get back to you soon.');
    }
}
