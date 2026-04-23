@if(!empty($section['data']['url']))
@php
    $url = $section['data']['url'];
    $embed = $url;
    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/', $url, $m))
        $embed = 'https://www.youtube.com/embed/' . $m[1] . '?rel=0&modestbranding=1';
    elseif (preg_match('/vimeo\.com\/(\d+)/', $url, $m))
        $embed = 'https://player.vimeo.com/video/' . $m[1];
    $d      = $section['design'] ?? [];
    $hasBg  = !empty($d['bg_color']);
    $layout = $d['layout_style'] ?? 'default';
    $padCls = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
    $sStyle = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
            . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
            . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section vid-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'vid-dark-bg' }}" style="{{ $sStyle }}">
    <div class="vid-orb vid-orb-1" aria-hidden="true"></div>
    <div class="vid-orb vid-orb-2" aria-hidden="true"></div>
    <div class="lp-container vid-inner">

        <div class="section-center" style="margin-bottom:56px;" data-gsap="fade-up">
            <span class="section-label">Watch It In Action</span>
            @if(!empty($section['data']['title']))
            <h2 class="section-title vid-heading" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
        </div>

        <div class="vid-frame" data-gsap="fade-up" data-delay="0.15">
            {{-- macOS-style chrome bar --}}
            <div class="vid-chrome" aria-hidden="true">
                <span class="vid-dot" style="background:#ff5f57;"></span>
                <span class="vid-dot" style="background:#ffbd2e;"></span>
                <span class="vid-dot" style="background:#28c840;"></span>
                <span class="vid-url-bar"></span>
            </div>
            {{-- Video embed --}}
            <div class="vid-embed">
                <iframe src="{{ $embed }}" allowfullscreen loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                </iframe>
            </div>
        </div>

        {{-- Glow halo beneath the frame --}}
        <div class="vid-halo" aria-hidden="true"></div>

        @if(!empty($section['data']['caption']))
        <p class="vid-caption" data-gsap="fade-up" data-delay="0.3">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-right:6px;opacity:.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            {{ $section['data']['caption'] }}
        </p>
        @endif

    </div>
</section>
@endif
