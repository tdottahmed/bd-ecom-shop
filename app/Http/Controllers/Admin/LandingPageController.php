<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use App\Models\Product;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LandingPageController extends Controller
{
    public function index()
    {
        $pages = LandingPage::with('product:id,name')
            ->latest()
            ->get(['id', 'product_id', 'slug', 'page_title', 'is_published', 'created_at']);

        return inertia('Admin/LandingPages/Index', ['pages' => $pages]);
    }

    public function create()
    {
        $products = Product::select('id', 'name')->orderBy('name')->get();
        return inertia('Admin/LandingPages/Builder', ['products' => $products, 'page' => null]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'page_title'       => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:landing_pages,slug|regex:/^[a-z0-9\-]+$/',
            'meta_description' => 'nullable|string|max:500',
            'product_id'       => 'nullable|exists:products,id',
            'hero_headline'    => 'required|string|max:255',
            'hero_subheadline' => 'nullable|string|max:500',
            'hero_badge'       => 'nullable|string|max:100',
            'hero_image'       => 'nullable|image|max:4096',
            'hero_cta_text'    => 'nullable|string|max:100',
            'hero_cta_url'     => 'nullable|string|max:500',
            'accent_color'     => 'nullable|string|max:20',
            'sections'         => 'nullable|string',
        ]);

        if ($request->hasFile('hero_image')) {
            $validated['hero_image'] = FileUpload::uploadImage($request->file('hero_image'), 'landing-pages/heroes');
        }

        $validated['sections'] = $request->input('sections')
            ? json_decode($request->input('sections'), true)
            : [];

        LandingPage::create($validated);

        return redirect()->route('admin.landing-pages.index')
            ->with('success', 'Landing page created successfully.');
    }

    public function edit(LandingPage $landingPage)
    {
        $products = Product::select('id', 'name')->orderBy('name')->get();
        return inertia('Admin/LandingPages/Builder', [
            'products' => $products,
            'page'     => $landingPage,
        ]);
    }

    public function update(Request $request, LandingPage $landingPage)
    {
        $validated = $request->validate([
            'page_title'       => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:landing_pages,slug,' . $landingPage->id . '|regex:/^[a-z0-9\-]+$/',
            'meta_description' => 'nullable|string|max:500',
            'product_id'       => 'nullable|exists:products,id',
            'hero_headline'    => 'required|string|max:255',
            'hero_subheadline' => 'nullable|string|max:500',
            'hero_badge'       => 'nullable|string|max:100',
            'hero_image'       => 'nullable|image|max:4096',
            'hero_cta_text'    => 'nullable|string|max:100',
            'hero_cta_url'     => 'nullable|string|max:500',
            'accent_color'     => 'nullable|string|max:20',
            'sections'         => 'nullable|string',
        ]);

        if ($request->hasFile('hero_image')) {
            if ($landingPage->hero_image) {
                Storage::disk('public')->delete($landingPage->hero_image);
            }
            $validated['hero_image'] = FileUpload::uploadImage($request->file('hero_image'), 'landing-pages/heroes');
        } else {
            unset($validated['hero_image']);
        }

        $validated['sections'] = $request->input('sections')
            ? json_decode($request->input('sections'), true)
            : [];

        $landingPage->update($validated);

        return redirect()->route('admin.landing-pages.index')
            ->with('success', 'Landing page updated successfully.');
    }

    public function destroy(LandingPage $landingPage)
    {
        if ($landingPage->hero_image) {
            Storage::disk('public')->delete($landingPage->hero_image);
        }
        $landingPage->delete();

        return back()->with('success', 'Landing page deleted.');
    }

    public function togglePublish(LandingPage $landingPage)
    {
        $landingPage->update(['is_published' => !$landingPage->is_published]);

        return back()->with('success', $landingPage->is_published ? 'Published.' : 'Unpublished.');
    }

    /** Dedicated image upload endpoint used by section editors */
    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|max:4096']);

        $path = FileUpload::uploadImage($request->file('image'), 'landing-pages/media');

        return response()->json(['url' => Storage::url($path)]);
    }
}
