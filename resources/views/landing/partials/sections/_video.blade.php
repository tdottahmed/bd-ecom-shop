@if(!empty($section['data']['url']))
@php
    $url = $section['data']['url'];
    $embed = $url;
    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/', $url, $m))
        $embed = 'https://www.youtube.com/embed/' . $m[1] . '?rel=0&modestbranding=1';
    elseif (preg_match('/vimeo\.com\/(\d+)/', $url, $m))
        $embed = 'https://player.vimeo.com/video/' . $m[1];
    $d       = $section['design'] ?? [];
    $hasBg   = !empty($d['bg_color']);
    $layout  = $d['layout_style'] ?? 'default';
    $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
    $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
             . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
             . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'bg-cool' }}" style="{{ $sStyle }}">
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
