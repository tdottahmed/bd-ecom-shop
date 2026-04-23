@if(!empty($section['data']['items']))
@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $defBg   = $idx % 2 === 0 ? 'bg-soft' : 'bg-warm';
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
           . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : $defBg }}" style="{{ $sStyle }}">
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
