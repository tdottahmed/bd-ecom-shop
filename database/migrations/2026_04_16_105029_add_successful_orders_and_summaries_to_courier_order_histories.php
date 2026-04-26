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
        Schema::table('courier_order_histories', function (Blueprint $table) {
            $table->integer('successful_orders')->default(0)->after('cancel_orders');
            $table->json('summaries')->nullable()->after('data'); // normalised per-courier breakdown
        });
    }

    public function down(): void
    {
        Schema::table('courier_order_histories', function (Blueprint $table) {
            $table->dropColumn(['successful_orders', 'summaries']);
        });
    }
};
