<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        abort_unless(get_setting('blog_enabled', '1') === '1', 404);

        return Inertia::render('Customer/Blog/Index', [
            'posts' => BlogPost::query()
                ->where('is_published', true)
                ->whereNotNull('published_at')
                ->latest('published_at')
                ->paginate(9),
            'featured' => BlogPost::query()
                ->where('is_published', true)
                ->whereNotNull('published_at')
                ->latest('published_at')
                ->take(3)
                ->get(),
        ]);
    }

    public function show(BlogPost $blogPost): Response
    {
        abort_unless(get_setting('blog_enabled', '1') === '1', 404);
        abort_unless($blogPost->is_published, 404);

        $related = BlogPost::query()
            ->where('is_published', true)
            ->where('id', '!=', $blogPost->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Customer/Blog/Show', [
            'post' => $blogPost,
            'related' => $related,
        ]);
    }
}
