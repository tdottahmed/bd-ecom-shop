<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('page_title');
            $table->text('meta_description')->nullable();

            // Hero
            $table->string('hero_headline');
            $table->string('hero_subheadline')->nullable();
            $table->string('hero_badge')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('hero_cta_text')->default('Order Now');
            $table->string('hero_cta_url')->nullable();

            // Theme
            $table->string('accent_color')->default('#2DE3A7');

            // Content sections (flexible JSON blocks)
            $table->json('sections')->nullable();

            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_pages');
    }
};
