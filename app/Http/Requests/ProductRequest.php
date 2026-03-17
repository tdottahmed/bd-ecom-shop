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
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $this->route('product')?->id,
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
            'variations.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'variations.*.deleted_image' => 'nullable|boolean',
            'is_preorder' => 'boolean',
            'has_discount' => 'nullable|boolean',
            'discount_type' => 'nullable|in:flat,percentage',
            'discount_value' => 'nullable|numeric|min:0',
            'discounted_sale_price' => 'nullable|numeric|min:0',
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
            'variations.*.attribute.required' => 'Attribute is required for variation.',
            'variations.*.value.required' => 'Value is required for variation.',
        ];
    }
}
