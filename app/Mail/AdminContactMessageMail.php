<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $message) {}

    public function envelope(): Envelope
    {
        $siteName = get_setting('seo_site_name') ?: get_setting('site_name') ?: config('app.name', 'Store');

        return new Envelope(
            subject: 'New contact message — ' . $siteName,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-contact-message',
        );
    }
}

