<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/LegalPages/Index', [
            'pages' => Page::where('type', 'legal')
                ->select(['id', 'title', 'slug', 'is_published', 'show_in_header', 'show_in_footer', 'updated_at'])
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function edit(Page $page)
    {
        abort_if($page->type !== 'legal', 404);

        return Inertia::render('Admin/LegalPages/Form', [
            'page' => $page->only(['id', 'title', 'slug', 'content', 'is_published', 'show_in_header', 'show_in_footer']),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        abort_if($page->type !== 'legal', 404);

        $data = $request->validate([
            'content' => ['nullable', 'string'],
            'is_published' => ['sometimes', 'boolean'],
            'show_in_header' => ['sometimes', 'boolean'],
            'show_in_footer' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('is_published', $data)) {
            $data['is_published'] = (bool) $data['is_published'];
        }
        if (array_key_exists('show_in_header', $data)) {
            $data['show_in_header'] = (bool) $data['show_in_header'];
        }
        if (array_key_exists('show_in_footer', $data)) {
            $data['show_in_footer'] = (bool) $data['show_in_footer'];
        }

        $page->update($data);

        cache()->forget('header_pages');
        cache()->forget('footer_pages');

        return back()->with('success', 'Page updated.');
    }
}
