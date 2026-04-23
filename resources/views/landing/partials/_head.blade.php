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

/* ── Section layout styles ── */
.lp-layout-bordered .lp-container {
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 36px 40px;
}
.lp-layout-card .lp-container {
    background: var(--card);
    box-shadow: var(--shadow-md);
    border-radius: 20px;
    padding: 48px;
}
.lp-layout-accent-left .lp-container {
    border-left: 4px solid var(--accent);
    padding-left: 44px;
}
.lp-layout-accent-top {
    border-top: 4px solid var(--accent);
}
.lp-layout-shadow .lp-container {
    background: var(--card);
    box-shadow: var(--shadow-lg);
    border-radius: 16px;
    padding: 40px 48px;
}

/* ── Section padding size overrides ── */
.lp-pad-sm { padding-top: 56px !important; padding-bottom: 56px !important; }
.lp-pad-lg { padding-top: 128px !important; padding-bottom: 128px !important; }

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
   7 · HERO  (all layouts)
═══════════════════════════════════════════ */

/* ── CSS token for custom text colour ── */
#hero { --hero-text: #fff; }

/* ── Base ── */
#hero {
    position: relative;
    min-height: 95svh;
    background: #0f1923 no-repeat center / cover;
    display: flex; align-items: center;
    overflow: hidden;
}

/* ── Full-overlay dark gradient ── */
.hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.38) 0%,
        rgba(0,0,0,0.62) 55%,
        rgba(0,0,0,0.88) 100%
    );
}

/* ── Decorative orbs (split / centered) ── */
.hero-deco-orb {
    position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
}
.hero-deco-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, var(--accent-20) 0%, transparent 65%);
    top: -200px; right: -180px;
}
.hero-deco-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, var(--accent-10) 0%, transparent 65%);
    bottom: -120px; left: -120px;
}

/* ══════════════════════════════
   FULL-OVERLAY body
══════════════════════════════ */
.hero-body {
    position: relative; z-index: 2;
    width: 100%; padding: 80px 0 60px;
    text-align: center;
}

/* ══════════════════════════════
   SPLIT layout
══════════════════════════════ */
#hero[data-layout="split-right"],
#hero[data-layout="split-left"] {
    min-height: 90svh;
}

.hero-split-body {
    position: relative; z-index: 2;
    width: 100%; padding: 130px 0 110px;
}

.hero-split-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
}

/* Image-left variant: swap column order */
.hero-split-grid.img-left .hero-img-col  { order: -1; }
.hero-split-grid.img-left .hero-text-col { order:  1; }

/* Text column */
.hero-text-col { display: flex; flex-direction: column; }
.hero-text-col .hero-badge { align-self: flex-start; }

.hero-headline-split {
    text-align: left !important;
    font-size: clamp(2rem, 3.8vw, 3.4rem) !important;
}
.hero-sub-split {
    text-align: left;
    margin-left: 0 !important; margin-right: 0 !important;
    max-width: 460px;
}
.hero-actions-split { justify-content: flex-start !important; }

/* Image column */
.hero-img-col { position: relative; }

.hero-img-frame {
    position: relative;
    border-radius: var(--r-xl);
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06);
    transition: transform 0.7s cubic-bezier(.16,1,.3,1);
}
.hero-img-frame.tilt-right { transform: perspective(1100px) rotateY(-4deg) rotateX(1deg); }
.hero-img-frame.tilt-left  { transform: perspective(1100px) rotateY( 4deg) rotateX(1deg); }
.hero-img-frame:hover { transform: perspective(1100px) rotateY(0deg) rotateX(0deg) !important; }

.hero-split-img {
    width: 100%; display: block;
    aspect-ratio: 4/5; object-fit: cover;
}

/* Shine overlay */
.hero-img-shine {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(
        135deg,
        rgba(255,255,255,0.08) 0%,
        transparent 50%,
        rgba(0,0,0,0.1) 100%
    );
}

/* Blurred shadow blob below image */
.hero-img-shadow {
    position: absolute; bottom: -30px; left: 10%; right: 10%; height: 60px;
    background: var(--accent-50);
    filter: blur(40px); border-radius: 50%; opacity: 0.4;
    z-index: -1;
}

