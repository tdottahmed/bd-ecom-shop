<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; }
        h1 { font-size: 22px; margin: 0 0 4px 0; }
        .muted { color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border-bottom: 1px solid #ddd; padding: 8px 6px; text-align: left; vertical-align: top; }
        th { border-bottom: 2px solid #333; font-weight: bold; }
        .right { text-align: right; }
        .center { text-align: center; }
        .totals { width: 220px; margin-left: auto; margin-top: 16px; }
        .totals-row { display: table; width: 100%; margin-bottom: 6px; }
        .totals-row span { display: table-cell; }
        .totals-row span:last-child { text-align: right; }
        .grand { font-weight: bold; font-size: 14px; border-top: 1px solid #333; padding-top: 8px; margin-top: 8px; }
        .var { font-size: 10px; color: #666; margin-top: 2px; }
        img.logo { max-height: 46px; width: auto; display: inline-block; margin-bottom: 6px; }
    </style>
</head>
<body>
    @php
        $siteName = get_setting('site_title', config('app.name'));
        $siteLogo = get_setting('site_logo');
        $siteLogoSrc = null;
        if (!empty($siteLogo) && is_string($siteLogo)) {
            $cleanLogo = ltrim($siteLogo, '/');
            if (str_starts_with($cleanLogo, 'storage/')) {
                $cleanLogo = substr($cleanLogo, strlen('storage/'));
            }
            $siteLogoSrc = 'file://' . public_path('storage/' . $cleanLogo);
        }
    @endphp
    <table style="border: none; margin-top: 0;">
        <tr style="border: none;">
            <td style="border: none; width: 50%; vertical-align: top;">
                <h1>INVOICE</h1>
                <p class="muted" style="margin: 0;">#{{ $order->id }}</p>
            </td>
            <td style="border: none; width: 50%; vertical-align: top; text-align: right;">
                @if($siteLogoSrc)
                    <img
                        src="{{ $siteLogoSrc }}"
                        alt="Logo"
                        class="logo"
                    >
                @endif
                <strong>{{ $siteName }}</strong>
                <p class="muted" style="margin: 4px 0 0 0;">{{ config('app.url') }}</p>
            </td>
        </tr>
    </table>

    <table style="border: none; margin-top: 24px;">
        <tr style="border: none;">
            <td style="border: none; width: 50%; vertical-align: top;">
                <strong>Bill to</strong>
                <p style="margin: 8px 0 0 0;">{{ $order->customer_name ?? 'Customer' }}</p>
                <p style="margin: 2px 0;">{{ $order->customer_phone }}</p>
                @if($order->customer_email)
                    <p style="margin: 2px 0;">{{ $order->customer_email }}</p>
                @endif
                <p style="margin: 4px 0 0 0; max-width: 280px;">{{ $order->customer_address }}</p>
            </td>
            <td style="border: none; width: 50%; vertical-align: top; text-align: right;">
                <strong>Order details</strong>
                <p style="margin: 8px 0 0 0;">Date: {{ $order->created_at->format('M j, Y') }}</p>
                <p style="margin: 2px 0;">Status: {{ $order->status }}</p>
                @if($order->payment_method)
                    <p style="margin: 2px 0;">Payment: {{ $order->payment_method }}</p>
                @endif
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th class="center">Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->product->name ?? 'Product' }}</strong>
                        @if(!empty($item->variation_ids) && $item->product && $item->product->product_variations)
                            @foreach($item->variation_ids as $vid)
                                @php
                                    $v = $item->product->product_variations->firstWhere('id', $vid);
                                @endphp
                                @if($v)
                                    <div class="var">
                                        {{ $v->product_attribute->name ?? 'Option' }}: {{ $v->value }}
                                    </div>
                                @endif
                            @endforeach
                        @endif
                    </td>
                    <td class="center">{{ $item->quantity }}</td>
                    <td class="right">৳{{ number_format((float) $item->price, 2) }}</td>
                    <td class="right">৳{{ number_format((float) $item->price * (int) $item->quantity, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">
            <span>Subtotal</span>
            <span>৳{{ number_format((float) $order->subtotal, 2) }}</span>
        </div>
        <div class="totals-row">
            <span>Delivery</span>
            <span>৳{{ number_format((float) $order->delivery_cost, 2) }}</span>
        </div>
        <div class="totals-row grand">
            <span>Total</span>
            <span>৳{{ number_format((float) $order->total, 2) }}</span>
        </div>
    </div>

    <p class="muted" style="margin-top: 40px; text-align: center; font-size: 11px;">Thank you for your order.</p>
</body>
</html>
