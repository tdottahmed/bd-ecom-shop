<div id="lp-mobile-bar">
    <span class="mb-title">{{ $page->page_title }}</span>
    <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="btn-accent" style="font-size:0.82rem;padding:10px 22px;white-space:nowrap;">
        {{ $page->hero_cta_text }}
    </a>
</div>
