@if(!empty($section['data']['images']))
<section class="lp-section {{ $idx % 2 === 0 ? 'bg-white' : 'bg-soft' }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">Gallery</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="gallery-grid">
            @foreach($section['data']['images'] as $img)
            <div class="gallery-item" data-gsap="scale" data-delay="{{ $loop->index * 0.07 }}"
                 onclick="lpOpenLightbox('{{ $img }}')">
                <img src="{{ $img }}" alt="" loading="lazy" />
                <div class="gallery-overlay">
                    <svg class="gallery-zoom-icon" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4m-2-2"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
