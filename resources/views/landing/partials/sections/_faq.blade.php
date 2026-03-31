@if(!empty($section['data']['items']))
<section class="lp-section bg-soft">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">FAQ</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="faq-list" data-gsap="fade-up" data-delay="0.12">
            @foreach($section['data']['items'] as $faq)
            <div class="faq-item">
                <button class="faq-q" onclick="lpToggleFaq(this)">
                    <span>{{ $faq['question'] ?? '' }}</span>
                    <svg class="faq-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                <div class="faq-a">
                    <div class="faq-a-inner">{{ $faq['answer'] ?? '' }}</div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
