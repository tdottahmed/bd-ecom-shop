@if(!empty($section['data']['badges']))
@php
  $d      = $section['design'] ?? [];
  $hasBg  = !empty($d['bg_color']);
  $layout = $d['layout_style'] ?? 'default';
  $padCls = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $defBg  = $idx % 2 === 0 ? 'bg-soft' : 'bg-white';
  $sStyle = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
          . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
          . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : $defBg }}" style="{{ $sStyle }}">
    <div class="lp-container">

        @if(!empty($section['data']['title']))
        <div class="section-center" style="margin-bottom:52px;" data-gsap="fade-up">
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
        </div>
        @endif

        <div class="tb-grid">
            @foreach($section['data']['badges'] as $bi => $badge)
            <div class="tb-card" data-gsap="fade-up" data-delay="{{ $bi * 0.1 }}">
                <div class="tb-card-glow"></div>
                <div class="tb-icon-wrap">
                    <span class="tb-icon">{{ $badge['icon'] ?? '' }}</span>
                </div>
                <p class="tb-label">{{ $badge['label'] ?? '' }}</p>
            </div>
            @endforeach
        </div>

    </div>
</section>
@endif
