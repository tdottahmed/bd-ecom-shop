<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title') — {{ config('app.name') }}</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #FDF9F4;
            color: #1A111A;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* Decorative blobs */
        .blob {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.18;
            pointer-events: none;
            z-index: 0;
        }
        .blob-1 {
            width: 520px; height: 520px;
            background: #E11D6D;
            top: -160px; left: -120px;
        }
        .blob-2 {
            width: 400px; height: 400px;
            background: #FF9545;
            bottom: -120px; right: -80px;
        }
        .blob-3 {
            width: 300px; height: 300px;
            background: #16B57D;
            bottom: 40px; left: 10%;
            opacity: 0.10;
        }

        /* Card */
        .card {
            position: relative;
            z-index: 1;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 24px 80px rgba(225, 29, 109, 0.10), 0 4px 24px rgba(0,0,0,0.06);
            padding: 56px 48px 48px;
            max-width: 520px;
            width: calc(100% - 32px);
            text-align: center;
        }

        /* Logo */
        .logo-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
        }
        .logo-wrap img {
            height: 44px;
            width: auto;
            object-fit: contain;
        }

        /* Divider line */
        .divider {
            width: 48px;
            height: 3px;
            background: linear-gradient(90deg, #E11D6D, #FF9545);
            border-radius: 99px;
            margin: 0 auto 28px;
        }

        /* Code badge */
        .code-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #E11D6D;
            background: #FFEBF2;
            border: 1px solid #F87BB4;
            border-radius: 99px;
            padding: 4px 14px;
            margin-bottom: 20px;
        }

        /* Heading */
        h1 {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 28px;
            font-weight: 700;
            color: #1A111A;
            line-height: 1.25;
            margin-bottom: 14px;
        }

        /* Body text */
        p {
            font-size: 15px;
            line-height: 1.7;
            color: #6b5f6b;
            margin-bottom: 32px;
        }

        /* Buttons */
        .btn-row {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            padding: 11px 24px;
            transition: all 0.18s ease;
            cursor: pointer;
        }
        .btn-primary {
            background: linear-gradient(135deg, #E11D6D 0%, #c4155c 100%);
            color: #ffffff;
            box-shadow: 0 4px 16px rgba(225, 29, 109, 0.30);
        }
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(225, 29, 109, 0.38);
        }
        .btn-ghost {
            background: transparent;
            color: #1A111A;
            border: 1.5px solid #e5d9e5;
        }
        .btn-ghost:hover {
            border-color: #E11D6D;
            color: #E11D6D;
        }

        /* Footer note */
        .footer-note {
            margin-top: 36px;
            font-size: 12px;
            color: #b0a2b0;
        }

        @media (max-width: 480px) {
            .card { padding: 40px 24px 36px; }
            h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="card">
        <div class="logo-wrap">
            <img src="/images/logo.png" alt="{{ config('app.name') }}" />
        </div>

        <div class="divider"></div>

        <div class="code-badge">@yield('code')</div>

        <h1>@yield('heading')</h1>

        <p>@yield('message')</p>

        <div class="btn-row">
            @yield('actions')
        </div>

        <div class="footer-note">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
