<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::firstOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'About Us',
                'content' => '<p>Write something about your company here.</p>',
                'is_published' => true,
            ]
        );

        Page::firstOrCreate(
            ['slug' => 'contact-us'],
            [
                'title' => 'Contact Us',
                'content' => '<p>Add your contact information here.</p>',
                'is_published' => true,
            ]
        );
    }
}

