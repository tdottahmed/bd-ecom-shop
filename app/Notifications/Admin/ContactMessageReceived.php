<?php

namespace App\Notifications\Admin;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public ContactMessage $message)
    {
        $this->afterCommit();
    }

    /**
     * @param  mixed  $notifiable
     * @return array<int, string>
     */
    public function via(mixed $notifiable): array
    {
        return ['database'];
    }

    /**
     * @param  mixed  $notifiable
     * @return array<string, mixed>
     */
    public function toDatabase(mixed $notifiable): array
    {
        return [
            'kind' => 'contact_message',
            'title' => 'New contact message',
            'body' => trim(($this->message->subject ? $this->message->subject . ' — ' : '') . $this->message->email),
            'action_url' => route('admin.contact-messages.show', $this->message->id),
            'created_at' => now()->toISOString(),
        ];
    }
}

