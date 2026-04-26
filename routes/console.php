<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Dynamic scheduled product update — configured via Admin → Website Settings → System → Scheduler
try {
    if (get_setting('scheduled_product_update_enabled', '0') === '1') {
        $cron = get_setting('scheduled_product_update_cron', '0 0 * * *') ?: '0 0 * * *';
        Schedule::command('update:products')->cron($cron);
    }
} catch (\Throwable) {
    // DB may not be available during initial boot / migrations; skip silently.
}
