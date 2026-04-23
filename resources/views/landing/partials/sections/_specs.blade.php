@if(!empty($section['data']['rows']))
@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
           . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'bg-white' }}" style="{{ $sStyle }}">
    <div class="lp-container section-center">
        <div data-gsap="fade-up">
            <span class="section-label">Specifications</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="specs-wrap" data-gsap="fade-up" data-delay="0.12">
            <table class="specs-table">
                @foreach($section['data']['rows'] as $row)
                <tr>
                    <td>{{ $row['label'] ?? '' }}</td>
                    <td>{{ $row['value'] ?? '' }}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
</section>
@endif
