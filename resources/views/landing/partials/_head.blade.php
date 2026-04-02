<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ $page->page_title }}</title>
@if($page->meta_description)
<meta name="description" content="{{ $page->meta_description }}" />
@endif
<meta property="og:title" content="{{ $page->page_title }}" />
@if($page->meta_description)<meta property="og:description" content="{{ $page->meta_description }}" />@endif
@if($page->hero_image)<meta property="og:image" content="{{ Storage::url($page->hero_image) }}" />@endif

@if(get_setting('site_favicon'))
<link rel="icon" href="{{ Storage::url(get_setting('site_favicon')) }}" />
@endif

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

{{-- GSAP --}}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>

<style>
/* ═══════════════════════════════════════════
   1 · TOKENS
═══════════════════════════════════════════ */
:root {
    --accent:       {{ $page->accent_color }};
    --accent-10:    {{ $page->accent_color }}1a;
    --accent-20:    {{ $page->accent_color }}33;
    --accent-50:    {{ $page->accent_color }}80;

    --bg:           #FFFFFF;
    --bg-soft:      #F7F5F0;
    --bg-warm:      #FFF8F0;
    --bg-cool:      #F2F9FF;

    --card:         #FFFFFF;
    --border:       #E8E3D8;
    --border-light: #F0ECE4;

    --text:         #111827;
    --text-2:       #374151;
    --muted:        #6B7280;
    --light:        #9CA3AF;

    --shadow-xs: 0 1px 4px rgba(0,0,0,0.06);
    --shadow-sm: 0 2px 12px rgba(0,0,0,0.07);
    --shadow-md: 0 8px 30px rgba(0,0,0,0.09);
    --shadow-lg: 0 20px 60px rgba(0,0,0,0.11);
    --shadow-xl: 0 40px 100px rgba(0,0,0,0.14);

    --r-sm: 8px;
    --r:    16px;
    --r-lg: 24px;
    --r-xl: 36px;
}

/* ═══════════════════════════════════════════
   2 · RESET & BASE
═══════════════════════════════════════════ */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body.lp {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}
img { display: block; max-width: 100%; }
a   { color: inherit; text-decoration: none; }

/* ═══════════════════════════════════════════
   3 · TYPOGRAPHY
═══════════════════════════════════════════ */
.serif { font-family: 'Playfair Display', serif; }

.section-label {
    display: inline-block;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 12px;
}
.section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 3.5vw, 2.8rem);
    font-weight: 900; line-height: 1.15; color: var(--text);
}
.section-sub {
    color: var(--muted); font-size: 1.05rem; max-width: 580px;
    margin: 12px auto 0;
}

/* ═══════════════════════════════════════════
   4 · LAYOUT
═══════════════════════════════════════════ */
.lp-container { max-width: 1120px; margin: 0 auto; padding: 0 28px; }
.lp-section   { padding: 96px 0; }
.section-center { text-align: center; }

/* Section background variants */
.bg-white  { background: var(--bg); }
.bg-soft   { background: var(--bg-soft); }
.bg-warm   { background: var(--bg-warm); }
.bg-cool   { background: var(--bg-cool); }

/* ═══════════════════════════════════════════
   5 · BUTTONS
═══════════════════════════════════════════ */
.btn-accent {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #fff;
    font-weight: 700; font-size: 0.95rem;
    padding: 14px 32px; border-radius: 100px;
    border: none; cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    font-family: inherit;
}
.btn-accent:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px var(--accent-50);
}
.btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: rgba(255,255,255,0.85);
    font-weight: 600; font-size: 0.95rem;
    padding: 13px 30px; border-radius: 100px;
    border: 2px solid rgba(255,255,255,0.45);
    cursor: pointer; transition: all 0.25s;
    font-family: inherit;
}
.btn-ghost:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.7);
    color: #fff;
}

/* ═══════════════════════════════════════════
   6 · NAVIGATION
═══════════════════════════════════════════ */
#lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    padding: 20px 28px;
    display: flex; align-items: center; justify-content: space-between;
    transition: padding 0.4s, background 0.4s, box-shadow 0.4s;
}
#lp-nav.nav-scrolled {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 1px 24px rgba(0,0,0,0.08);
    padding: 12px 28px;
}
.nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem; font-weight: 700;
    color: #fff; transition: color 0.4s;
}
#lp-nav.nav-scrolled .nav-logo { color: var(--text); }
.nav-cta {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--accent); color: #fff;
    font-weight: 700; font-size: 0.82rem;
    padding: 9px 22px; border-radius: 100px;
    transition: transform 0.2s, box-shadow 0.2s;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-50); }

