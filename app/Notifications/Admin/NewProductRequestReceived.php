<?php

namespace App\Notifications\Admin;

use App\Models\NewProductRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewProductRequestReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public NewProductRequest $request)
    {
        $this->afterCommit();
    }

    public function via(mixed $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'kind'       => 'new_product_request',
            'title'      => 'New product request',
            'body'       => $this->request->product_name . ' — ' . $this->request->customer_name,
            'action_url' => route('admin.new-product-requests.index'),
            'created_at' => now()->toISOString(),
        ];
    }
}
