<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $purchasePrice = $this->faker->numberBetween(100, 5000);
        $salePrice = $purchasePrice + ($purchasePrice * $this->faker->numberBetween(10, 50) / 100);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'images' => [], // Empty array, frontend helper handles null/empty
            'purchase_price' => $purchasePrice,
            'sale_price' => $salePrice,
            'moq_price' => $salePrice * 0.9, // 10% discount for MOQ
            'uan_price' => $salePrice * 0.95, // 5% discount for UAN
            'stock' => $this->faker->numberBetween(0, 100),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
        ];
    }
}
