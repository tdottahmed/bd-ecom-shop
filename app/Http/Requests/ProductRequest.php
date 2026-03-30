<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product');
        if (is_object($productId)) {
            $productId = $productId->id;
        }

        return [
            'product_type' => 'required|in:single,variant',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . ($productId ?? 'NULL'),
            'description' => 'required|string',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',

            'stock' => 'nullable|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'qty_prices' => 'sometimes|array',
            'qty_prices.*.qty' => 'required|integer|min:1',
            'qty_prices.*.qty_price' => 'required|numeric|min:0',
            'deleted_images' => 'nullable|array',
            'variations' => 'nullable|array',
            'variations.*.id' => 'nullable',
            'variations.*.attribute_id' => 'required_with:variations|exists:product_attributes,id',
            'variations.*.value' => 'required_with:variations|string',
            'variations.*.stock' => 'nullable|integer|min:0',
            'variations.*.price' => 'nullable|numeric|min:0',
            'variations.*.image' => 'nullable', // Removed 'image' rule here as it fails on existing path strings; Controller handles file check
            'variations.*.deleted_image' => 'nullable|boolean',
            'is_preorder' => 'boolean',
            'has_discount' => 'nullable|boolean',
            'discount_type' => 'nullable|in:flat,percentage',
            'discount_value' => 'nullable|numeric|min:0',
            'discounted_sale_price' => 'nullable|numeric|min:0',
            'short_description' => 'nullable|string|max:500',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'og_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'delete_og_image' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.required' => 'The product slug is required.',
            'slug.unique' => 'The product slug has already been taken.',
            'images.required' => 'At least one product image is required.',
            'images.min' => 'Please upload at least one product image.',
            'qty_prices.*.qty.required' => 'Quantity is required for quantity pricing.',
            'qty_prices.*.qty_price.required' => 'Price is required for quantity pricing.',
            'variations.*.attribute_id.required' => 'Attribute is required for variation.',
            'variations.*.value.required' => 'Value is required for variation.',
        ];
    }
}
