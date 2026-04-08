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

        $fromSettings = [];
        try {
            $contactEmail = (string) get_setting('contact_email');
            if ($contactEmail !== '') {
                $fromSettings[] = $contactEmail;
            }
        } catch (\Throwable) {
            // settings helper may not be available in some contexts
        }

        $fallback = array_filter([
            config('mail.from.address'),
        ]);

        return array_values(array_unique(array_filter(array_merge($fromEnv, $fromSettings, $fallback))));
    }

    /**
     * Users that should receive in-app (DB) notifications.
     */
    public static function users(): Collection
    {
        $emails = self::emails();

        if (! empty($emails)) {
            $users = User::query()->whereIn('email', $emails)->get();
            if ($users->isNotEmpty()) {
                return $users;
            }
        }

        // Safe-ish fallback so the feature works in fresh installs:
        // if no recipient emails are configured yet, notify the earliest user.
        return User::query()->orderBy('id')->limit(1)->get();
    }
}

