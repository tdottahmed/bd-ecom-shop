<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $mailSubject }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; }
        .wrapper { max-width: 640px; margin: 40px auto; padding: 0 16px 40px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .header { background: #0f1a18; padding: 28px 32px; }
        .header h1 { color: #2de3a7; font-size: 18px; font-weight: 800; letter-spacing: 0.01em; }
        .body { padding: 28px 32px 30px; }
        .text { font-size: 14px; line-height: 1.8; color: #111827; white-space: pre-wrap; }
        .muted { font-size: 12px; line-height: 1.6; color: #6b7280; margin-top: 18px; }
        .quote { margin-top: 18px; padding: 14px 16px; border-left: 3px solid #a7f3d0; background: #f0fdf9; border-radius: 10px; }
        .quote .label { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #059669; margin-bottom: 8px; }
        .quote .q { font-size: 13px; line-height: 1.7; color: #374151; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>{{ get_setting('seo_site_name') ?: get_setting('site_name') ?: config('app.name') }}</h1>
            </div>
            <div class="body">
                <div class="text">{{ $replyMessage }}</div>

                <div class="quote">
                    <div class="label">Your message</div>
                    <div class="q">{{ $contactMessage->message }}</div>
                </div>

                <div class="muted">
                    If you have more questions, just reply to this email.
                </div>
            </div>
        </div>
    </div>
</body>
</html>

