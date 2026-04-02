<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Blogs/Index', [
            'posts' => BlogPost::query()
                ->select([
                    'id',
                    'title',
                    'slug',
                    'excerpt',
                    'cover_image',
                    'is_published',
                    'published_at',
                    'updated_at',
                ])
                ->latest()
                ->paginate(12),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blogs/Form', [
            'post' => null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $data['slug'] = ! empty($data['slug'])
            ? Str::slug($data['slug'])
            : Str::slug($data['title']);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['published_at'] = $data['is_published'] ? now() : null;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = FileUpload::uploadImage(
                $request->file('cover_image'),
                'blogs'
            );
        }

        BlogPost::create($data);

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blog): Response
    {
        return Inertia::render('Admin/Blogs/Form', [
            'post' => $blog->only([
                'id',
                'title',
                'slug',
                'excerpt',
                'content',
                'cover_image',
                'is_published',
            ]),
        ]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('blog_posts', 'slug')->ignore($blog->id),
            ],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $data['slug'] = ! empty($data['slug'])
            ? Str::slug($data['slug'])
            : Str::slug($data['title']);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);

        if (! $blog->published_at && $data['is_published']) {
            $data['published_at'] = now();
        } elseif (! $data['is_published']) {
            $data['published_at'] = null;
        }

        if ($request->hasFile('cover_image')) {
            if (! empty($blog->cover_image)) {
                FileUpload::deleteImage($blog->cover_image);
            }
            $data['cover_image'] = FileUpload::uploadImage(
                $request->file('cover_image'),
                'blogs'
            );
        } else {
            unset($data['cover_image']);
        }

        $blog->update($data);

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog)
    {
        if (! empty($blog->cover_image)) {
            FileUpload::deleteImage($blog->cover_image);
        }

        $blog->delete();

        return back()->with('success', 'Blog post deleted.');
    }
}
