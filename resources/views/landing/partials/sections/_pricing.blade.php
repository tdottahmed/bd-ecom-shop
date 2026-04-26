@if(!empty($section['data']['sale_price']))
@php
  $d         = $section['design'] ?? [];
  $hasBg     = !empty($d['bg_color']);
  $layout    = $d['layout_style'] ?? 'default';
  $padCls    = match($d['padding'] ?? 'md') { 'sm' => ' lp-pad-sm', 'lg' => ' lp-pad-lg', default => '' };
  $sStyle    = ($hasBg ? 'background:' . e($d['bg_color']) . ';' : '')
             . (!empty($d['text_color']) ? 'color:' . e($d['text_color']) . ';' : '')
             . (!empty($d['align']) && $d['align'] !== 'left' ? 'text-align:' . $d['align'] . ';' : '');
  $currency  = $section['data']['currency'] ?? 'RM';
  $salePr    = $section['data']['sale_price'];
  $origPr    = $section['data']['original_price'] ?? '';
  $hasDisc   = !empty($origPr) && (float)$origPr > (float)$salePr;
  $savings   = $hasDisc ? round((((float)$origPr - (float)$salePr) / (float)$origPr) * 100) : 0;
  $hasNotes  = !empty($section['data']['notes']) && count(array_filter($section['data']['notes']));
@endphp

<section class="lp-section pc-wrap lp-layout-{{ $layout }}{{ $padCls }} {{ $hasBg ? '' : 'bg-soft' }}" style="{{ $sStyle }}">
    <div class="lp-container">

        {{-- Section header --}}
        @if(!empty($section['data']['title']) || !empty($section['data']['badge']))
        <div class="section-center" style="margin-bottom:56px;" data-gsap="fade-up">
            @if(!empty($section['data']['badge']))
            <span class="section-label">{{ $section['data']['badge'] }}</span>
            @endif
            @if(!empty($section['data']['title']))
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
        </div>
        @endif

        {{-- Main card --}}
        <div class="pc-card {{ $hasNotes ? 'pc-has-notes' : '' }}" data-gsap="fade-up" data-delay="0.1">

            {{-- Decorative radial glow --}}
            <div class="pc-deco" aria-hidden="true"></div>

            {{-- Left column: price --}}
            <div class="pc-left">

                @if($hasDisc)
                <div class="pc-savings-pill">🔥 Save {{ $savings }}%</div>
                @endif

                <div class="pc-price-block">
                    @if($hasDisc)
                    <span class="pc-orig">{{ $currency }}{{ $origPr }}</span>
                    @endif
                    <div class="pc-price-row">
                        <span class="pc-curr">{{ $currency }}</span>
                        <span class="pc-amount">{{ $salePr }}</span>
                    </div>
                    @if($hasDisc)
                    <div class="pc-you-save">You save {{ $currency }}{{ number_format((float)$origPr - (float)$salePr, 0) }}</div>
                    @endif
                </div>

                @if(!empty($section['data']['button_text']))
                <a href="{{ $section['data']['button_url'] ?? '#checkout' }}" class="pc-cta-btn">
                    {{ $section['data']['button_text'] }}
                    <svg class="pc-cta-arrow" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                @endif

                <p class="pc-trust">🔒 Secure payment · Money-back guarantee</p>

            </div>

            {{-- Right column: benefits (only when notes exist) --}}
            @if($hasNotes)
            <div class="pc-right">
                <p class="pc-right-label">What's included</p>
                <ul class="pc-notes">
                    @foreach($section['data']['notes'] as $note)
                    @if(!empty($note))
                    <li class="pc-note">
                        <span class="pc-check" aria-hidden="true">
                            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                        </span>
                        {{ $note }}
                    </li>
                    @endif
                    @endforeach
                </ul>
            </div>
            @endif

        </div>

    </div>
</section>
@endif