/* ═══════════════════════════════════════════
   7 · HERO (image as full-screen background)
═══════════════════════════════════════════ */
#hero {
    position: relative; min-height: 80svh; /* Reduced from 100svh */
    background: #1a1a2e no-repeat center / cover;
    display: flex; align-items: center;  /* Changed from flex-end to float text in the middle/upper area */
    overflow: hidden;
}
.hero-parallax-img {
    position: absolute; inset: -10%;
    background: inherit;
    background-size: cover; background-position: center;
    will-change: transform;
}
.hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.45) 0%,
        rgba(0, 0, 0, 0.65) 60%,
        rgba(0, 0, 0, 0.85) 100%
    );
}
.hero-body {
    position: relative; z-index: 2;
    width: 100%; padding: 80px 0 60px; /* Adjusted padding to center text correctly above the wave */
    text-align: center;
}
.hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff; font-size: 0.8rem; font-weight: 600;
    padding: 6px 16px; border-radius: 100px;
    margin-bottom: 24px;
    opacity: 0; /* GSAP will animate */
}
.hero-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 5.8rem);
    font-weight: 900; line-height: 1.07; letter-spacing: -0.02em;
    color: #fff; margin-bottom: 20px;
    overflow: hidden;
}
/* chars inside headline — GSAP wraps them */
.hero-headline .ch { display: inline-block; }

.hero-sub {
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    color: rgba(255,255,255,0.78); max-width: 580px;
    line-height: 1.7; margin-bottom: 36px;
    opacity: 0;
    margin-left: auto; margin-right: auto;
}
.hero-actions {
    display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap;
    opacity: 0;
}
@media (max-width: 640px) { .hero-actions { flex-direction: column; align-items: flex-start; } }

/* Scroll indicator */
.hero-scroll {
    position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
    z-index: 4; display: flex; flex-direction: column; align-items: center;
    gap: 6px; color: rgba(255,255,255,0.7); font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    animation: bounce-scroll 2s ease-in-out infinite;
    opacity: 0;
}
.scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
}
@keyframes bounce-scroll { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }

/* Hero Shape Divider */
.hero-shape-divider {
    position: absolute;
    bottom: -1px; /* Prevents fractional pixel gaps */
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    z-index: 3;
}
.hero-shape-divider svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 70px;
}
@media (min-width: 1024px) {
    .hero-shape-divider svg { height: 110px; }
}
.hero-shape-divider .shape-fill {
    fill: var(--bg); /* Default white */
    transition: fill 0.3s;
}

/* Dynamically color wrap the wave to match next section's background seamlessly */
#hero:has(+ main#lp-content > section.bg-soft:first-child) .shape-fill {
    fill: var(--bg-soft);
}
#hero:has(+ main#lp-content > section.bg-cool:first-child) .shape-fill {
    fill: var(--bg-cool);
}
#hero:has(+ main#lp-content > section.bg-warm:first-child) .shape-fill {
    fill: var(--bg-warm);
}

/* Hero Mobile Enhancements */
@media (max-width: 768px) {
    #hero { min-height: 65svh; }
    .hero-body { padding: 90px 0 50px; text-align: center; }
    .hero-badge { margin: 0 auto 16px; font-size: 0.75rem; padding: 5px 14px; }
    .hero-actions { justify-content: center; flex-direction: column; width: 100%; gap: 10px; }
    .hero-actions a { width: 100%; justify-content: center; padding: 14px 24px; font-size: 0.95rem; }
    .hero-headline { font-size: clamp(2.2rem, 10vw, 2.8rem); margin-bottom: 12px; }
    .hero-sub { margin-left: auto; margin-right: auto; font-size: 0.95rem; margin-bottom: 24px; }
    .hero-scroll { display: none; }
    .hero-shape-divider svg { height: 45px; } /* Sleeker wave for small screens */
}

/* ═══════════════════════════════════════════
   8 · SECTION: DESCRIPTION
═══════════════════════════════════════════ */
.prose {
    max-width: 740px; margin: 0 auto;
    font-size: 1.05rem; color: var(--text-2); line-height: 1.85;
}
.prose h1,.prose h2,.prose h3 { font-family:'Playfair Display',serif; color:var(--text); margin:1.5em 0 0.5em; }
.prose p   { margin-bottom: 1em; }
.prose ul,.prose ol { padding-left: 1.5em; margin-bottom: 1em; }
.prose li  { margin-bottom: 0.4em; }
.prose a   { color: var(--accent); text-decoration: underline; }
.prose strong { color: var(--text); font-weight: 700; }