/* Column entrance animations */
.hero-img-col.enter-right {
    animation: hero-img-in-right 1.1s cubic-bezier(.16,1,.3,1) 0.35s both;
}
.hero-img-col.enter-left {
    animation: hero-img-in-left 1.1s cubic-bezier(.16,1,.3,1) 0.35s both;
}
@keyframes hero-img-in-right {
    from { opacity: 0; transform: translateX(56px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0)    scale(1);    }
}
@keyframes hero-img-in-left {
    from { opacity: 0; transform: translateX(-56px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0)     scale(1);    }
}

/* ══════════════════════════════
   CENTERED layout
══════════════════════════════ */
#hero[data-layout="centered"] {
    min-height: 65svh;
}

.hero-centered-body {
    position: relative; z-index: 2;
    width: 100%; padding: 130px 0 0;
    text-align: center;
}

.hero-centered-body .hero-sub     { margin: 0 auto 36px; }
.hero-centered-body .hero-actions { justify-content: center; margin-bottom: 60px; }

.hero-centered-preview {
    max-width: 920px; margin: 0 auto;
    border-radius: var(--r-xl) var(--r-xl) 0 0;
    overflow: hidden;
    box-shadow: 0 -4px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07);
    position: relative;
    animation: hero-preview-rise 1.2s cubic-bezier(.16,1,.3,1) 0.5s both;
}
@keyframes hero-preview-rise {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
}
.hero-centered-preview img {
    width: 100%; display: block;
    max-height: 500px; object-fit: cover; object-position: top;
}
.hero-centered-preview-glow {
    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.18));
    pointer-events: none;
}

/* ══════════════════════════════
   SHARED text styles
══════════════════════════════ */
.hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.11);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.22);
    color: var(--hero-text); font-size: 0.8rem; font-weight: 600;
    padding: 6px 16px; border-radius: 100px;
    margin-bottom: 22px;
    opacity: 0; /* GSAP will animate */
}

.hero-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 5.8rem);
    font-weight: 900; line-height: 1.07; letter-spacing: -0.02em;
    color: var(--hero-text); margin-bottom: 20px;
    overflow: hidden; text-align: center;
}
.hero-headline .ch { display: inline-block; }

.hero-sub {
    font-size: clamp(1rem, 1.6vw, 1.18rem);
    color: var(--hero-text); opacity: 0; /* GSAP tweens to 1, color via variable */
    max-width: 580px; line-height: 1.72; margin-bottom: 36px;
    margin-left: auto; margin-right: auto;
}
/* Keep sub legible at full opacity — use a wrapper trick via filter isn't ideal,
   so we soften sub color inline when not using a custom text colour */
#hero:not([style*="--hero-text"]) .hero-sub { color: rgba(255,255,255,0.76); }

.hero-actions {
    display: flex; align-items: center; justify-content: center;
    gap: 14px; flex-wrap: wrap;
    opacity: 0; /* GSAP */
}

/* ── Scroll indicator ── */
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
@keyframes bounce-scroll {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(6px); }
}

/* ── Shape divider ── */
.hero-shape-divider {
    position: absolute; bottom: -1px; left: 0;
    width: 100%; overflow: hidden; line-height: 0; z-index: 3;
}
.hero-shape-divider svg {
    position: relative; display: block;
    width: calc(100% + 1.3px); height: 70px;
}
@media (min-width: 1024px) { .hero-shape-divider svg { height: 110px; } }
.hero-shape-divider .shape-fill { fill: var(--bg); }

/* Wave colour follows next section */
#hero:has(+ main#lp-content > section.bg-soft:first-child) .shape-fill { fill: var(--bg-soft); }
#hero:has(+ main#lp-content > section.bg-cool:first-child) .shape-fill { fill: var(--bg-cool); }
#hero:has(+ main#lp-content > section.bg-warm:first-child) .shape-fill { fill: var(--bg-warm); }

