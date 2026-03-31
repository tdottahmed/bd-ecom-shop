<!DOCTYPE html>
<html lang="en">
@include('landing.partials._head')
<body class="lp">

@if(!$page->is_published)
    @include('landing.partials._draft-banner')
@endif

@include('landing.partials._nav')
@include('landing.partials._hero')

<main id="lp-content">
    @if($page->sections)
        @php $validSections = ['description','features','gallery','video','reviews','specs','faq','cta']; @endphp
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

    @if($page->product)
        @include('landing.partials._checkout')
    @endif
</main>

@include('landing.partials._mobile-bar')
@include('landing.partials._lightbox')
@include('landing.partials._scripts')

</body>
</html>