/* ═══════════════════════════════════════════
   9 · SECTION: FEATURES
═══════════════════════════════════════════ */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 22px; margin-top: 48px;
}
.feature-card {
    background: var(--card);
    border: 1px solid var(--border-light);
    border-radius: var(--r-lg);
    padding: 32px 28px;
    box-shadow: var(--shadow-sm);
    position: relative; overflow: hidden;
    transition: transform 0.35s, box-shadow 0.35s, border-color 0.35s;
}
.feature-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent); opacity: 0;
    transition: opacity 0.3s;
}
.feature-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: transparent; }
.feature-card:hover::before { opacity: 1; }
.feature-icon-wrap {
    width: 52px; height: 52px; border-radius: var(--r-sm);
    background: var(--accent-10);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; margin-bottom: 18px;
}
.feature-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }
.feature-desc  { font-size: 0.9rem; color: var(--muted); line-height: 1.65; }

/* ═══════════════════════════════════════════
   10 · SECTION: GALLERY
═══════════════════════════════════════════ */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 260px;
    gap: 14px; margin-top: 48px;
}
.gallery-grid .gallery-item:first-child {
    grid-column: span 2;
    grid-row: span 2;
}
@media (max-width: 768px) {
    .gallery-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 180px; }
    .gallery-grid .gallery-item:first-child { grid-column: span 1; grid-row: span 1; }
}
.gallery-item {
    border-radius: var(--r); overflow: hidden;
    cursor: pointer; position: relative;
    background: var(--bg-soft);
    box-shadow: var(--shadow-sm);
}
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(.16,1,.3,1); }
.gallery-item:hover img { transform: scale(1.06); }
.gallery-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: flex-end; padding: 16px;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-zoom-icon { color: #fff; }

/* ═══════════════════════════════════════════
   11 · SECTION: VIDEO
═══════════════════════════════════════════ */
.video-outer { max-width: 860px; margin: 0 auto; }
.video-embed {
    position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-xl);
    background: #000;
    margin-top: 48px;
}
.video-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; border-radius: var(--r-lg); }
.video-caption { text-align: center; color: var(--muted); font-size: 0.875rem; margin-top: 14px; }

/* ═══════════════════════════════════════════
   12 · SECTION: REVIEWS
═══════════════════════════════════════════ */
.reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 22px; margin-top: 48px;
}
.review-card {
    background: var(--card);
    border: 1px solid var(--border-light);
    border-radius: var(--r-lg);
    padding: 32px 28px;
    box-shadow: var(--shadow-sm);
    position: relative; overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}
.review-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.review-quote {
    position: absolute; top: -12px; right: 20px;
    font-family: 'Playfair Display', serif;
    font-size: 6rem; line-height: 1;
    color: var(--accent); opacity: 0.12; pointer-events: none;
}
.review-stars { display: flex; gap: 3px; margin-bottom: 16px; }
.review-stars span { font-size: 1rem; }
.star-full  { color: #FBBF24; }
.star-empty { color: #E5E7EB; }
.review-text { font-size: 0.93rem; color: var(--text-2); line-height: 1.75; margin-bottom: 22px; }
.review-author { display: flex; align-items: center; gap: 12px; }
.review-avatar {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    background: var(--accent-20); border: 2px solid var(--accent-50);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 0.85rem; color: var(--accent);
}
.review-name     { font-weight: 700; font-size: 0.9rem; }
.review-location { font-size: 0.78rem; color: var(--muted); margin-top: 1px; }

/* ═══════════════════════════════════════════
   13 · SECTION: SPECS
═══════════════════════════════════════════ */
.specs-wrap { max-width: 720px; margin: 48px auto 0; }
.specs-table { width: 100%; border-collapse: collapse; border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-sm); }
.specs-table tr:nth-child(odd)  td { background: var(--bg-soft); }
.specs-table tr:nth-child(even) td { background: var(--card); }
.specs-table tr:last-child td { border-bottom: none; }
.specs-table td { padding: 15px 22px; font-size: 0.93rem; border-bottom: 1px solid var(--border-light); }
.specs-table td:first-child { color: var(--muted); font-weight: 600; width: 42%; }
.specs-table td:last-child  { color: var(--text);  font-weight: 700; }

/* ═══════════════════════════════════════════
   14 · SECTION: FAQ
═══════════════════════════════════════════ */
.faq-list { max-width: 740px; margin: 48px auto 0; }
.faq-item { margin-bottom: 12px; }
.faq-q {
    width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 20px 24px;
    background: var(--card); border: 1px solid var(--border-light);
    border-radius: var(--r); box-shadow: var(--shadow-xs);
    font-weight: 600; font-size: 0.95rem; color: var(--text);
    cursor: pointer; text-align: left; transition: border-color 0.25s, background 0.25s;
}
.faq-q:hover { border-color: var(--accent); }
.faq-item.open .faq-q { border-radius: var(--r) var(--r) 0 0; border-color: var(--accent); background: var(--accent-10); }
.faq-icon { flex-shrink: 0; color: var(--accent); transition: transform 0.35s cubic-bezier(.16,1,.3,1); }
.faq-item.open .faq-icon { transform: rotate(180deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(.16,1,.3,1); }
.faq-a-inner {
    padding: 0 24px; font-size: 0.93rem; color: var(--muted); line-height: 1.75;
    background: var(--card); border: 1px solid var(--accent-20); border-top: none;
    border-radius: 0 0 var(--r) var(--r);
}
.faq-item.open .faq-a { max-height: 600px; }
.faq-item.open .faq-a-inner { padding: 18px 24px 22px; }

/* ═══════════════════════════════════════════
   15 · SECTION: CTA BLOCK
═══════════════════════════════════════════ */
.cta-block {
    background: linear-gradient(135deg, #0f1923 0%, #1a2e25 50%, #0f1923 100%);
    position: relative; overflow: hidden; text-align: center; padding: 120px 0;
}
.cta-block::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 70% at 50% 0%, {{ $page->accent_color }}22 0%, transparent 70%);
}
.cta-block::after {
    content: ''; position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, {{ $page->accent_color }}18 0%, transparent 65%);
    bottom: -150px; right: -100px;
    animation: orb-pulse 6s ease-in-out infinite;
}
@keyframes orb-pulse { 0%,100% { transform: scale(1); opacity:.7; } 50% { transform: scale(1.2); opacity:1; } }
.cta-block-inner { position: relative; z-index: 1; }
.cta-block-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 900; color: #fff; line-height: 1.12; margin-bottom: 16px;
}
.cta-block-sub { color: rgba(255,255,255,0.65); font-size: 1.05rem; margin-bottom: 38px; }

