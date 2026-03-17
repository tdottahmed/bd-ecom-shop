<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['min_order_qty', 'add_cart_qty', 'use_add_cart_qty_as_min']);
            $table->boolean('is_featured')->default(true)->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_featured');
            $table->integer('min_order_qty')->default(3)->after('image');
            $table->integer('add_cart_qty')->nullable()->default(1)->after('min_order_qty');
            $table->boolean('use_add_cart_qty_as_min')->default(false)->after('add_cart_qty');
        });
    }
};
