<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        $this->applySmtpSettings();
    }

    private function applySmtpSettings(): void
    {
        try {
            $host = get_setting('smtp_host');
            if (!$host) {
                return; // No SMTP overrides configured
            }

            Config::set('mail.mailers.smtp.host', $host);

            $port = get_setting('smtp_port');
            if ($port) {
                Config::set('mail.mailers.smtp.port', (int) $port);
            }

            $username = get_setting('smtp_username');
            if ($username !== null) {
                Config::set('mail.mailers.smtp.username', $username);
            }

            $password = get_setting('smtp_password');
            if ($password !== null) {
                Config::set('mail.mailers.smtp.password', $password);
            }

            $encryption = get_setting('smtp_encryption');
            if ($encryption !== null) {
                Config::set('mail.mailers.smtp.encryption', $encryption ?: null);
            }

            $fromAddress = get_setting('smtp_from_address');
            if ($fromAddress) {
                Config::set('mail.from.address', $fromAddress);
            }

            $fromName = get_setting('smtp_from_name');
            if ($fromName) {
                Config::set('mail.from.name', $fromName);
            }

            // Switch default mailer to smtp when DB settings are present
            Config::set('mail.default', 'smtp');
        } catch (\Exception) {
            // DB may not exist yet (first migration run), skip silently
        }
    }
}
