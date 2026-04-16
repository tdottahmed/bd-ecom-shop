<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->boolean('show_in_header')->default(false)->after('is_published');
            $table->boolean('show_in_footer')->default(false)->after('show_in_header');
        });

        // Keep existing UX until admins fine-tune links in CMS.
        DB::table('pages')
            ->whereIn('slug', ['about-us', 'contact-us'])
            ->update([
                'show_in_header' => true,
                'show_in_footer' => true,
                'updated_at' => now(),
            ]);

        DB::table('pages')
            ->whereIn('slug', ['privacy-policy', 'terms-and-conditions', 'terms-conditions', 'refund-policy'])
            ->update([
                'show_in_footer' => true,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['show_in_header', 'show_in_footer']);
        });
    }
};
