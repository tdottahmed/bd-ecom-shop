<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier')->nullable()->after('status');          // steadfast | pathao
            $table->string('consignment_id')->nullable()->after('courier');  // courier-issued ID
            $table->string('tracking_code')->nullable()->after('consignment_id');
            $table->unsignedInteger('pathao_city_id')->nullable()->after('tracking_code');
            $table->unsignedInteger('pathao_zone_id')->nullable()->after('pathao_city_id');
            $table->unsignedInteger('pathao_area_id')->nullable()->after('pathao_zone_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['courier', 'consignment_id', 'tracking_code', 'pathao_city_id', 'pathao_zone_id', 'pathao_area_id']);
        });
    }
};
