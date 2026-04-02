<section id="hero" @if($page->hero_image) style="background-image:url('{{ Storage::url($page->hero_image) }}')" @endif>
    <div class="hero-overlay"></div>

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
                <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="btn-accent" style="font-size:1.05rem;padding:16px 38px;">
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

    <div class="hero-shape-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
        </svg>
    </div>
</section>
