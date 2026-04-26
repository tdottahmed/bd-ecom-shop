<?php

namespace App\Jobs;

use App\Mail\ContactMessageReplyMail;
use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendContactMessageReplyEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $contactMessageId,
        public string $subject,
        public string $replyMessage,
    ) {
        $this->onQueue('mail');
    }

    public function handle(): void
    {
        $contactMessage = ContactMessage::query()->find($this->contactMessageId);
        if (! $contactMessage) {
            return;
        }

        Mail::to($contactMessage->email)->send(new ContactMessageReplyMail(
            contactMessage: $contactMessage,
            mailSubject: $this->subject,
            replyMessage: $this->replyMessage,
        ));
    }
}

