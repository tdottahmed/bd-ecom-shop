<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Collection;

class AdminRecipients
{
    /**
     * @return array<int, string>
     */
    public static function emails(): array
    {
        $raw = (string) env('ADMIN_NOTIFICATION_EMAILS', '');

        $fromEnv = array_values(array_filter(array_map(
            static fn (string $email) => trim($email),
            $raw === '' ? [] : explode(',', $raw)
        )));

        // NOTE: contact_email is the store's public contact address shown to customers.
        // It must NOT be used here — it would route notifications to a customer account.
        // Configure ADMIN_NOTIFICATION_EMAILS in .env to override the default admin user.

        $fallback = array_filter([
            config('mail.from.address'),
        ]);

        return array_values(array_unique(array_filter(array_merge($fromEnv, $fallback))));
    }

    /**
     * Users that should receive in-app (DB) notifications.
     * Always resolves to admin users only — never customer accounts.
     */
    public static function users(): Collection
    {
        $raw = (string) env('ADMIN_NOTIFICATION_EMAILS', '');

        if ($raw !== '') {
            $emails = array_values(array_filter(array_map(
                static fn (string $email) => trim($email),
                explode(',', $raw)
            )));

            if (! empty($emails)) {
                $users = User::query()->whereIn('email', $emails)->get();
                if ($users->isNotEmpty()) {
                    return $users;
                }
            }
        }

        // Fallback: the earliest user (ID 1) is always the admin account.
        return User::query()->orderBy('id')->limit(1)->get();
    }
}

