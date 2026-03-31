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
</section>
