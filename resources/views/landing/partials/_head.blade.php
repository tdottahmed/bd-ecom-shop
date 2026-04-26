<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ $page->page_title }}</title>
  @if ($page->meta_description)
    <meta name="description" content="{{ $page->meta_description }}" />
  @endif
  <meta property="og:title" content="{{ $page->page_title }}" />
  @if ($page->meta_description)
    <meta property="og:description" content="{{ $page->meta_description }}" />
  @endif
  @if ($page->hero_image)
    <meta property="og:image" content="{{ Storage::url($page->hero_image) }}" />
  @endif

  @php $lpFavicon = get_setting('site_favicon'); @endphp
  <link rel="icon" type="image/png"
        href="{{ $lpFavicon ? asset('storage/' . $lpFavicon) : asset('favicon.png') }}" />

  @php
    $lpFont = $page->global_font_family ?? '';
    // Fonts not in the base load (Inter + Playfair Display) that need a separate request
    $lpExtraFonts = [
        "'Poppins', sans-serif" => 'Poppins:wght@400;500;600;700;800',
        "'Montserrat', sans-serif" => 'Montserrat:wght@400;500;600;700;800',
        "'Raleway', sans-serif" => 'Raleway:wght@400;500;600;700;800',
        "'Lato', sans-serif" => 'Lato:wght@400;700',
        "'Nunito', sans-serif" => 'Nunito:wght@400;600;700;800',
        "'Merriweather', serif" => 'Merriweather:wght@400;700',
        "'DM Sans', sans-serif" => 'DM+Sans:wght@400;500;600;700',
    ];
    $lpExtraParam = $lpFont ? $lpExtraFonts[$lpFont] ?? null : null;
  @endphp
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet" />
  @if ($lpExtraParam)
    <link href="https://fonts.googleapis.com/css2?family={{ $lpExtraParam }}&display=swap" rel="stylesheet" />
  @endif

  {{-- GSAP --}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>

  <link rel="stylesheet" href="{{ asset('css/lp.css') }}?v={{ filemtime(public_path('css/lp.css')) }}" />
  <style>
    :root {
      --accent: {{ $page->accent_color }};
      --accent-10: {{ $page->accent_color }}1a;
      --accent-20: {{ $page->accent_color }}33;
      --accent-50: {{ $page->accent_color }}80;
      --accent-13: {{ $page->accent_color }}22;
      --accent-09: {{ $page->accent_color }}18;

      --bg: #FFFFFF;
      --bg-soft: #F7F5F0;
      --bg-warm: #FFF8F0;
      --bg-cool: #F2F9FF;

      --card: #FFFFFF;
      --border: #E8E3D8;
      --border-light: #F0ECE4;

      --text: #111827;
      --text-2: #374151;
      --muted: #6B7280;
      --light: #9CA3AF;

      --shadow-xs: 0 1px 4px rgba(0, 0, 0, 0.06);
      --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.07);
      --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.09);
      --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.11);
      --shadow-xl: 0 40px 100px rgba(0, 0, 0, 0.14);

      --r-sm: 8px;
      --r: 16px;
      --r-lg: 24px;
      --r-xl: 36px;
    }
  </style>
  @if ($lpFont)
    <style>
      body.lp {
        font-family: {{ $lpFont }};
      }
    </style>
  @endif

  {{-- Meta Pixel --}}
  @php
    $lpPixelEnabled = get_setting('meta_pixel_enabled', '0') === '1';
    $lpPixelId = get_setting('meta_pixel_id');
    $lpPixelTestCode = get_setting('meta_pixel_test_code');
  @endphp
  @if ($lpPixelEnabled && $lpPixelId)
    <script>
      ! function(f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      }
      (window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '{{ $lpPixelId }}'
        @if ($lpPixelTestCode)
          , {
            testCode: '{{ $lpPixelTestCode }}'
          }
        @endif );
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id={{ $lpPixelId }}&ev=PageView&noscript=1" /></noscript>
  @endif

  {{-- Google Tag Manager --}}
  @php
    $lpGtmEnabled = get_setting('google_tag_manager_enabled', '0') === '1';
    $lpGtmId = get_setting('google_tag_manager_container_id');
  @endphp
  @if ($lpGtmEnabled && $lpGtmId)
    <script>
      (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', '{{ $lpGtmId }}');
    </script>
  @endif
</head>
