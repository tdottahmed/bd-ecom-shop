<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from public/json/products-pw.json';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Import Categories
        $categoriesFilePath = public_path('json/categories-pw.json');
        if (file_exists($categoriesFilePath)) {
            $this->info("Found categories file. Importing categories...");
            $categoriesJson = file_get_contents($categoriesFilePath);
            $categories = json_decode($categoriesJson, true);

            if ($categories) {
                foreach ($categories as $cat) {
                    \App\Models\Category::updateOrCreate(
                        ['id' => $cat['id']],
                        [
                            'title' => $cat['title'],
                            'slug' => \Illuminate\Support\Str::slug($cat['title']),
                            'image' => $cat['icon'] ?? null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
                $this->info("Imported " . count($categories) . " categories.");
            } else {
                $this->error("Failed to decode categories JSON");
            }
        } else {
            $this->warn("Categories file not found at: $categoriesFilePath");
        }

        // 2. Import Products
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

        $this->info("Found " . count($products) . " products. Starting import...");

        $bar = $this->output->createProgressBar(count($products));
        $bar->start();

        foreach ($products as $item) {
            try {
                // Parse Price JSON: "{\"12\":95,\"buy\":71,\"sell\":100}"
                $priceData = is_string($item['price']) ? json_decode($item['price'], true) : $item['price'];
                $buyPrice = $priceData['buy'] ?? 0;
                $sellPrice = $priceData['sell'] ?? 0;

                // Parse Images JSON: "[\"img1.png\", ...]"
                $images = is_string($item['images']) ? json_decode($item['images'], true) : $item['images'];

                // Handle Category
                $categoryId = $item['category_id'];

                if (is_null($categoryId)) {
                    $uncategorized = \App\Models\Category::firstOrCreate(
                        ['title' => 'Uncategorized'],
                        ['slug' => 'uncategorized', 'image' => null]
                    );
                    $categoryId = $uncategorized->id;
                }

                $createdAt = isset($item['created_at']) ? \Carbon\Carbon::createFromTimestamp($item['created_at'] / 1000) : now();

                $slug = \Illuminate\Support\Str::slug($item['title'] . '-' . $item['id']);

                \App\Models\Product::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'name' => $item['title'],
                        'slug' => $slug,
                        'category_id' => $categoryId,
                        'description' => $item['description'],
                        'purchase_price' => $buyPrice,
                        'sale_price' => $sellPrice,
                        'moq_price' => $sellPrice,
                        'uan_price' => $item['yuan'] ?? 0,
                        'stock' => $item['stock'] ?? 0,
                        'images' => $images,
                        'is_preorder' => isset($item['is_preorder']) ? (bool)$item['is_preorder'] : false,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );
            } catch (\Exception $e) {
                $this->error("Error importing product ID {$item['id']}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Products imported successfully.");
    }
}
