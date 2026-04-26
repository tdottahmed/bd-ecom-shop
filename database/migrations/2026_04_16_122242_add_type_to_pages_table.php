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
            $table->string('type')->default('custom')->after('slug');
        });

        // Seed the fixed legal pages if they don't already exist
        $legalPages = [
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'type' => 'legal',
                'content' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Terms & Conditions',
                'slug' => 'terms-conditions',
                'type' => 'legal',
                'content' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'type' => 'legal',
                'content' => null,
                'is_published' => true,
            ],
        ];

        foreach ($legalPages as $page) {
            DB::table('pages')->updateOrInsert(
                ['slug' => $page['slug']],
                array_merge($page, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    public function down(): void
    {
        DB::table('pages')->whereIn('slug', ['privacy-policy', 'terms-conditions', 'refund-policy'])
            ->where('type', 'legal')
            ->delete();

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
