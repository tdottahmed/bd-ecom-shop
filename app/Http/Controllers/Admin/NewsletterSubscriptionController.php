<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsletterSubscription::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('email', 'like', '%' . $search . '%');
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $subscriptions = $query
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Newsletter/Index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function toggleStatus(NewsletterSubscription $newsletterSubscription)
    {
        if ($newsletterSubscription->status === 'active') {
            $newsletterSubscription->update([
                'status' => 'unsubscribed',
                'unsubscribed_at' => now(),
            ]);
        } else {
            $newsletterSubscription->update([
                'status' => 'active',
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);
        }

        return redirect()->back()->with('success', 'Subscription status updated.');
    }

    public function destroy(NewsletterSubscription $newsletterSubscription)
    {
        $newsletterSubscription->delete();

        return redirect()->back()->with('success', 'Subscription removed.');
    }
}

