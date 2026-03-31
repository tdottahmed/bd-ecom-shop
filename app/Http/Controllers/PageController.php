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
        return Inertia::render('Customer/About');
    }

    public function contact()
    {
        $page = Page::where('slug', 'contact-us')->where('is_published', true)->first();
        $faqs = json_decode(get_setting('faqs', '[]'), true);
        
        return Inertia::render('Customer/Contact', [
            'page' => $page ? $page->only(['title', 'slug', 'content']) : null,
            'faqs' => $faqs,
        ]);
    }
}

