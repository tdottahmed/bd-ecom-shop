<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterSubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email:rfc,dns|max:255',
        ]);

        $subscription = NewsletterSubscription::firstOrNew([
            'email' => strtolower(trim($data['email'])),
        ]);

        $subscription->status = 'active';
        $subscription->subscribed_at = now();
        $subscription->unsubscribed_at = null;
        $subscription->source = 'home_newsletter';
        $subscription->ip_address = $request->ip();
        $subscription->user_agent = (string) $request->userAgent();
        $subscription->save();

        return response()->json([
            'message' => 'Subscribed successfully.',
        ]);
    }
}

