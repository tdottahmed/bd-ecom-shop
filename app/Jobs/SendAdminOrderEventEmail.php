<?php

namespace App\Jobs;

use App\Mail\AdminOrderEventMail;
use App\Models\Order;
use App\Support\AdminRecipients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAdminOrderEventEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $orderId,
        public string $event,
        public ?string $oldStatus = null,
        public ?string $newStatus = null,
    ) {
        $this->onQueue('mail');
    }

    public function handle(): void
    {
        $emails = AdminRecipients::emails();
        if (empty($emails)) {
            return;
        }

        $order = Order::query()->find($this->orderId);
        if (! $order) {
            return;
        }

        Mail::to($emails)->send(new AdminOrderEventMail(
            order: $order,
            event: $this->event,
            oldStatus: $this->oldStatus,
            newStatus: $this->newStatus,
        ));
    }
}

