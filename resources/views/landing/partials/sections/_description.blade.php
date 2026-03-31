<section class="lp-section {{ $idx % 2 === 0 ? 'bg-white' : 'bg-soft' }}">
    <div class="lp-container section-center">
        <div data-gsap="fade-up">
            <span class="section-label">Overview</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="prose" style="margin-top:32px;" data-gsap="fade-up" data-delay="0.15">
            {!! $section['data']['content'] ?? '' !!}
        </div>
    </div>
</section>
