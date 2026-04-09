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
            filter: blur(90px);
            opacity: 0.16;
            pointer-events: none;
            z-index: 0;
            animation: blobPulse 8s ease-in-out infinite alternate;
        }
        .blob-1 { width: 560px; height: 560px; background: #E11D6D; top: -180px; left: -130px; animation-delay: 0s; }
        .blob-2 { width: 420px; height: 420px; background: #FF9545; bottom: -130px; right: -90px; animation-delay: 3s; }
        .blob-3 { width: 300px; height: 300px; background: #16B57D; bottom: 60px; left: 8%; opacity: 0.09; animation-delay: 6s; }

        @keyframes blobPulse {
            from { transform: scale(1); opacity: 0.14; }
            to   { transform: scale(1.12); opacity: 0.20; }
        }

        /* Floating particles */
        .particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .particle {
            position: absolute;
            border-radius: 50%;
            background: #E11D6D;
            opacity: 0;
            animation: floatUp linear infinite;
        }
        @keyframes floatUp {
            0%   { transform: translateY(0) scale(1); opacity: 0; }
            10%  { opacity: 0.35; }
            90%  { opacity: 0.10; }
            100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }

        /* Card */
        .card {
            position: relative;
            z-index: 1;
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 28px;
            box-shadow: 0 32px 80px rgba(225,29,109,0.12), 0 4px 24px rgba(0,0,0,0.06);
            border: 1px solid rgba(225,29,109,0.08);
            padding: 48px 48px 44px;
            max-width: 520px;
            width: calc(100% - 32px);
            text-align: center;
            animation: cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardIn {
            from { opacity: 0; transform: translateY(28px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Logo */
        .logo-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 28px;
        }
        .logo-wrap img { height: 38px; width: auto; object-fit: contain; }

        /* Animated icon area */
        .icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
        }

        /* Divider */
        .divider {
            width: 44px;
            height: 3px;
            background: linear-gradient(90deg, #E11D6D, #FF9545);
            border-radius: 99px;
            margin: 0 auto 22px;
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
            margin-bottom: 16px;
        }

        h1 {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 26px;
            font-weight: 700;
            color: #1A111A;
            line-height: 1.25;
            margin-bottom: 12px;
        }

        p {
            font-size: 14.5px;
            line-height: 1.75;
            color: #7a6a7a;
            margin-bottom: 28px;
        }

        /* Buttons */
        .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 22px;
            transition: all 0.18s ease;
            cursor: pointer;
        }
        .btn-primary {
            background: linear-gradient(135deg, #E11D6D 0%, #c4155c 100%);
            color: #fff;
            box-shadow: 0 4px 16px rgba(225,29,109,0.30);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(225,29,109,0.38); }
        .btn-ghost { background: transparent; color: #1A111A; border: 1.5px solid #e5d9e5; }
        .btn-ghost:hover { border-color: #E11D6D; color: #E11D6D; }

        .footer-note { margin-top: 32px; font-size: 11.5px; color: #c0b0c0; }

        @media (max-width: 480px) {
            .card { padding: 36px 20px 32px; }
            h1 { font-size: 21px; }
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <!-- Floating particles -->
    <div class="particles">
        <div class="particle" style="width:6px;height:6px;left:15%;animation-duration:12s;animation-delay:0s;"></div>
        <div class="particle" style="width:4px;height:4px;left:30%;animation-duration:9s;animation-delay:2s;background:#FF9545;"></div>
        <div class="particle" style="width:5px;height:5px;left:55%;animation-duration:14s;animation-delay:4s;"></div>
        <div class="particle" style="width:3px;height:3px;left:70%;animation-duration:10s;animation-delay:1s;background:#16B57D;"></div>
        <div class="particle" style="width:6px;height:6px;left:85%;animation-duration:11s;animation-delay:3s;"></div>
        <div class="particle" style="width:4px;height:4px;left:45%;animation-duration:13s;animation-delay:5s;background:#FF9545;"></div>
    </div>

    <div class="card">
        <div class="logo-wrap">
            <img src="/images/logo.png" alt="{{ config('app.name') }}" />
        </div>

        <div class="icon-wrap">
            @yield('icon')
        </div>

        <div class="divider"></div>
        <div class="code-badge">@yield('code')</div>
        <h1>@yield('heading')</h1>
        <p>@yield('message')</p>

        <div class="btn-row">@yield('actions')</div>

        <div class="footer-note">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</div>
    </div>
</body>
</html>
