<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->string('hero_layout', 20)->default('split-right')->after('hero_cta_url');
            $table->string('hero_bg_color', 20)->nullable()->after('hero_layout');
            $table->string('hero_text_color', 20)->nullable()->after('hero_bg_color');
            $table->string('global_bg_color', 20)->nullable()->after('accent_color');
            $table->string('global_font_family', 80)->nullable()->after('global_bg_color');
        });
    }

    public function down(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->dropColumn(['hero_layout', 'hero_bg_color', 'hero_text_color', 'global_bg_color', 'global_font_family']);
        });
    }
};
