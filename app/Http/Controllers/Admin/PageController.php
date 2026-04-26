<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::where('type', 'custom')
                ->select(['id', 'title', 'slug', 'is_published', 'show_in_header', 'show_in_footer', 'updated_at'])
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:pages,slug'],
            'content' => ['nullable', 'string'],
            'is_published' => ['sometimes', 'boolean'],
            'show_in_header' => ['sometimes', 'boolean'],
            'show_in_footer' => ['sometimes', 'boolean'],
        ]);

        $data['is_published'] = (bool) ($data['is_published'] ?? true);
        $data['show_in_header'] = (bool) ($data['show_in_header'] ?? false);
        $data['show_in_footer'] = (bool) ($data['show_in_footer'] ?? false);
        $data['type'] = 'custom';

        Page::create($data);

        $this->forgetPageNavCaches();

        return redirect()->route('admin.pages.index')->with('success', 'Page created.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => $page->only(['id', 'title', 'slug', 'content', 'is_published', 'show_in_header', 'show_in_footer']),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('pages', 'slug')->ignore($page->id),
            ],
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

        $this->forgetPageNavCaches();

        return redirect()->route('admin.pages.index')->with('success', 'Page updated.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        $this->forgetPageNavCaches();

        return back()->with('success', 'Page deleted.');
    }

    private function forgetPageNavCaches(): void
    {
        cache()->forget('header_pages');
        cache()->forget('footer_pages');
    }
}
