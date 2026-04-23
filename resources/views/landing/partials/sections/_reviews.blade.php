@if(!empty($section['data']['items']))
@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $defBg   = $idx % 2 === 0 ? 'bg-soft' : 'bg-white';
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
           . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : $defBg }}" style="{{ $sStyle }}">
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
