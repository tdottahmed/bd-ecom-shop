<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Spatie\Feed\Feed;
use Spatie\Feed\Helpers\ResolveFeedItems;

class RssController
{
    public function index(): Response
    {
        $xml = Cache::remember('public_rss_xml', now()->addHours(1), function () {
            $feeds = config('feed.feeds');
            $feed = $feeds['main'] ?? null;

            abort_unless($feed, 404);

            $items = ResolveFeedItems::resolve('main', $feed['items']);

            /** @var \Symfony\Component\HttpFoundation\Response $response */
            $response = (new Feed(
                $feed['title'],
                $items,
                request()->url(),
                $feed['view'] ?? 'feed::rss',
                $feed['description'] ?? '',
                $feed['language'] ?? 'en-US',
                $feed['image'] ?? '',
                $feed['format'] ?? 'rss',
                $feed['xsl'] ?? '',
            ))->toResponse(request());

            return $response->getContent();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
        ]);
    }
}

