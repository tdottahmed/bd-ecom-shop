@if(!empty($section['data']['items']))
<section class="lp-section {{ $idx % 2 === 0 ? 'bg-soft' : 'bg-warm' }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">Features</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="features-grid">
            @foreach($section['data']['items'] as $fi => $feat)
            <div class="feature-card" data-gsap="fade-up" data-delay="{{ $fi * 0.1 }}">
                <div class="feature-icon-wrap">{{ $feat['emoji'] ?? '✦' }}</div>
                <div class="feature-title">{{ $feat['title'] ?? '' }}</div>
                <div class="feature-desc">{{ $feat['description'] ?? '' }}</div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
