<nav id="lp-nav">
    <span class="nav-logo serif">{{ $page->page_title }}</span>
    <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="nav-cta">
        {{ $page->hero_cta_text }}
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
</nav>
