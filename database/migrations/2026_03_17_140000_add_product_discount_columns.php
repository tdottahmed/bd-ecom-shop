<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('has_discount')->default(false)->after('is_preorder');
            $table->string('discount_type', 20)->nullable()->after('has_discount'); // 'flat' | 'percentage'
            $table->decimal('discount_value', 10, 2)->nullable()->after('discount_type');
            $table->decimal('discounted_sale_price', 10, 2)->nullable()->after('discount_value');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['has_discount', 'discount_type', 'discount_value', 'discounted_sale_price']);
        });
    }
};
