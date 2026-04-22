@if(!empty($section['data']['badges']))
<section class="lp-section {{ $idx % 2 === 0 ? 'bg-soft' : 'bg-white' }}">
    <div class="lp-container">
        @if(!empty($section['data']['title']))
        <div class="section-center" data-gsap="fade-up">
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
        </div>
        @endif
        <div class="trust-badges-grid {{ ($section['data']['layout'] ?? 'horizontal') === 'horizontal' ? 'trust-badges-horizontal' : 'trust-badges-grid-col' }}" data-gsap="fade-up" data-delay="0.1">
            @foreach($section['data']['badges'] as $bi => $badge)
            <div class="trust-badge-item" data-gsap="fade-up" data-delay="{{ $bi * 0.08 }}">
                <div class="trust-badge-icon">{{ $badge['icon'] ?? '' }}</div>
                <div class="trust-badge-label">{{ $badge['label'] ?? '' }}</div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