/* ═══════════════════════════════════════════
   16 · CHECKOUT SECTION
═══════════════════════════════════════════ */
#checkout {
    background: linear-gradient(180deg, var(--bg-soft) 0%, var(--bg) 100%);
    border-top: 1px solid var(--border-light);
    padding: 96px 0 110px;
}
.checkout-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 52px; align-items: start;
}
@media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr; } }

/* Product panel */
.co-product-panel { position: sticky; top: 80px; }
.co-product-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 900; line-height: 1.2; margin-bottom: 10px;
}
.co-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 26px; }
.co-price-main { font-size: 2.2rem; font-weight: 800; color: var(--accent); font-family: 'Playfair Display', serif; }
.co-price-old  { font-size: 1rem; color: var(--light); text-decoration: line-through; }

/* Variation pills */
.co-attr-label {
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--muted); margin-bottom: 8px; display: block;
}
.co-attr-group { margin-bottom: 20px; }
.co-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.co-pill {
    padding: 7px 18px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--bg);
    color: var(--text-2); font-size: 0.875rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; user-select: none;
}
.co-pill:hover { border-color: var(--accent); color: var(--accent); }
.co-pill.selected { border-color: var(--accent); background: var(--accent-10); color: var(--accent); font-weight: 700; }
.co-pill.oos { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }

/* Qty */
.co-qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.co-qty-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
.co-qty { display: flex; align-items: center; border: 1.5px solid var(--border); border-radius: var(--r-sm); overflow: hidden; }
.co-qty-btn {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    background: var(--bg-soft); border: none; color: var(--text);
    font-size: 1.15rem; cursor: pointer; transition: background 0.2s;
}
.co-qty-btn:hover { background: var(--border); }
.co-qty-input {
    width: 52px; height: 40px; text-align: center; border: none;
    background: transparent; color: var(--text); font-size: 1rem; font-weight: 700;
    outline: none; -moz-appearance: textfield;
}
.co-qty-input::-webkit-outer-spin-button,
.co-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* Summary */
.co-summary {
    background: var(--card); border: 1px solid var(--border-light);
    border-radius: var(--r); padding: 20px 22px;
    box-shadow: var(--shadow-sm);
}
.co-sum-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; font-size: 0.9rem; color: var(--muted);
    border-bottom: 1px solid var(--border-light);
}
.co-sum-row:last-child { border-bottom: none; }
.co-sum-row.co-total { padding-top: 14px; margin-top: 4px; font-size: 1rem; font-weight: 800; color: var(--text); }
.co-sum-row.co-total .co-sum-val { color: var(--accent); font-size: 1.3rem; }

