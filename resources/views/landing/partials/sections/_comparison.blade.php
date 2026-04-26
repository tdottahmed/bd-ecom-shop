@if(!empty($section['data']['rows']))
@php
  $d          = $section['design'] ?? [];
  $hasBg      = !empty($d['bg_color']);
  $layout     = $d['layout_style'] ?? 'default';
  $padCls     = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $defBg      = $idx % 2 === 0 ? 'bg-white' : 'bg-soft';
  $sStyle     = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
              . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
              . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
  $ourLabel   = $section['data']['our_label']   ?? 'Our Product';
  $theirLabel = $section['data']['their_label'] ?? 'Others';
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : $defBg }}" style="{{ $sStyle }}">
    <div class="lp-container">

        <div class="section-center" style="margin-bottom:56px;" data-gsap="fade-up">
            @if(!empty($section['data']['title']))
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
        </div>

        <div class="cmp-card" data-gsap="fade-up" data-delay="0.1">

            {{-- Header row --}}
            <div class="cmp-head">
                <div class="cmp-hcell cmp-hfeature">Feature</div>
                <div class="cmp-hcell cmp-hours">
                    <span class="cmp-winner-badge">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                        {{ $ourLabel }}
                    </span>
                </div>
                <div class="cmp-hcell cmp-htheirs">{{ $theirLabel }}</div>
            </div>

            {{-- Body rows --}}
            <div class="cmp-body">
                @foreach($section['data']['rows'] as $ri => $row)
                <div class="cmp-row {{ $ri % 2 !== 0 ? 'cmp-row-alt' : '' }}">
                    <div class="cmp-cell cmp-feature">{{ $row['feature'] ?? '' }}</div>
                    <div class="cmp-cell cmp-ours">{{ $row['ours'] ?? '' }}</div>
                    <div class="cmp-cell cmp-theirs">{{ $row['theirs'] ?? '' }}</div>
                </div>
                @endforeach
            </div>

        </div>

    </div>
</section>
@endif