/* ── Mobile ── */
@media (max-width: 768px) {
    #hero                  { min-height: 60svh; }
    #hero[data-layout="split-right"],
    #hero[data-layout="split-left"] { min-height: auto; }

    /* Full-overlay */
    .hero-body             { padding: 90px 0 50px; text-align: center; }

    /* Split → single column, image always on top */
    .hero-split-body       { padding: 90px 0 56px; }
    .hero-split-grid       { grid-template-columns: 1fr; gap: 28px; }
    .hero-split-grid .hero-img-col  { order: -1 !important; }
    .hero-split-grid .hero-text-col { order:  1 !important; }
    .hero-img-frame        { transform: none !important; border-radius: var(--r-lg); }
    .hero-split-img        { aspect-ratio: 16/9; }
    .hero-img-col          { animation: none !important; opacity: 1 !important; }
    .hero-headline-split   { text-align: center !important; font-size: clamp(1.9rem, 8vw, 2.5rem) !important; }
    .hero-sub-split        { text-align: center; max-width: 100%; margin-left: auto !important; margin-right: auto !important; }
    .hero-actions-split    { justify-content: center !important; }

    /* Centered */
    .hero-centered-body    { padding: 100px 0 0; }
    .hero-centered-preview img { max-height: 280px; }

    /* Common */
    .hero-badge            { font-size: 0.74rem; padding: 5px 14px; margin-bottom: 14px; }
    .hero-headline         { font-size: clamp(2rem, 9.5vw, 2.6rem); margin-bottom: 12px; }
    .hero-sub              { font-size: 0.95rem; margin-bottom: 22px; }
    .hero-actions          { flex-direction: column; width: 100%; gap: 10px; justify-content: center !important; }
    .hero-actions a        { width: 100%; justify-content: center; padding: 14px 24px; font-size: 0.95rem; }
    .hero-scroll           { display: none; }
    .hero-shape-divider svg { height: 40px; }
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

/* Product panel */
.co-product-panel { position: sticky; top: 80px; }
.co-product-panel-inner {
    background: var(--card); border: 1px solid var(--border-light);
    border-radius: var(--r-lg); padding: 36px;
    box-shadow: var(--shadow-md);
}

@media (max-width: 860px) { 
    .checkout-grid { grid-template-columns: 1fr; } 
    .co-product-panel { position: static; }
    .co-product-panel-inner { padding: 28px 24px; }
}
.co-product-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 900; line-height: 1.2; margin-bottom: 10px;
}
.co-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
.co-price-main { font-size: 2.2rem; font-weight: 800; color: var(--accent); font-family: 'Playfair Display', serif; }
.co-price-old  { font-size: 1rem; color: var(--light); text-decoration: line-through; margin-right: 4px; }
.co-price-badge { background: #FEF2F2; color: #DC2626; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 100px; display: inline-flex; align-items: center; }

.co-divider { height: 1px; background: var(--border-light); border: none; margin: 24px 0; }

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
    background: var(--bg-soft); border: 1px solid var(--border-light);
    border-radius: var(--r-sm); padding: 24px;
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
   21 · GLOBAL MOBILE RESPONSIVENESS
═══════════════════════════════════════════ */
@media (max-width: 768px) {
    /* Layout & Base Spacing */
    .lp-section { padding: 56px 0; }
    .lp-container { padding: 0 20px; }
    .lp-layout-bordered .lp-container { padding: 24px 20px; }
    .lp-layout-card .lp-container    { padding: 28px 20px; }
    .lp-layout-shadow .lp-container  { padding: 28px 20px; }
    .lp-layout-accent-left .lp-container { padding-left: 32px; }
    
    /* Typography */
    .section-title { font-size: clamp(1.75rem, 8vw, 2.1rem); line-height: 1.2; }
    .section-sub { font-size: 0.95rem; margin-top: 10px; line-height: 1.6; }
    .section-center { margin-bottom: 32px !important; /* Overrides style="margin-bottom:52px" */ }
    
    /* Specific Sections */
    .cta-block { padding: 80px 0; }
    #checkout { padding: 60px 0 80px; }
    
    /* Cards & Grids */
    .feature-card { padding: 24px 20px; }
    .review-card { padding: 24px 20px; }
    .specs-table td { padding: 12px 16px; font-size: 0.85rem; }
    
    /* FAQ */
    .faq-q { padding: 16px 20px; font-size: 0.9rem; }
    .faq-a-inner { padding: 14px 20px 18px; font-size: 0.85rem; }
    
    /* Checkout Elements Optimization */
    .co-form-panel { padding: 26px 20px; }
    .co-product-panel-inner { padding: 26px 20px; }
    .co-price-main { font-size: 1.9rem; }
    .co-summary { padding: 20px 16px; margin-top: 24px; }
    
    /* Support Bubble */
    .lp-floating-support { bottom: 20px; right: 20px; }
}

/* ═══════════════════════════════════════════
   22 · FLOATING SUPPORT
═══════════════════════════════════════════ */
.lp-floating-support {
    position: fixed; bottom: 28px; right: 28px; z-index: 250;
    display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
}
.lp-support-toggle {
    width: 60px; height: 60px; border-radius: 50%; border: none;
    background: #fff; color: var(--text);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 30px rgba(0,0,0,0.16);
    cursor: pointer; transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
    position: relative;
}
.lp-support-toggle:hover {
    transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.18);
    background: #fafafa;
}
.lp-support-dot { position: absolute; top: 0; right: 0; width: 14px; height: 14px; }
.lp-dot-ping { position: absolute; inset: 0; border-radius: 50%; background: #34d399; opacity: 0.75; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }
.lp-dot-core { position: absolute; inset: 0; border-radius: 50%; background: #10b981; border: 2.5px solid #fff; }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }

.lp-support-menu {
    background: #fff; border: 1px solid var(--border-light);
    border-radius: 16px; width: 220px;
    box-shadow: var(--shadow-lg); overflow: hidden;
    transform-origin: bottom right; transform: scale(0.9) translateY(10px);
    opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
}
.lp-support-menu.show {
    transform: scale(1) translateY(0); opacity: 1; visibility: visible;
    pointer-events: auto;
}
.lp-sm-title { padding: 14px 18px 8px; font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.lp-sm-grid { display: grid; gap: 8px; padding: 0 12px 14px; }
.lp-sm-grid.two-cols { grid-template-columns: 1fr 1fr; }
.lp-sm-grid.one-col { grid-template-columns: 1fr; }
.lp-sm-btn {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
    padding: 12px; border-radius: 12px; transition: background 0.25s; text-decoration: none;
}
.lp-sm-wa  { background: #ecfdf5; border: 1px solid #d1fae5; }
.lp-sm-wa:hover { background: #d1fae5; }
.lp-sm-wa span { color: #065f46; font-size: 0.75rem; font-weight: 700; }
.lp-sm-wa .lp-sm-icon { width: 22px; height: 22px; color: #047857; }

.lp-sm-ms  { background: #eff6ff; border: 1px solid #dbeafe; }
.lp-sm-ms:hover { background: #dbeafe; }
.lp-sm-ms span { color: #1e40af; font-size: 0.75rem; font-weight: 700; }
.lp-sm-ms .lp-sm-icon { width: 22px; height: 22px; color: #1d4ed8; }

/* ═══════════════════════════════════════════
   23 · SECTION: TRUST BADGES
═══════════════════════════════════════════ */
.trust-badges-grid {
    display: flex; flex-wrap: wrap; justify-content: center;
    gap: 16px; margin-top: 48px;
}
.trust-badges-horizontal { flex-direction: row; }
.trust-badges-grid-col   { flex-direction: column; align-items: center; }

.trust-badge-item {
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; padding: 28px 24px;
    background: var(--card);
    border: 1px solid var(--border-light);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    min-width: 130px; flex: 1; max-width: 180px;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
.trust-badge-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-20);
}
.trust-badge-icon {
    font-size: 2rem; line-height: 1;
    width: 56px; height: 56px;
    background: var(--accent-10);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}
.trust-badge-label {
    font-size: 0.82rem; font-weight: 700;
    text-align: center; color: var(--text-2);
    letter-spacing: 0.01em;
}

@media (max-width: 640px) {
    .trust-badges-grid { gap: 12px; }
    .trust-badge-item { min-width: 100px; max-width: 140px; padding: 20px 14px; }
}

/* ═══════════════════════════════════════════
   24 · SECTION: COUNTDOWN
═══════════════════════════════════════════ */
.countdown-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-top: 40px; flex-wrap: wrap;
}
.countdown-unit {
    display: flex; flex-direction: column; align-items: center;
    background: var(--card);
    border: 1px solid var(--border-light);
    border-radius: var(--r-lg);
    padding: 28px 36px;
    box-shadow: var(--shadow-md);
    min-width: 110px;
}
.countdown-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    font-weight: 900; line-height: 1;
    color: var(--accent);
    display: block;
}
.countdown-lbl {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--muted);
    margin-top: 8px;
}
.countdown-sep {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 900; color: var(--accent);
    padding: 0 12px; opacity: 0.5;
    margin-bottom: 20px; /* aligns with num baseline */
}

@media (max-width: 640px) {
    .countdown-unit { padding: 20px 22px; min-width: 72px; }
    .countdown-sep  { padding: 0 6px; font-size: 2rem; }
}

/* ═══════════════════════════════════════════
   25 · SECTION: PRICING CARD
═══════════════════════════════════════════ */
.pricing-card {
    max-width: 480px; margin: 0 auto;
    background: var(--card);
    border: 1px solid var(--border-light);
    border-radius: var(--r-xl);
    padding: 48px 44px;
    box-shadow: var(--shadow-xl);
    text-align: center;
    position: relative; overflow: hidden;
}
.pricing-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent-50));
}
.pricing-badge {
    display: inline-block;
    background: var(--accent-10); color: var(--accent);
    border: 1px solid var(--accent-20);
    font-size: 0.8rem; font-weight: 700;
    padding: 6px 18px; border-radius: 100px;
    margin-bottom: 20px; letter-spacing: 0.04em;
}
.pricing-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 900; color: var(--text);
    margin-bottom: 28px; line-height: 1.2;
}
.pricing-prices {
    display: flex; align-items: baseline;
    justify-content: center; gap: 14px;
    margin-bottom: 28px;
}
.pricing-original {
    font-size: 1.3rem; color: var(--light);
    text-decoration: line-through;
    font-weight: 600;
}
.pricing-sale {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 6vw, 4rem);
    font-weight: 900; color: var(--accent);
    line-height: 1;
}
.pricing-notes {
    list-style: none; margin: 0 0 32px;
    display: flex; flex-direction: column; gap: 10px;
}
.pricing-notes li {
    font-size: 0.9rem; color: var(--muted);
    display: flex; align-items: center; justify-content: center; gap: 8px;
}
.pricing-notes li::before {
    content: '✓';
    color: var(--accent); font-weight: 800; font-size: 0.85rem;
    flex-shrink: 0;
}

@media (max-width: 640px) {
    .pricing-card { padding: 36px 24px; }
}

/* ═══════════════════════════════════════════
   26 · SECTION: COMPARISON TABLE
═══════════════════════════════════════════ */
.comparison-wrap { max-width: 720px; margin: 48px auto 0; }

.comparison-table {
    width: 100%; border-collapse: collapse;
    border-radius: var(--r-lg); overflow: hidden;
    box-shadow: var(--shadow-md);
}
.comparison-table thead tr {
    background: var(--text);
}
.comparison-table thead th {
    padding: 18px 24px;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-align: center;
}
.comparison-table thead th:first-child { text-align: left; }
.comparison-feature-col { color: rgba(255,255,255,0.5); width: 36%; }
.comparison-ours   { color: var(--accent); }
.comparison-theirs { color: rgba(255,255,255,0.55); }

.comparison-table tbody tr:nth-child(odd)  { background: var(--card); }
.comparison-table tbody tr:nth-child(even) { background: var(--bg-soft); }
.comparison-table tbody tr:last-child td   { border-bottom: none; }
.comparison-table tbody tr {
    transition: background 0.2s;
}
.comparison-table tbody tr:hover { background: var(--accent-10); }

.comparison-table td {
    padding: 16px 24px;
    font-size: 0.92rem;
    border-bottom: 1px solid var(--border-light);
    text-align: center;
}
.comparison-feature {
    text-align: left !important;
    color: var(--muted); font-weight: 600;
}
.comparison-ours-val   { color: var(--text); font-weight: 700; }
.comparison-theirs-val { color: var(--light); font-weight: 500; }

@media (max-width: 640px) {
    .comparison-table td,
    .comparison-table th { padding: 12px 14px; font-size: 0.82rem; }
}

/* ═══════════════════════════════════════════
   27 · GSAP INITIAL STATES (hidden before animate)
═══════════════════════════════════════════ */
[data-gsap] { opacity: 0; }
</style>
</head>
