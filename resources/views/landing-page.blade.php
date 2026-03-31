<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $page->page_title }}</title>
    @if($page->meta_description)
    <meta name="description" content="{{ $page->meta_description }}" />
    @endif
    <meta property="og:title" content="{{ $page->page_title }}" />
    @if($page->meta_description)
    <meta property="og:description" content="{{ $page->meta_description }}" />
    @endif
    @if($page->hero_image)
    <meta property="og:image" content="{{ Storage::url($page->hero_image) }}" />
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <style>
        /* ── Reset & base ── */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --accent: {{ $page->accent_color }};
            --accent-dim: {{ $page->accent_color }}33;
            --bg: #060F0B;
            --surface: #0C1A14;
            --surface2: #112018;
            --border: #1A2E22;
            --text: #F0F5F2;
            --muted: #7A9488;
            --radius: 16px;
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            overflow-x: hidden;
            line-height: 1.6;
        }

        img { display: block; max-width: 100%; }
        a { color: inherit; text-decoration: none; }

        /* ── Typography ── */
        .serif { font-family: 'Playfair Display', serif; }
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.75rem, 3.5vw, 2.5rem);
            font-weight: 700;
            color: var(--text);
            line-height: 1.2;
        }

        /* ── Layout helpers ── */
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        section { padding: 90px 0; }

        /* ── Sticky nav ── */
        #sticky-nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            background: rgba(6, 15, 11, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            padding: 12px 24px;
            display: flex; align-items: center; justify-content: space-between;
            transform: translateY(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #sticky-nav.visible { transform: translateY(0); }
        #sticky-nav .nav-title { font-weight: 600; font-size: 0.9rem; }
        .cta-btn {
            display: inline-flex; align-items: center; gap: 8px;
            background: var(--accent); color: #000;
            font-weight: 700; font-size: 0.875rem;
            padding: 10px 22px; border-radius: 100px;
            border: none; cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
        }
        .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px var(--accent-dim);
        }
        .cta-btn-outline {
            background: transparent;
            color: var(--accent);
            border: 2px solid var(--accent);
        }
        .cta-btn-outline:hover { background: var(--accent-dim); }

        /* ── Hero ── */
        #hero {
            min-height: 100vh; padding: 0;
            display: flex; align-items: center;
            position: relative; overflow: hidden;
            background: radial-gradient(ellipse 80% 60% at 50% -10%, {{ $page->accent_color }}18 0%, transparent 70%),
                        radial-gradient(ellipse 60% 80% at 90% 50%, {{ $page->accent_color }}0a 0%, transparent 60%),
                        var(--bg);
        }

        /* animated grid lines */
        #hero::before {
            content: '';
            position: absolute; inset: 0;
            background-image: linear-gradient(var(--border) 1px, transparent 1px),
                              linear-gradient(90deg, var(--border) 1px, transparent 1px);
            background-size: 60px 60px;
            opacity: 0.35;
        }

        /* glowing orb */
        #hero::after {
            content: '';
            position: absolute; width: 600px; height: 600px;
            background: radial-gradient(circle, {{ $page->accent_color }}20 0%, transparent 70%);
            border-radius: 50%; top: -100px; right: -100px;
            animation: pulse-orb 6s ease-in-out infinite;
        }

        @keyframes pulse-orb {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 1; }
        }

        .hero-inner {
            position: relative; z-index: 2;
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 60px; align-items: center;
            padding: 120px 0 80px;
        }

        @media (max-width: 768px) {
            .hero-inner {
                grid-template-columns: 1fr;
                padding: 100px 0 60px;
                text-align: center;
            }
            .hero-image-col { order: -1; }
        }

        .hero-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: var(--accent-dim); color: var(--accent);
            border: 1px solid {{ $page->accent_color }}40;
            font-size: 0.8rem; font-weight: 600;
            padding: 5px 14px; border-radius: 100px;
            margin-bottom: 20px;
            animation: fadeInDown 0.6s both;
        }

        .hero-headline {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.4rem, 5.5vw, 4.2rem);
            font-weight: 900; line-height: 1.08;
            letter-spacing: -0.02em;
            margin-bottom: 20px;
            animation: fadeInUp 0.7s 0.1s both;
        }

        .hero-headline .accent-word { color: var(--accent); }

        .hero-sub {
            font-size: clamp(1rem, 1.5vw, 1.15rem);
            color: var(--muted); line-height: 1.7;
            margin-bottom: 36px;
            animation: fadeInUp 0.7s 0.2s both;
        }

        .hero-actions {
            display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
            animation: fadeInUp 0.7s 0.3s both;
        }

        @media (max-width: 768px) {
            .hero-actions { justify-content: center; }
        }

        .cta-btn-lg {
            padding: 14px 32px; font-size: 1rem;
            border-radius: 100px;
            animation: shimmer-glow 3s ease-in-out infinite;
        }

        @keyframes shimmer-glow {
            0%, 100% { box-shadow: 0 0 20px var(--accent-dim); }
            50% { box-shadow: 0 0 40px {{ $page->accent_color }}55; }
        }

        .hero-image-col { position: relative; }

        .hero-img-wrap {
            position: relative;
            animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
        }

        .hero-img-wrap img {
            width: 100%; max-height: 520px; object-fit: contain;
            filter: drop-shadow(0 40px 80px {{ $page->accent_color }}30);
            border-radius: 20px;
        }

        /* glow ring behind image */
        .hero-img-glow {
            position: absolute; inset: -30px;
            background: radial-gradient(circle, {{ $page->accent_color }}18 0%, transparent 65%);
            border-radius: 50%;
            animation: pulse-orb 4s ease-in-out infinite;
        }

        /* ── Scroll reveal ── */
        [data-reveal] {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal="left"]  { transform: translateX(-50px); }
        [data-reveal="right"] { transform: translateX(50px); }
        [data-reveal="scale"] { transform: scale(0.9); opacity: 0; }
        [data-reveal].visible { opacity: 1; transform: none; }

        [data-delay="1"] { transition-delay: 0.08s; }
        [data-delay="2"] { transition-delay: 0.16s; }
        [data-delay="3"] { transition-delay: 0.24s; }
        [data-delay="4"] { transition-delay: 0.32s; }
        [data-delay="5"] { transition-delay: 0.40s; }
        [data-delay="6"] { transition-delay: 0.48s; }

        /* ── Section divider ── */
        .section-label {
            display: inline-block;
            font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
            color: var(--accent); margin-bottom: 12px;
        }
        .section-head { margin-bottom: 52px; }

        /* ── Description ── */
        .prose-content {
            font-size: 1.05rem; color: var(--muted); line-height: 1.85;
            max-width: 720px; margin: 0 auto;
        }
        .prose-content h1, .prose-content h2, .prose-content h3 {
            font-family: 'Playfair Display', serif; color: var(--text); margin: 1.5em 0 0.5em;
        }
        .prose-content p { margin-bottom: 1em; }
        .prose-content ul, .prose-content ol { padding-left: 1.5em; margin-bottom: 1em; }
        .prose-content li { margin-bottom: 0.4em; }
        .prose-content a { color: var(--accent); }
        .prose-content strong { color: var(--text); }

        /* ── Features ── */
        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

        .feature-card {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: var(--radius); padding: 28px 24px;
            transition: border-color 0.3s, transform 0.3s;
        }
        .feature-card:hover { border-color: {{ $page->accent_color }}50; transform: translateY(-4px); }

        .feature-emoji { font-size: 2rem; margin-bottom: 14px; display: block; }
        .feature-title { font-size: 1rem; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .feature-desc  { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

        /* ── Gallery ── */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 12px;
        }
        .gallery-item {
            position: relative; overflow: hidden;
            border-radius: 12px; background: var(--surface);
            aspect-ratio: 4/3; cursor: pointer;
        }
        .gallery-item img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .gallery-item:hover img { transform: scale(1.06); }
        .gallery-item-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
            opacity: 0; transition: opacity 0.3s;
            display: flex; align-items: center; justify-content: center;
        }
        .gallery-item:hover .gallery-item-overlay { opacity: 1; }
        .gallery-item-overlay svg { color: #fff; opacity: 0.9; }

        /* Lightbox */
        #lightbox {
            display: none; position: fixed; inset: 0; z-index: 999;
            background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
            align-items: center; justify-content: center;
        }
        #lightbox.open { display: flex; }
        #lightbox img { max-width: 90vw; max-height: 88vh; object-fit: contain; border-radius: 12px; }
        #lightbox-close {
            position: absolute; top: 20px; right: 20px;
            width: 40px; height: 40px; border-radius: 50%;
            background: rgba(255,255,255,0.1); border: none; cursor: pointer;
            color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s;
        }
        #lightbox-close:hover { background: rgba(255,255,255,0.2); }

        /* ── Video ── */
        .video-wrap {
            position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
            border-radius: var(--radius); border: 1px solid var(--border);
            background: var(--surface); max-width: 820px; margin: 0 auto;
        }
        .video-wrap iframe {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            border: none; border-radius: var(--radius);
        }
        .video-caption { text-align: center; color: var(--muted); font-size: 0.875rem; margin-top: 16px; }

        /* ── Reviews ── */
        .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

        .review-card {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: var(--radius); padding: 28px 24px;
            position: relative; overflow: hidden;
        }
        .review-card::before {
            content: '"';
            position: absolute; top: -10px; right: 20px;
            font-family: 'Playfair Display', serif;
            font-size: 8rem; line-height: 1; color: var(--accent);
            opacity: 0.07; pointer-events: none;
        }

        .review-stars { display: flex; gap: 3px; margin-bottom: 14px; }
        .review-stars span { font-size: 1rem; color: #f59e0b; }
        .review-stars span.empty { color: #374151; }
        .review-text { font-size: 0.95rem; color: var(--muted); line-height: 1.75; margin-bottom: 20px; }
        .review-meta { display: flex; align-items: center; gap: 10px; }
        .review-avatar {
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--accent-dim); border: 2px solid {{ $page->accent_color }}40;
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 0.8rem; color: var(--accent);
        }
        .review-name { font-weight: 600; font-size: 0.9rem; }
        .review-location { font-size: 0.8rem; color: var(--muted); }

        /* ── Specs ── */
        .specs-table { width: 100%; border-collapse: collapse; max-width: 700px; margin: 0 auto; }
        .specs-table tr { border-bottom: 1px solid var(--border); }
        .specs-table tr:last-child { border-bottom: none; }
        .specs-table tr:nth-child(even) td { background: var(--surface2); }
        .specs-table td { padding: 14px 20px; font-size: 0.95rem; }
        .specs-table td:first-child { color: var(--muted); font-weight: 500; width: 40%; }
        .specs-table td:last-child  { color: var(--text); font-weight: 600; }

        /* ── FAQ ── */
        .faq-list { max-width: 720px; margin: 0 auto; space-y: 8px; }
        .faq-item { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
        .faq-q {
            width: 100%; display: flex; align-items: center; justify-content: space-between;
            padding: 18px 24px; background: var(--surface);
            font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none;
            color: var(--text); text-align: left; transition: background 0.2s;
        }
        .faq-q:hover { background: var(--surface2); }
        .faq-q svg { flex-shrink: 0; transition: transform 0.35s; color: var(--accent); }
        .faq-item.open .faq-q svg { transform: rotate(180deg); }
        .faq-a {
            max-height: 0; overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s;
            font-size: 0.93rem; color: var(--muted); line-height: 1.75;
        }
        .faq-a-inner { padding: 0 24px; }
        .faq-item.open .faq-a { max-height: 400px; }
        .faq-item.open .faq-a-inner { padding: 16px 24px 20px; }

        /* ── CTA section ── */
        .cta-section {
            background: linear-gradient(135deg, {{ $page->accent_color }}18 0%, transparent 60%),
                        linear-gradient(225deg, {{ $page->accent_color }}0e 0%, transparent 60%),
                        var(--surface);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            text-align: center; padding: 100px 0;
        }
        .cta-headline {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 4vw, 3.2rem);
            font-weight: 900; margin-bottom: 16px;
        }
        .cta-subtext { color: var(--muted); font-size: 1.05rem; margin-bottom: 36px; }

        /* ── Sticky bottom bar (mobile) ── */
        #mobile-bar {
            display: none;
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
            background: rgba(6, 15, 11, 0.95); backdrop-filter: blur(12px);
            border-top: 1px solid var(--border);
            padding: 12px 20px;
            align-items: center; justify-content: space-between; gap: 12px;
        }
        #mobile-bar .product-title { font-weight: 600; font-size: 0.875rem; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        @media (max-width: 640px) { #mobile-bar { display: flex; } body { padding-bottom: 72px; } }

        /* ── Keyframes ── */
        @keyframes fadeInUp   { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: none; } }

        /* ── alt section bg ── */
        .section-alt { background: var(--surface); }

        /* ── Checkout section ── */
        #checkout {
            background: linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%);
            border-top: 1px solid var(--border);
            padding: 90px 0 100px;
        }
        .checkout-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: start;
        }
        @media (max-width: 860px) {
            .checkout-grid { grid-template-columns: 1fr; }
        }

        /* Product summary panel */
        .checkout-product-panel {
            position: sticky; top: 80px;
        }
        .product-name-lg {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.5rem, 2.5vw, 2rem);
            font-weight: 700; line-height: 1.3;
            margin-bottom: 8px;
        }
        .price-display {
            display: flex; align-items: baseline; gap: 10px;
            margin-bottom: 24px;
        }
        .price-main {
            font-size: 2rem; font-weight: 800;
            color: var(--accent); font-family: 'Playfair Display', serif;
        }
        .price-original {
            font-size: 1rem; color: var(--muted);
            text-decoration: line-through;
        }

        /* Variation selector */
        .variation-group { margin-bottom: 20px; }
        .variation-group-label {
            font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px;
            display: block;
        }
        .variation-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .variation-pill {
            padding: 7px 16px; border-radius: 100px;
            border: 1.5px solid var(--border); background: var(--surface2);
            color: var(--muted); font-size: 0.875rem; font-weight: 500;
            cursor: pointer; transition: all 0.2s;
        }
        .variation-pill:hover { border-color: var(--accent); color: var(--text); }
        .variation-pill.selected {
            border-color: var(--accent); background: var(--accent-dim);
            color: var(--accent); font-weight: 600;
        }
        .variation-pill.out-of-stock {
            opacity: 0.35; cursor: not-allowed;
            text-decoration: line-through;
        }

        /* Qty picker */
        .qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .qty-label { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
        .qty-picker { display: flex; align-items: center; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
        .qty-btn {
            width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
            background: var(--surface2); border: none; color: var(--text);
            font-size: 1.1rem; cursor: pointer; transition: background 0.2s;
        }
        .qty-btn:hover { background: var(--border); }
        .qty-input {
            width: 52px; height: 38px; text-align: center; border: none;
            background: transparent; color: var(--text); font-size: 1rem;
            font-weight: 600; outline: none;
            -moz-appearance: textfield;
        }
        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        /* Order summary box */
        .order-summary-box {
            background: var(--surface2); border: 1px solid var(--border);
            border-radius: var(--radius); padding: 20px;
            margin-top: 4px;
        }
        .summary-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 0; font-size: 0.9rem; color: var(--muted);
            border-bottom: 1px solid var(--border);
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-row.total {
            padding-top: 14px; margin-top: 4px;
            font-size: 1.1rem; font-weight: 700; color: var(--text);
        }
        .summary-row.total .summary-val { color: var(--accent); font-size: 1.25rem; }

        /* Checkout form */
        .checkout-form-panel {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 20px; padding: 32px;
        }
        .form-title {
            font-size: 1rem; font-weight: 700; margin-bottom: 24px;
            color: var(--text); padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
        }
        .form-group { margin-bottom: 16px; }
        .form-label {
            display: block; font-size: 0.78rem; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.08em;
            color: var(--muted); margin-bottom: 6px;
        }
        .form-input {
            width: 100%; padding: 11px 14px;
            background: var(--surface2); border: 1.5px solid var(--border);
            border-radius: 10px; color: var(--text); font-size: 0.9rem;
            font-family: inherit; outline: none;
            transition: border-color 0.2s;
        }
        .form-input:focus { border-color: var(--accent); }
        .form-input.error { border-color: #f87171; }
        .form-input::placeholder { color: var(--muted); opacity: 0.6; }
        select.form-input { cursor: pointer; }
        textarea.form-input { resize: none; }
        .form-error { font-size: 0.78rem; color: #f87171; margin-top: 4px; display: none; }
        .form-error.visible { display: block; }

        /* Submit button */
        .submit-btn {
            width: 100%; padding: 15px 24px;
            background: var(--accent); border: none;
            border-radius: 12px; color: #000;
            font-size: 1rem; font-weight: 700; font-family: inherit;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            gap: 8px; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
            margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px var(--accent-dim);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .submit-btn .spinner {
            width: 18px; height: 18px; border: 2.5px solid rgba(0,0,0,0.3);
            border-top-color: #000; border-radius: 50%;
            animation: spin 0.7s linear infinite; display: none;
        }
        .submit-btn.loading .btn-text { display: none; }
        .submit-btn.loading .spinner { display: block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success state */
        .order-success {
            display: none; text-align: center; padding: 20px 0;
        }
        .order-success.visible { display: block; }
        .success-icon-wrap {
            width: 72px; height: 72px; border-radius: 50%;
            background: var(--accent-dim); border: 2px solid var(--accent);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px; font-size: 2rem;
            animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;
        }
        .success-order-id { color: var(--accent); font-weight: 700; }
        .success-msg { color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; }
        .success-again-btn {
            background: transparent; border: 1.5px solid var(--border);
            color: var(--muted); padding: 10px 24px; border-radius: 100px;
            font-size: 0.875rem; cursor: pointer; font-family: inherit;
            transition: all 0.2s;
        }
        .success-again-btn:hover { border-color: var(--accent); color: var(--accent); }

        /* General error banner */
        .form-error-banner {
            background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3);
            border-radius: 10px; padding: 12px 16px;
            color: #f87171; font-size: 0.875rem; margin-bottom: 16px;
            display: none;
        }
        .form-error-banner.visible { display: block; }

        /* Delivery note */
        .delivery-note {
            font-size: 0.78rem; color: var(--muted);
            margin-top: 4px; display: flex; align-items: center; gap: 4px;
        }
    </style>
</head>
<body>

{{-- ── Sticky nav ── --}}
<nav id="sticky-nav">
    <span class="nav-title">{{ $page->page_title }}</span>
    <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="cta-btn">
        {{ $page->hero_cta_text }}
    </a>
</nav>

{{-- ── Hero ── --}}
<section id="hero">
    <div class="container">
        <div class="hero-inner">
            <div class="hero-content">
                @if($page->hero_badge)
                <div class="hero-badge">{{ $page->hero_badge }}</div>
                @endif

                <h1 class="hero-headline serif">{{ $page->hero_headline }}</h1>

                @if($page->hero_subheadline)
                <p class="hero-sub">{{ $page->hero_subheadline }}</p>
                @endif

                <div class="hero-actions">
                    <a href="{{ $page->hero_cta_url ?: '#checkout' }}"
                       class="cta-btn cta-btn-lg" id="order">
                        {{ $page->hero_cta_text }}
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    @if(!empty($page->sections))
                    <a href="#content-start" class="cta-btn cta-btn-outline">Learn More</a>
                    @endif
                </div>
            </div>

            <div class="hero-image-col">
                @if($page->hero_image)
                <div class="hero-img-wrap">
                    <div class="hero-img-glow"></div>
                    <img src="{{ Storage::url($page->hero_image) }}" alt="{{ $page->page_title }}" />
                </div>
                @endif
            </div>
        </div>
    </div>
</section>

{{-- ── Dynamic content sections ── --}}
<div id="content-start"></div>

@if($page->sections)
@foreach($page->sections as $i => $section)

{{-- DESCRIPTION --}}
@if($section['type'] === 'description')
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container" style="text-align:center;">
        <div class="section-head" data-reveal>
            <span class="section-label">Overview</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="prose-content" data-reveal>
            {!! $section['data']['content'] ?? '' !!}
        </div>
    </div>
</section>
@endif

{{-- FEATURES --}}
@if($section['type'] === 'features' && !empty($section['data']['items']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container">
        <div class="section-head" style="text-align:center;" data-reveal>
            <span class="section-label">Features</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="features-grid">
            @foreach($section['data']['items'] as $fi => $feature)
            <div class="feature-card" data-reveal data-delay="{{ min($fi + 1, 6) }}">
                @if($feature['emoji'])<span class="feature-emoji">{{ $feature['emoji'] }}</span>@endif
                <div class="feature-title">{{ $feature['title'] ?? '' }}</div>
                <div class="feature-desc">{{ $feature['description'] ?? '' }}</div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- GALLERY --}}
@if($section['type'] === 'gallery' && !empty($section['data']['images']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container">
        <div class="section-head" style="text-align:center;" data-reveal>
            <span class="section-label">Gallery</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="gallery-grid">
            @foreach($section['data']['images'] as $img)
            <div class="gallery-item" data-reveal data-delay="{{ ($loop->index % 4) + 1 }}" onclick="openLightbox('{{ $img }}')">
                <img src="{{ $img }}" alt="" loading="lazy" />
                <div class="gallery-item-overlay">
                    <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l4 4"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- VIDEO --}}
@if($section['type'] === 'video' && !empty($section['data']['url']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container">
        <div class="section-head" style="text-align:center;" data-reveal>
            <span class="section-label">Video</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div data-reveal>
            <div class="video-wrap">
                @php
                    $url = $section['data']['url'];
                    $embedUrl = $url;
                    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/', $url, $m)) {
                        $embedUrl = 'https://www.youtube.com/embed/' . $m[1] . '?rel=0&modestbranding=1';
                    } elseif (preg_match('/vimeo\.com\/(\d+)/', $url, $m)) {
                        $embedUrl = 'https://player.vimeo.com/video/' . $m[1];
                    }
                @endphp
                <iframe src="{{ $embedUrl }}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe>
            </div>
            @if(!empty($section['data']['caption']))
            <p class="video-caption">{{ $section['data']['caption'] }}</p>
            @endif
        </div>
    </div>
</section>
@endif

{{-- REVIEWS --}}
@if($section['type'] === 'reviews' && !empty($section['data']['items']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container">
        <div class="section-head" style="text-align:center;" data-reveal>
            <span class="section-label">Reviews</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="reviews-grid">
            @foreach($section['data']['items'] as $ri => $review)
            <div class="review-card" data-reveal data-delay="{{ min($ri + 1, 6) }}">
                <div class="review-stars">
                    @for($s = 1; $s <= 5; $s++)
                        <span class="{{ $s <= ($review['rating'] ?? 5) ? '' : 'empty' }}">★</span>
                    @endfor
                </div>
                <p class="review-text">{{ $review['text'] ?? '' }}</p>
                <div class="review-meta">
                    <div class="review-avatar">{{ strtoupper(substr($review['name'] ?? '?', 0, 1)) }}</div>
                    <div>
                        <div class="review-name">{{ $review['name'] ?? '' }}</div>
                        @if(!empty($review['location']))<div class="review-location">{{ $review['location'] }}</div>@endif
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- SPECS --}}
@if($section['type'] === 'specs' && !empty($section['data']['rows']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container" style="text-align:center;">
        <div class="section-head" data-reveal>
            <span class="section-label">Details</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div data-reveal>
            <table class="specs-table">
                @foreach($section['data']['rows'] as $row)
                <tr>
                    <td>{{ $row['label'] ?? '' }}</td>
                    <td>{{ $row['value'] ?? '' }}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
</section>
@endif

{{-- FAQ --}}
@if($section['type'] === 'faq' && !empty($section['data']['items']))
<section class="{{ $i % 2 === 0 ? '' : 'section-alt' }}">
    <div class="container">
        <div class="section-head" style="text-align:center;" data-reveal>
            <span class="section-label">FAQ</span>
            <h2 class="section-title">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="faq-list" data-reveal>
            @foreach($section['data']['items'] as $fi => $faq)
            <div class="faq-item">
                <button class="faq-q" onclick="toggleFaq(this)">
                    {{ $faq['question'] ?? '' }}
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div class="faq-a"><div class="faq-a-inner">{{ $faq['answer'] ?? '' }}</div></div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- CTA BLOCK --}}
@if($section['type'] === 'cta')
<section class="cta-section">
    <div class="container" data-reveal>
        <h2 class="cta-headline serif">{{ $section['data']['headline'] ?? '' }}</h2>
        @if(!empty($section['data']['subtext']))
        <p class="cta-subtext">{{ $section['data']['subtext'] }}</p>
        @endif
        @if(!empty($section['data']['button_text']))
        <a href="{{ $section['data']['button_url'] ?? '#order' }}" class="cta-btn cta-btn-lg">
            {{ $section['data']['button_text'] }}
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        @endif
    </div>
</section>
@endif

@endforeach
@endif

{{-- ── Checkout section ── --}}
@if($page->product)
@php
    $product = $page->product;
    $unitPrice = $product->discounted_sale_price ?: $product->sale_price;
    $hasDiscount = $product->discounted_sale_price && $product->discounted_sale_price < $product->sale_price;
    $variationsByAttr = $product->product_variations
        ->groupBy(fn($v) => $v->product_attribute->name ?? 'Option');
@endphp

<section id="checkout" data-reveal>
    <div class="container">
        <div style="text-align:center; margin-bottom:52px;" data-reveal>
            <span class="section-label">Place Your Order</span>
            <h2 class="section-title">{{ $product->name }}</h2>
        </div>

        <div class="checkout-grid">

            {{-- ── Left: product summary ── --}}
            <div class="checkout-product-panel" data-reveal="left">
                <div class="price-display">
                    <span class="price-main" id="display-price">৳{{ number_format($unitPrice, 0) }}</span>
                    @if($hasDiscount)
                    <span class="price-original">৳{{ number_format($product->sale_price, 0) }}</span>
                    @endif
                </div>

                {{-- Variation selectors --}}
                @foreach($variationsByAttr as $attrName => $variations)
                <div class="variation-group">
                    <span class="variation-group-label">{{ $attrName }}</span>
                    <div class="variation-pills" data-attr="{{ $attrName }}">
                        @foreach($variations as $variation)
                        <button
                            type="button"
                            class="variation-pill {{ $variation->stock !== null && $variation->stock <= 0 && !$product->is_preorder ? 'out-of-stock' : '' }}"
                            data-id="{{ $variation->id }}"
                            data-attr="{{ $attrName }}"
                            onclick="selectVariation(this)"
                            {{ $variation->stock !== null && $variation->stock <= 0 && !$product->is_preorder ? 'disabled' : '' }}
                        >
                            {{ $variation->value }}
                        </button>
                        @endforeach
                    </div>
                </div>
                @endforeach

                {{-- Qty picker --}}
                <div class="qty-row">
                    <span class="qty-label">Quantity</span>
                    <div class="qty-picker">
                        <button type="button" class="qty-btn" onclick="changeQty(-1)">−</button>
                        <input type="number" id="qty-input" class="qty-input" value="1" min="1" max="100" oninput="updateSummary()" />
                        <button type="button" class="qty-btn" onclick="changeQty(1)">+</button>
                    </div>
                </div>

                {{-- Order summary --}}
                <div class="order-summary-box">
                    <div class="summary-row">
                        <span>Price per unit</span>
                        <span id="sum-unit">৳{{ number_format($unitPrice, 0) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="sum-subtotal">৳{{ number_format($unitPrice, 0) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery charge</span>
                        <span id="sum-delivery">—</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span class="summary-val" id="sum-total">—</span>
                    </div>
                </div>
            </div>

            {{-- ── Right: customer form ── --}}
            <div data-reveal="right">
                <div class="checkout-form-panel">
                    <p class="form-title">Delivery Information</p>

                    <div id="order-form-wrap">
                        <div class="form-error-banner" id="form-error-banner"></div>

                        <div class="form-group">
                            <label class="form-label">Your Name *</label>
                            <input type="text" id="f-name" class="form-input" placeholder="Full name" autocomplete="name" />
                            <p class="form-error" id="err-name">Name is required.</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" id="f-phone" class="form-input" placeholder="01XXXXXXXXX" autocomplete="tel" />
                            <p class="form-error" id="err-phone">Valid phone number is required.</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Delivery Address *</label>
                            <textarea id="f-address" class="form-input" rows="3" placeholder="Full address including district / thana / house details"></textarea>
                            <p class="form-error" id="err-address">Address is required.</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Delivery Area *</label>
                            <select id="f-delivery" class="form-input" onchange="updateSummary()">
                                <option value="">— Select delivery area —</option>
                                @foreach($deliveryCharges as $dc)
                                <option value="{{ $dc->id }}" data-cost="{{ $dc->cost }}">
                                    {{ $dc->name }} — ৳{{ number_format($dc->cost, 0) }}
                                </option>
                                @endforeach
                            </select>
                            <p class="form-error" id="err-delivery">Please select a delivery area.</p>
                        </div>

                        <button type="button" class="submit-btn" id="submit-btn" onclick="submitOrder()">
                            <span class="btn-text">
                                Place Order
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-left:4px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                            <div class="spinner"></div>
                        </button>

                        <p style="text-align:center; color:var(--muted); font-size:0.78rem; margin-top:12px;">
                            Cash on Delivery &bull; We'll confirm your order by phone
                        </p>
                    </div>

                    {{-- Success state --}}
                    <div class="order-success" id="order-success">
                        <div class="success-icon-wrap">✅</div>
                        <h3 class="success-title">Order Placed!</h3>
                        <p class="success-msg">
                            Order <span class="success-order-id" id="success-order-id"></span> confirmed.<br>
                            We'll call <strong id="success-phone"></strong> shortly to confirm delivery.
                        </p>
                        <button class="success-again-btn" onclick="resetCheckout()">Place Another Order</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
@endif

{{-- ── Mobile sticky bar ── --}}
<div id="mobile-bar">
    <span class="product-title">{{ $page->page_title }}</span>
    <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="cta-btn" style="white-space:nowrap;padding:10px 20px;font-size:0.85rem;">
        {{ $page->hero_cta_text }}
    </a>
</div>

{{-- ── Lightbox ── --}}
<div id="lightbox" onclick="closeLightbox(event)">
    <button id="lightbox-close" onclick="closeLightbox()">✕</button>
    <img id="lightbox-img" src="" alt="" />
</div>

<script>
/* ── Config ── */
const UNIT_PRICE    = {{ $page->product ? ($page->product->discounted_sale_price ?: $page->product->sale_price) : 0 }};
const ORDER_URL     = '{{ route('landing-page.order', $page->slug) }}';
const HAS_PRODUCT   = {{ $page->product ? 'true' : 'false' }};

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── Sticky nav ── */
const nav = document.getElementById('sticky-nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
}, { passive: true });

/* ── FAQ accordion ── */
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

/* ── Lightbox ── */
function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
    if (!e || e.target !== document.getElementById('lightbox-img')) {
        document.getElementById('lightbox').classList.remove('open');
        document.body.style.overflow = '';
    }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Checkout ── */
if (HAS_PRODUCT) {
    const fmt = n => '৳' + Number(n).toLocaleString('en-BD', { maximumFractionDigits: 0 });

    /* selected variation IDs: { attrName -> variationId } */
    const selectedVariations = {};

    function selectVariation(pill) {
        if (pill.disabled || pill.classList.contains('out-of-stock')) return;
        const attr = pill.dataset.attr;
        /* deselect all pills in same attribute group */
        document.querySelectorAll(`.variation-pill[data-attr="${attr}"]`)
            .forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedVariations[attr] = parseInt(pill.dataset.id);
        updateSummary();
    }

    function changeQty(delta) {
        const input = document.getElementById('qty-input');
        const next = Math.max(1, (parseInt(input.value) || 1) + delta);
        input.value = next;
        updateSummary();
    }

    function updateSummary() {
        const qty = Math.max(1, parseInt(document.getElementById('qty-input').value) || 1);
        const deliverySelect = document.getElementById('f-delivery');
        const selectedOption = deliverySelect.options[deliverySelect.selectedIndex];
        const deliveryCost = selectedOption && selectedOption.value
            ? parseFloat(selectedOption.dataset.cost) : null;

        const subtotal = UNIT_PRICE * qty;

        document.getElementById('sum-unit').textContent     = fmt(UNIT_PRICE);
        document.getElementById('sum-subtotal').textContent = fmt(subtotal);
        document.getElementById('sum-delivery').textContent = deliveryCost !== null ? fmt(deliveryCost) : '—';
        document.getElementById('sum-total').textContent    = deliveryCost !== null ? fmt(subtotal + deliveryCost) : '—';
        document.getElementById('display-price').textContent = fmt(UNIT_PRICE);
    }

    /* ── Form validation ── */
    function validateField(id, errId, condition) {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        const valid = condition(el.value.trim());
        el.classList.toggle('error', !valid);
        err.classList.toggle('visible', !valid);
        return valid;
    }

    function validateAll() {
        const nameOk     = validateField('f-name',     'err-name',     v => v.length > 0);
        const phoneOk    = validateField('f-phone',    'err-phone',    v => /^[0-9+]{7,15}$/.test(v));
        const addressOk  = validateField('f-address',  'err-address',  v => v.length > 5);
        const deliveryOk = validateField('f-delivery', 'err-delivery', v => v.length > 0);
        return nameOk && phoneOk && addressOk && deliveryOk;
    }

    /* ── CSRF ── */
    function getXsrf() {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    /* ── Submit ── */
    async function submitOrder() {
        if (!validateAll()) return;

        const btn = document.getElementById('submit-btn');
        const banner = document.getElementById('form-error-banner');
        banner.classList.remove('visible');
        btn.classList.add('loading');
        btn.disabled = true;

        const body = {
            customer_name:      document.getElementById('f-name').value.trim(),
            customer_phone:     document.getElementById('f-phone').value.trim(),
            customer_address:   document.getElementById('f-address').value.trim(),
            delivery_charge_id: document.getElementById('f-delivery').value,
            quantity:           parseInt(document.getElementById('qty-input').value) || 1,
            variation_ids:      Object.values(selectedVariations),
        };

        try {
            const res = await fetch(ORDER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-XSRF-TOKEN': getXsrf(),
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (data.success) {
                document.getElementById('order-form-wrap').style.display = 'none';
                const successEl = document.getElementById('order-success');
                successEl.classList.add('visible');
                document.getElementById('success-order-id').textContent = '#' + data.order_id;
                document.getElementById('success-phone').textContent = body.customer_phone;
                /* scroll to success */
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                banner.textContent = data.message || 'Something went wrong. Please try again.';
                banner.classList.add('visible');
            }
        } catch (e) {
            banner.textContent = 'Network error. Please check your connection and try again.';
            banner.classList.add('visible');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    function resetCheckout() {
        document.getElementById('order-form-wrap').style.display = '';
        document.getElementById('order-success').classList.remove('visible');
        document.getElementById('f-name').value    = '';
        document.getElementById('f-phone').value   = '';
        document.getElementById('f-address').value = '';
        document.getElementById('f-delivery').value = '';
        document.getElementById('qty-input').value  = '1';
        updateSummary();
        document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    }

    /* init */
    updateSummary();
}
</script>
</body>
</html>
