<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewProductRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = NewProductRequest::query()->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        $requests = $query->paginate(20)->withQueryString();

        $counts = [
            'all'       => NewProductRequest::count(),
            'pending'   => NewProductRequest::where('status', 'pending')->count(),
            'reviewing' => NewProductRequest::where('status', 'reviewing')->count(),
            'approved'  => NewProductRequest::where('status', 'approved')->count(),
            'rejected'  => NewProductRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/NewProductRequests/Index', [
            'requests' => $requests,
            'counts'   => $counts,
            'filters'  => [
                'status' => $request->input('status', ''),
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    public function updateStatus(Request $request, NewProductRequest $newProductRequest)
    {
        $data = $request->validate([
            'status'      => ['required', 'in:pending,reviewing,approved,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $newProductRequest->update($data);

        return back()->with('success', 'Request updated.');
    }

    public function destroy(NewProductRequest $newProductRequest)
    {
        $newProductRequest->delete();

        return back()->with('success', 'Request deleted.');
    }
}
