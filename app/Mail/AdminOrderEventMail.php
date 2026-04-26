<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminOrderEventMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $event,
        public ?string $oldStatus = null,
        public ?string $newStatus = null,
    ) {}

    public function envelope(): Envelope
    {
        $siteName = get_setting('seo_site_name') ?: get_setting('site_name') ?: config('app.name', 'Store');

        $subject = $this->event === 'created'
            ? 'New order placed — ' . $siteName
            : 'Order status updated — ' . $siteName;

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-order-event',
        );
    }
}

