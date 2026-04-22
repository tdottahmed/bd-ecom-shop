@if(!empty($section['data']['sale_price']))
<section class="lp-section bg-soft">
    <div class="lp-container">
        <div class="pricing-card" data-gsap="fade-up">
            @if(!empty($section['data']['badge']))
            <div class="pricing-badge">{{ $section['data']['badge'] }}</div>
            @endif
            @if(!empty($section['data']['title']))
            <h2 class="pricing-title">{{ $section['data']['title'] }}</h2>
            @endif
            <div class="pricing-prices">
                @if(!empty($section['data']['original_price']))
                <span class="pricing-original">{{ $section['data']['currency'] ?? 'RM' }}{{ $section['data']['original_price'] }}</span>
                @endif
                <span class="pricing-sale">{{ $section['data']['currency'] ?? 'RM' }}{{ $section['data']['sale_price'] }}</span>
            </div>
            @if(!empty($section['data']['notes']))
            <ul class="pricing-notes">
                @foreach($section['data']['notes'] as $note)
                <li>{{ $note }}</li>
                @endforeach
            </ul>
            @endif
            @if(!empty($section['data']['button_text']))
            <a href="{{ $section['data']['button_url'] ?? '#checkout' }}"
               class="btn-accent" style="font-size:1.05rem;padding:16px 40px;">
                {{ $section['data']['button_text'] }}
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            @endif
        </div>
    </div>
</section>
@endif
