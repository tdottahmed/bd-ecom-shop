<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show(string $slug)
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Customer/Page', [
            'page' => $page->only(['title', 'slug', 'content']),
        ]);
    }

    public function about()
    {
        return $this->show('about-us');
    }

    public function contact()
    {
        return $this->show('contact-us');
    }
}

