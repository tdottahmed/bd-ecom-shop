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
            'pages' => Page::query()
                ->select(['id', 'title', 'slug', 'is_published', 'updated_at'])
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
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $data['is_published'] = (bool) ($data['is_published'] ?? true);

        Page::create($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page created.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => $page->only(['id', 'title', 'slug', 'content', 'meta_title', 'meta_description', 'is_published']),
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
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('is_published', $data)) {
            $data['is_published'] = (bool) $data['is_published'];
        }

        $page->update($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page updated.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return back()->with('success', 'Page deleted.');
    }
}

