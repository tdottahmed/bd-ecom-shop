<?php

namespace App\Notifications\Admin;

use App\Models\ProductRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProductRequestReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public ProductRequest $productRequest)
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
        $body = $this->productRequest->product_name;

        if ($this->productRequest->variation_label) {
            $body .= ' — ' . $this->productRequest->variation_label;
        }

        $body .= ' (by ' . $this->productRequest->customer_name . ')';

        return [
            'kind'       => 'product_request',
            'title'      => 'New product request',
            'body'       => $body,
            'action_url' => route('admin.product-requests.index'),
            'request_id' => $this->productRequest->id,
            'created_at' => now()->toISOString(),
        ];
    }
}
