@if(!empty($section['data']['end_date']))
@php
  $d      = $section['design'] ?? [];
  $hasBg  = !empty($d['bg_color']);
  $layout = $d['layout_style'] ?? 'default';
  $padCls = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
          . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
          . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section cd-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'cd-dark-bg' }}" style="{{ $sStyle }}">
    <div class="cd-orb cd-orb-1"></div>
    <div class="cd-orb cd-orb-2"></div>
    <div class="lp-container cd-inner">

        <div class="section-center" data-gsap="fade-up">
            @if(!empty($section['data']['title']))
            <h2 class="section-title cd-heading" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
            @if(!empty($section['data']['subtext']))
            <p class="section-sub cd-subtext">{{ $section['data']['subtext'] }}</p>
            @endif
        </div>

        <div class="cd-wrap" data-gsap="fade-up" data-delay="0.15"
             data-countdown="{{ $section['data']['end_date'] }}">

            <div class="cd-unit">
                <div class="cd-box"><span class="cd-num" data-part="days">00</span></div>
                <span class="cd-lbl">Days</span>
            </div>

            <div class="cd-sep">:</div>

            <div class="cd-unit">
                <div class="cd-box"><span class="cd-num" data-part="hours">00</span></div>
                <span class="cd-lbl">Hours</span>
            </div>

            <div class="cd-sep">:</div>

            <div class="cd-unit">
                <div class="cd-box"><span class="cd-num" data-part="minutes">00</span></div>
                <span class="cd-lbl">Minutes</span>
            </div>

            <div class="cd-sep">:</div>

            <div class="cd-unit">
                <div class="cd-box"><span class="cd-num" data-part="seconds">00</span></div>
                <span class="cd-lbl">Seconds</span>
            </div>

        </div>

    </div>
</section>
@endif
