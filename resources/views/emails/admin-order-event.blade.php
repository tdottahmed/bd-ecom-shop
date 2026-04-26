<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Notification</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; }
        .wrapper { max-width: 640px; margin: 40px auto; padding: 0 16px 40px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .header { background: #0f1a18; padding: 28px 32px; }
        .header h1 { color: #2de3a7; font-size: 18px; font-weight: 800; letter-spacing: 0.01em; }
        .header p { color: #a7f3d0; font-size: 12px; margin-top: 6px; opacity: 0.95; }
        .body { padding: 28px 32px 30px; }
        .kicker { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; margin-bottom: 10px; }
        .title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 10px; }
        .text { font-size: 14px; line-height: 1.7; color: #4b5563; margin-bottom: 18px; }
        .meta { background: #f0fdf9; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px 18px; margin: 18px 0; }
        .meta .row { display: flex; gap: 12px; padding: 6px 0; }
        .meta .label { width: 140px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; }
        .meta .value { font-size: 13px; color: #111827; word-break: break-word; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #0f1a18; color: #2de3a7; font-size: 12px; font-weight: 800; letter-spacing: 0.02em; }
        .cta { text-align: center; margin-top: 22px; }
        .btn { display: inline-block; background: #0f1a18; color: #2de3a7; text-decoration: none; padding: 12px 26px; border-radius: 999px; font-size: 13px; font-weight: 800; letter-spacing: 0.02em; }
        .footer { text-align: center; padding: 18px 32px 0; font-size: 12px; color: #9ca3af; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>{{ get_setting('seo_site_name') ?: get_setting('site_name') ?: config('app.name') }}</h1>
                <p>Admin notification</p>
            </div>

            <div class="body">
                <div class="kicker">Orders</div>
                <div class="title">
                    @if($event === 'created')
                        New order placed
                    @else
                        Order status updated
                    @endif
                </div>
                <p class="text">Order <strong>#{{ $order->id }}</strong> has a new update.</p>

                <div class="meta">
                    <div class="row">
                        <div class="label">Current Status</div>
                        <div class="value"><span class="badge">{{ $order->status }}</span></div>
                    </div>
                    @if($event === 'status_updated')
                        <div class="row">
                            <div class="label">Change</div>
                            <div class="value">{{ $oldStatus }} → {{ $newStatus }}</div>
                        </div>
                    @endif
                    <div class="row">
                        <div class="label">Customer</div>
                        <div class="value">{{ $order->customer_name }} ({{ $order->customer_phone }})</div>
                    </div>
                    <div class="row">
                        <div class="label">Total</div>
                        <div class="value">{{ number_format((float) $order->total, 2) }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Payment</div>
                        <div class="value">{{ $order->payment_method }} — {{ $order->payment_status }}</div>
                    </div>
                </div>

                <div class="cta">
                    <a class="btn" href="{{ route('admin.orders.show', $order->id) }}">Open Order in Admin</a>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>You received this because you are configured as an admin notification recipient.</p>
        </div>
    </div>
</body>
</html>

