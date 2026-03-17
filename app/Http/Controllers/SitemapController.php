<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $xml = Cache::remember('public_sitemap_xml', now()->addHours(6), function () {
            $sitemap = Sitemap::create();

            $sitemap->add(
                Url::create(route('home'))
                    ->setPriority(1.0)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            );

            $sitemap->add(
                Url::create(route('products.index'))
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            );

            Category::select(['id', 'updated_at'])->get()->each(function (Category $category) use ($sitemap) {
                $sitemap->add(
                    Url::create(route('products.category', $category))
                        ->setPriority(0.7)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                        ->setLastModificationDate($category->updated_at)
                );
            });

            Product::select(['id', 'slug', 'updated_at'])->whereNotNull('slug')->get()->each(function (Product $product) use ($sitemap) {
                $sitemap->add(
                    Url::create(route('products.show', $product->slug))
                        ->setPriority(0.6)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setLastModificationDate($product->updated_at)
                );
            });

            return $sitemap->render();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}

