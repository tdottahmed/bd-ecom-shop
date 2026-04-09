<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->withCount('orders')
            ->orderByDesc('created_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($filter = $request->input('filter')) {
            match ($filter) {
                'verified'   => $query->whereNotNull('email_verified_at'),
                'unverified' => $query->whereNull('email_verified_at'),
                'social'     => $query->whereNotNull('social_provider'),
                default      => null,
            };
        }

        $users = $query->paginate(20)->withQueryString();

        $stats = [
            'total'      => User::count(),
            'verified'   => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
            'social'     => User::whereNotNull('social_provider')->count(),
            'this_month' => User::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)
                                ->count(),
        ];

        return Inertia::render('Admin/Settings/Users/Index', [
            'users'   => $users,
            'filters' => [
                'search' => $request->input('search'),
                'filter' => $request->input('filter'),
            ],
            'stats'   => $stats,
        ]);
    }

    public function show(User $user)
    {
        $user->load([
            'orders' => fn ($q) => $q->orderByDesc('created_at')->limit(10),
        ]);
        $user->loadCount('orders');

        return Inertia::render('Admin/Settings/Users/Show', [
            'user' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        // Prevent deleting self
        /** @var \App\Models\User $admin */
        $admin = request()->user();
        if ($user->id === $admin->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
