<?php

namespace App\Jobs;

use App\Mail\AdminContactMessageMail;
use App\Models\ContactMessage;
use App\Support\AdminRecipients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAdminContactMessageEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $contactMessageId)
    {
        $this->onQueue('mail');
    }

    public function handle(): void
    {
        $emails = AdminRecipients::emails();
        if (empty($emails)) {
            return;
        }

        $message = ContactMessage::query()->find($this->contactMessageId);
        if (! $message) {
            return;
        }

        Mail::to($emails)->send(new AdminContactMessageMail($message));
    }
}

