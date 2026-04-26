<?php

namespace App\Notifications\Admin;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OrderEvent extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Order $order,
        public string $event, // created|status_updated
        public ?string $oldStatus = null,
        public ?string $newStatus = null,
    ) {
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
        $title = $this->event === 'created'
            ? 'New order placed'
            : 'Order status updated';

        $statusPart = $this->event === 'status_updated'
            ? trim(($this->oldStatus ? $this->oldStatus . ' → ' : '') . ($this->newStatus ?? ''))
            : ($this->order->status ?? 'pending');

        return [
            'kind' => 'order',
            'title' => $title,
            'body' => trim('Order #' . $this->order->id . ($statusPart ? ' — ' . $statusPart : '')),
            'action_url' => route('admin.orders.show', $this->order->id),
            'order_id' => $this->order->id,
            'event' => $this->event,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'created_at' => now()->toISOString(),
        ];
    }
}

