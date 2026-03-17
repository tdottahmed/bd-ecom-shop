<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title inertia>{{ config('app.name', 'Laravel') }}</title>
  @php
    $websiteSetting = \App\Models\WebsiteSetting::first();
    $favicon = $websiteSetting?->favicon;
  @endphp
  <link rel="icon" type="image/png" href="{{ $favicon ? asset('storage/' . $favicon) : asset('favicon.png') }}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

  <!-- Scripts -->
  @routes
  @viteReactRefresh
  @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
  @inertiaHead

  <!-- Meta Pixel Code -->
  @php
    $metaPixelEnabled = get_setting('meta_pixel_enabled', '0') === '1';
    $metaPixelId = get_setting('meta_pixel_id');
    $metaPixelTestCode = get_setting('meta_pixel_test_code');
  @endphp
  @if ($metaPixelEnabled && $metaPixelId)
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
      }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '{{ $metaPixelId }}'
        @if ($metaPixelTestCode)
          , {
            testCode: '{{ $metaPixelTestCode }}'
          }
        @endif );
      fbq('track', 'PageView');
    </script>
    <noscript>
      <img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1" />
    </noscript>
  @endif

  <!-- Google Tag Manager -->
  @php
    $gtmEnabled = get_setting('google_tag_manager_enabled', '0') === '1';
    $gtmContainerId = get_setting('google_tag_manager_container_id');
  @endphp
  @if ($gtmEnabled && $gtmContainerId)
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
      })(window, document, 'script', 'dataLayer', '{{ $gtmContainerId }}');
    </script>
  @endif
</head>

<body class="font-sans antialiased">
  <!-- Google Tag Manager (noscript) -->
  @if ($gtmEnabled && $gtmContainerId)
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmContainerId }}" height="0" width="0"
              style="display:none;visibility:hidden"></iframe>
    </noscript>
  @endif

  @inertia

</body>

</html>
