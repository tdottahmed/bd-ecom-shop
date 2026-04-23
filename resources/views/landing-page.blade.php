<!DOCTYPE html>
<html lang="en">
@include('landing.partials._head')
<body class="lp">

{{-- GTM noscript (must be first element after <body>) --}}
@if(get_setting('google_tag_manager_enabled', '0') === '1' && get_setting('google_tag_manager_container_id'))
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ get_setting('google_tag_manager_container_id') }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
@endif

@if(!$page->is_published)
    @include('landing.partials._draft-banner')
@endif

@include('landing.partials._nav')
@include('landing.partials._hero')

<main id="lp-content">
    @if($page->sections)
        @php
            $validSections = [
                'description','features','gallery','video','reviews',
                'specs','faq','cta','trust_badges','countdown','pricing','comparison',
            ];
        @endphp
        @foreach($page->sections as $section)
            @if(in_array($section['type'], $validSections))
                @include('landing.partials.sections._' . $section['type'], [
                    'section' => $section,
                    'idx'     => $loop->index,
                    'page'    => $page,
                ])
            @endif
        @endforeach
    @endif

    @if($page->category_id && $categoryProducts && $categoryProducts->count() > 0)
        @include('landing.partials._category-showcase')
        @include('landing.partials._category-checkout')
    @elseif($page->product)
        @include('landing.partials._checkout')
    @endif
</main>

@include('landing.partials._footer')
@include('landing.partials._support-bubble')
@include('landing.partials._lightbox')
@include('landing.partials._scripts')

</body>
</html>
