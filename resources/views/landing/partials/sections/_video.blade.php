@if(!empty($section['data']['url']))
@php
    $url = $section['data']['url'];
    $embed = $url;
    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/', $url, $m))
        $embed = 'https://www.youtube.com/embed/' . $m[1] . '?rel=0&modestbranding=1';
    elseif (preg_match('/vimeo\.com\/(\d+)/', $url, $m))
        $embed = 'https://player.vimeo.com/video/' . $m[1];
@endphp
<section class="lp-section bg-cool">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">Video</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="video-outer">
            <div class="video-embed" data-gsap="fade-up" data-delay="0.15">
                <iframe src="{{ $embed }}" allowfullscreen loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                </iframe>
            </div>
            @if(!empty($section['data']['caption']))
            <p class="video-caption" data-gsap="fade-up" data-delay="0.25">{{ $section['data']['caption'] }}</p>
            @endif
        </div>
    </div>
</section>
@endif
