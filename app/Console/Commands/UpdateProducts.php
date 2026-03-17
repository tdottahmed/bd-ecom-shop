<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UpdateProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update products from public/json/products-pw.json and apply additional cost settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = public_path('json/products-pw.json');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return;
        }

        $json = file_get_contents($filePath);
        $products = json_decode($json, true);

        if (!$products) {
            $this->error("Failed to decode JSON");
            return;
        }

        $additionalCost = get_setting('additional_cost', 0);
        $this->info("Found " . count($products) . " products. Starting update with Additional Cost: {$additionalCost}...");

        $bar = $this->output->createProgressBar(count($products));
        $bar->start();

        foreach ($products as $item) {
            try {
                // Parse Price JSON: "{\"12\":95,\"buy\":71,\"sell\":100}"
                $priceData = is_string($item['price']) ? json_decode($item['price'], true) : $item['price'];
                $buyPrice = $priceData['buy'] ?? 0;
                $sellPrice = $priceData['sell'] ?? 0;

                $purchasePrice = $buyPrice + $additionalCost;

                // Parse Images JSON: "[\"img1.png\", ...]"
                $images = is_string($item['images']) ? json_decode($item['images'], true) : $item['images'];

                // Handle Category
                $categoryId = $item['category_id'];

                if (is_null($categoryId)) {
                    $uncategorized = Category::firstOrCreate(
                        ['title' => 'Uncategorized'],
                        ['slug' => 'uncategorized', 'image' => null]
                    );
                    $categoryId = $uncategorized->id;
                }

                $createdAt = isset($item['created_at']) ? Carbon::createFromTimestamp($item['created_at'] / 1000) : now();

                $slug = Str::slug($item['title'] . '-' . $item['id']);

                Product::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'name' => $item['title'],
                        'slug' => $slug,
                        'category_id' => $categoryId,
                        'description' => $item['description'],
                        'purchase_price' => $purchasePrice,
                        'sale_price' => $sellPrice,
                        'stock' => $item['stock'] ?? 0,
                        'images' => $images,
                        'is_preorder' => isset($item['is_preorder']) ? (bool)$item['is_preorder'] : false,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );
            } catch (\Exception $e) {
                $this->error("Error updating product ID {$item['id']}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Products updated successfully.");
    }
}
