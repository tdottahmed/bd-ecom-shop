<nav id="lp-nav">
    @php
        $navLogo    = get_setting('site_logo');
        $navSiteName = get_setting('seo_site_name') ?: get_setting('site_name') ?: config('app.name');
    @endphp
    @if($navLogo)
    <a href="#" class="nav-logo-link">
        <img src="{{ Storage::url($navLogo) }}" alt="{{ $navSiteName }}" class="nav-logo-img" />
    </a>
    @else
    <span class="nav-logo serif">{{ $navSiteName }}</span>
    @endif
    <a href="{{ $page->hero_cta_url ?: '#checkout' }}" class="nav-cta">
        {{ $page->hero_cta_text }}
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
</nav>
