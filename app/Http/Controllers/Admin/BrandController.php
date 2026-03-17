<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BrandRequest;
use App\Models\Brand;
use App\Utility\FileUpload;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withCount('products')
            ->latest()
            ->get();

        return inertia('Admin/Brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Brands/Create');
    }

    public function store(BrandRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = FileUpload::uploadImage(
                $request->file('image'),
                'brands'
            );
        }

        Brand::create($data);

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function edit(Brand $brand)
    {
        return inertia('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($brand->image) {
                FileUpload::deleteImage($brand->image);
            }
            $data['image'] = FileUpload::uploadImage(
                $request->file('image'),
                'brands'
            );
        } else {
            unset($data['image']);
        }

        $brand->update($data);

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->image) {
            FileUpload::deleteImage($brand->image);
        }

        $brand->delete();

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }
}