/* Form panel */
.co-form-panel {
    background: var(--card); border: 1px solid var(--border-light);
    border-radius: var(--r-lg); padding: 36px;
    box-shadow: var(--shadow-md);
}
.co-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: var(--text); margin-bottom: 24px;
    padding-bottom: 18px; border-bottom: 1px solid var(--border-light);
}
.co-field { margin-bottom: 18px; }
.co-label {
    display: block; font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--muted); margin-bottom: 6px;
}
.co-input {
    width: 100%; padding: 12px 16px;
    background: var(--bg-soft); border: 1.5px solid var(--border);
    border-radius: var(--r-sm); color: var(--text);
    font-size: 0.92rem; font-family: inherit; outline: none;
    transition: border-color 0.2s, background 0.2s;
}
.co-input:focus { border-color: var(--accent); background: var(--bg); }
.co-input.error { border-color: #EF4444; }
.co-input::placeholder { color: var(--light); }
textarea.co-input { resize: none; }
.co-field-error { font-size: 0.76rem; color: #EF4444; margin-top: 4px; display: none; }
.co-field-error.show { display: block; }

/* Error banner */
.co-error-banner {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: var(--r-sm); padding: 12px 16px;
    color: #DC2626; font-size: 0.875rem;
    margin-bottom: 16px; display: none;
}
.co-error-banner.show { display: block; }

/* Submit */
.co-submit-btn {
    width: 100%; padding: 16px 24px; margin-top: 10px;
    background: var(--accent); border: none; border-radius: var(--r-sm);
    color: #fff; font-size: 1rem; font-weight: 700; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; transition: transform 0.25s, box-shadow 0.25s, opacity 0.25s;
}
.co-submit-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px var(--accent-50);
}
.co-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.co-submit-btn .co-spinner {
    width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: none;
}
.co-submit-btn.loading .co-btn-text { display: none; }
.co-submit-btn.loading .co-spinner { display: block; }
@keyframes spin { to { transform: rotate(360deg); } }
.co-submit-note { text-align: center; color: var(--muted); font-size: 0.75rem; margin-top: 12px; }

/* Success */
.co-success { display: none; text-align: center; padding: 24px 0; }
.co-success.show { display: block; }
.co-success-icon {
    width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 22px;
    background: var(--accent-10); border: 2px solid var(--accent-50);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.2rem;
    animation: pop 0.5s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.co-success-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 10px; }
.co-success-id { color: var(--accent); font-weight: 800; }
.co-success-msg { color: var(--muted); font-size: 0.9rem; line-height: 1.65; margin-bottom: 26px; }
.co-again-btn {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--muted); padding: 10px 26px; border-radius: 100px;
    font-size: 0.875rem; cursor: pointer; font-family: inherit;
    transition: all 0.2s;
}
.co-again-btn:hover { border-color: var(--accent); color: var(--accent); }

/* ═══════════════════════════════════════════
   17 · MOBILE BAR
═══════════════════════════════════════════ */
#lp-mobile-bar {
    display: none; position: fixed;
    bottom: 0; left: 0; right: 0; z-index: 150;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    padding: 12px 20px;
    align-items: center; justify-content: space-between; gap: 12px;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}
#lp-mobile-bar .mb-title { font-weight: 700; font-size: 0.875rem; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 640px) { #lp-mobile-bar { display: flex; } body.lp { padding-bottom: 74px; } }

/* ═══════════════════════════════════════════
   18 · LIGHTBOX
═══════════════════════════════════════════ */
#lp-lightbox {
    display: none; position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.94); backdrop-filter: blur(8px);
    align-items: center; justify-content: center;
}
#lp-lightbox.open { display: flex; }
#lp-lightbox img { max-width: 90vw; max-height: 88vh; object-fit: contain; border-radius: var(--r); }
#lp-lb-close {
    position: absolute; top: 18px; right: 18px;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.1); border: none; cursor: pointer;
    color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
}
#lp-lb-close:hover { background: rgba(255,255,255,0.2); }

/* ═══════════════════════════════════════════
   20 · FOOTER
═══════════════════════════════════════════ */
.lp-footer {
    background: var(--bg);
    border-top: 1px solid var(--border-light);
    padding: 40px 0;
    text-align: center;
}
.lp-footer p {
    font-size: 0.85rem;
    color: var(--muted);
}
@media (max-width: 768px) {
    .lp-footer { padding: 30px 0; }
}

/* ═══════════════════════════════════════════
   21 · GSAP INITIAL STATES (hidden before animate)
═══════════════════════════════════════════ */
[data-gsap] { opacity: 0; }
</style>
</head>
