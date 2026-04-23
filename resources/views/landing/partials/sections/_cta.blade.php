@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '');
@endphp
<section class="cta-block lp-layout-{{ $layout }}{{ $padCls }}" style="{{ $sStyle }}">
    <div class="lp-container cta-block-inner">
        <h2 class="cta-block-headline" data-gsap="fade-up">{{ $section['data']['headline'] ?? '' }}</h2>
        @if(!empty($section['data']['subtext']))
        <p class="cta-block-sub" data-gsap="fade-up" data-delay="0.1">{{ $section['data']['subtext'] }}</p>
        @endif
        @if(!empty($section['data']['button_text']))
        <a href="{{ $section['data']['button_url'] ?? '#checkout' }}"
           class="btn-accent" style="font-size:1.05rem;padding:16px 40px;"
           data-gsap="fade-up" data-delay="0.2">
            {{ $section['data']['button_text'] }}
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        @endif
    </div>
</section>
