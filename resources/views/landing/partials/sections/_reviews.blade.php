@if(!empty($section['data']['items']))
<section class="lp-section {{ $idx % 2 === 0 ? 'bg-soft' : 'bg-white' }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">Reviews</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="reviews-grid">
            @foreach($section['data']['items'] as $ri => $review)
            <div class="review-card" data-gsap="fade-up" data-delay="{{ $ri * 0.1 }}">
                <div class="review-quote">"</div>
                <div class="review-stars">
                    @for($s = 1; $s <= 5; $s++)
                    <span class="{{ $s <= ($review['rating'] ?? 5) ? 'star-full' : 'star-empty' }}">★</span>
                    @endfor
                </div>
                <p class="review-text">{{ $review['text'] ?? '' }}</p>
                <div class="review-author">
                    <div class="review-avatar">{{ strtoupper(substr($review['name'] ?? '?', 0, 1)) }}</div>
                    <div>
                        <div class="review-name">{{ $review['name'] ?? '' }}</div>
                        @if(!empty($review['location']))
                        <div class="review-location">{{ $review['location'] }}</div>
                        @endif
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
