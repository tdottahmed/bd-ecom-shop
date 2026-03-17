<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'uan_price')) {
                $table->dropColumn('uan_price');
            }
            if (Schema::hasColumn('products', 'moq_price')) {
                $table->dropColumn('moq_price');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'uan_price')) {
                $table->double('uan_price', 8, 2)->default(0)->after('sale_price');
            }
            if (!Schema::hasColumn('products', 'moq_price')) {
                $table->double('moq_price', 8, 2)->default(0)->after('sale_price');
            }
        });
    }
};

