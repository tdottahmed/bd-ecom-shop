@if(!empty($section['data']['end_date']))
@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
           . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'bg-warm' }}" style="{{ $sStyle }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            @if(!empty($section['data']['title']))
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
            @if(!empty($section['data']['subtext']))
            <p class="section-sub">{{ $section['data']['subtext'] }}</p>
            @endif
        </div>
        <div class="countdown-wrap" data-gsap="fade-up" data-delay="0.1"
             data-countdown="{{ $section['data']['end_date'] }}">
            <div class="countdown-unit"><span class="countdown-num" data-part="days">00</span><span class="countdown-lbl">Days</span></div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit"><span class="countdown-num" data-part="hours">00</span><span class="countdown-lbl">Hours</span></div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit"><span class="countdown-num" data-part="minutes">00</span><span class="countdown-lbl">Minutes</span></div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit"><span class="countdown-num" data-part="seconds">00</span><span class="countdown-lbl">Seconds</span></div>
        </div>
    </div>
</section>
@endif
