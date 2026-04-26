<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variations', function (Blueprint $table) {
            $table->string('discount_type')->nullable()->after('price');
            $table->double('discount_value', 8, 2)->nullable()->after('discount_type');
            $table->double('discounted_price', 8, 2)->nullable()->after('discount_value');
        });
    }

    public function down(): void
    {
        Schema::table('product_variations', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value', 'discounted_price']);
        });
    }
};
