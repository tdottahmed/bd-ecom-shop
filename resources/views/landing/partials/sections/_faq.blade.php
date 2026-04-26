@if(!empty($section['data']['items']))
@php
  $d       = $section['design'] ?? [];
  $hasBg   = !empty($d['bg_color']);
  $layout  = $d['layout_style'] ?? 'default';
  $padCls  = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle  = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
           . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
           . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
@endphp
<section class="lp-section lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'bg-soft' }}" style="{{ $sStyle }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">FAQ</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="faq-list" data-gsap="fade-up" data-delay="0.12">
            @foreach($section['data']['items'] as $faq)
            <div class="faq-item">
                <button class="faq-q" onclick="lpToggleFaq(this)">
                    <span>{{ $faq['question'] ?? '' }}</span>
                    <svg class="faq-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                <div class="faq-a">
                    <div class="faq-a-inner">{{ $faq['answer'] ?? '' }}</div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif
