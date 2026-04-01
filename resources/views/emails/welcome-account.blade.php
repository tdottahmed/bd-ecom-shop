<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to {{ $siteName }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; }
        .wrapper { max-width: 580px; margin: 40px auto; padding: 0 16px 40px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .header { background: #0f1a18; padding: 36px 40px 32px; text-align: center; }
        .header h1 { color: #2de3a7; font-size: 22px; font-weight: 700; letter-spacing: 0.01em; }
        .header p { color: #6ee7b7; font-size: 13px; margin-top: 6px; opacity: 0.85; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.7; color: #4b5563; margin-bottom: 20px; }
        .credentials { background: #f0fdf9; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .credentials .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; margin-bottom: 4px; }
        .credentials .value { font-size: 15px; font-weight: 600; color: #111827; word-break: break-all; }
        .credentials .divider { border: none; border-top: 1px solid #d1fae5; margin: 14px 0; }
        .cta { text-align: center; margin: 28px 0 20px; }
        .btn { display: inline-block; background: #0f1a18; color: #2de3a7; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 14px; font-weight: 700; letter-spacing: 0.02em; }
        .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; line-height: 1.6; margin-top: 20px; }
        .note strong { color: #78350f; }
        .footer { text-align: center; padding: 20px 40px 0; font-size: 12px; color: #9ca3af; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>{{ $siteName }}</h1>
                <p>Your account has been created</p>
            </div>

            <div class="body">
                <p class="greeting">Hi {{ $customerName }},</p>
                <p class="text">
                    We've automatically created an account for you so you can track your order,
                    manage your address, and enjoy a faster checkout next time.
                </p>

                <div class="credentials">
                    <div class="label">Email Address</div>
                    <div class="value">{{ $customerEmail }}</div>
                    <hr class="divider" />
                    <div class="label">Temporary Password</div>
                    <div class="value">{{ $plainPassword }}</div>
                </div>

                <div class="cta">
                    <a href="{{ $loginUrl }}" class="btn">Login to Your Account</a>
                </div>

                <div class="note">
                    <strong>Important:</strong> Please change your password after your first login
                    by visiting <em>Account → Settings</em>. Keep this email somewhere safe until you do.
                </div>
            </div>
        </div>

        <div class="footer">
            <p>You received this email because you placed an order at {{ $siteName }}.</p>
            <p style="margin-top:6px;">If you didn't place this order, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
