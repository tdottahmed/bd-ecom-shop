@php
    $layout    = $page->hero_layout    ?? 'full-overlay';
    $bgColor   = $page->hero_bg_color  ?: null;
    $txtColor  = $page->hero_text_color ?: null;
    $hasImage  = !empty($page->hero_image);
    $imageUrl  = $hasImage ? Storage::url($page->hero_image) : null;
    $isSplit   = in_array($layout, ['split-right', 'split-left']);
    $isOverlay = $layout === 'full-overlay';

    $heroStyle = '';
    if ($isOverlay && $hasImage)        $heroStyle .= "background-image:url('{$imageUrl}');";
    if ($bgColor)                        $heroStyle .= "background-color:{$bgColor};";
    if ($txtColor)                       $heroStyle .= "--hero-text:{$txtColor};";
@endphp

<section id="hero" data-layout="{{ $layout }}" style="{{ $heroStyle }}">

    {{-- ── Background layer ─────────────────────────────────── --}}
    @if($isOverlay)
        <div class="hero-overlay"></div>
    @else
        <div class="hero-deco-orb hero-deco-1"></div>
        <div class="hero-deco-orb hero-deco-2"></div>
    @endif

    {{-- ══════════════════════════════════════════════════════
         SPLIT layouts  (split-right  /  split-left)
    ══════════════════════════════════════════════════════ --}}
    @if($isSplit)

    <div class="hero-split-body">
        <div class="lp-container">
            <div class="hero-split-grid{{ $layout === 'split-left' ? ' img-left' : '' }}">

                {{-- Text column --}}
                <div class="hero-text-col">
                    @if($page->hero_badge)
                    <div class="hero-badge" id="hero-badge">{{ $page->hero_badge }}</div>
                    @endif

                    <h1 class="hero-headline hero-headline-split" id="hero-headline">{{ $page->hero_headline }}</h1>

                    @if($page->hero_subheadline)
                    <p class="hero-sub hero-sub-split" id="hero-sub">{{ $page->hero_subheadline }}</p>
                    @endif

                    <div class="hero-actions hero-actions-split" id="hero-actions">
                        <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="btn-accent hero-btn-main">
                            {{ $page->hero_cta_text }}
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                        @if(!empty($page->sections))
                        <a href="#lp-content" class="btn-ghost">Explore ↓</a>
                        @endif
                    </div>
                </div>

                {{-- Image column --}}
                @if($hasImage)
                <div class="hero-img-col {{ $layout === 'split-left' ? 'enter-left' : 'enter-right' }}">
                    <div class="hero-img-frame {{ $layout === 'split-left' ? 'tilt-left' : 'tilt-right' }}">
                        <img src="{{ $imageUrl }}" alt="{{ $page->hero_headline }}" class="hero-split-img" />
                        <div class="hero-img-shine"></div>
                    </div>
                    <div class="hero-img-shadow"></div>
                </div>
                @endif

            </div>
        </div>
    </div>

    {{-- ══════════════════════════════════════════════════════
         CENTERED layout
    ══════════════════════════════════════════════════════ --}}
    @elseif($layout === 'centered')

    <div class="hero-centered-body">
        <div class="lp-container">
            @if($page->hero_badge)
            <div class="hero-badge" id="hero-badge">{{ $page->hero_badge }}</div>
            @endif

            <h1 class="hero-headline" id="hero-headline">{{ $page->hero_headline }}</h1>

            @if($page->hero_subheadline)
            <p class="hero-sub" id="hero-sub">{{ $page->hero_subheadline }}</p>
            @endif

            <div class="hero-actions" id="hero-actions">
                <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="btn-accent hero-btn-main">
                    {{ $page->hero_cta_text }}
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                @if(!empty($page->sections))
                <a href="#lp-content" class="btn-ghost">Explore ↓</a>
                @endif
            </div>

            @if($hasImage)
            <div class="hero-centered-preview">
                <img src="{{ $imageUrl }}" alt="{{ $page->hero_headline }}" />
                <div class="hero-centered-preview-glow"></div>
            </div>
            @endif
        </div>
    </div>

    {{-- ══════════════════════════════════════════════════════
         FULL-OVERLAY layout  (default)
    ══════════════════════════════════════════════════════ --}}
    @else

    <div class="hero-body">
        <div class="lp-container">
            @if($page->hero_badge)
            <div class="hero-badge" id="hero-badge">
                <span>{{ $page->hero_badge }}</span>
            </div>
            @endif

            <h1 class="hero-headline" id="hero-headline">{{ $page->hero_headline }}</h1>

            @if($page->hero_subheadline)
            <p class="hero-sub" id="hero-sub">{{ $page->hero_subheadline }}</p>
            @endif

            <div class="hero-actions" id="hero-actions">
                <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="btn-accent hero-btn-main">
                    {{ $page->hero_cta_text }}
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                @if(!empty($page->sections))
                <a href="#lp-content" class="btn-ghost">Explore ↓</a>
                @endif
            </div>
        </div>
    </div>

    <div class="hero-scroll" id="hero-scroll">
        <div class="scroll-line"></div>
        <span>scroll</span>
    </div>

    @endif



</section>
