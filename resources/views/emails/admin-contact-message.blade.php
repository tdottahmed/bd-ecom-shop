<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Message</title>
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
        .meta .label { width: 110px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; }
        .meta .value { font-size: 13px; color: #111827; word-break: break-word; }
        .messageBox { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; font-size: 14px; line-height: 1.7; color: #111827; white-space: pre-wrap; }
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
                <div class="kicker">Contact</div>
                <div class="title">New contact message received</div>
                <p class="text">A customer submitted a message from the Contact Us form.</p>

                <div class="meta">
                    <div class="row">
                        <div class="label">From</div>
                        <div class="value">{{ $message->first_name }} {{ $message->last_name }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Email</div>
                        <div class="value">{{ $message->email }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Subject</div>
                        <div class="value">{{ $message->subject }}</div>
                    </div>
                </div>

                <div class="messageBox">{{ $message->message }}</div>

                <div class="cta">
                    <a class="btn" href="{{ route('admin.contact-messages.show', $message->id) }}">View in Admin Panel</a>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>You received this because you are configured as an admin notification recipient.</p>
        </div>
    </div>
</body>
</html>

