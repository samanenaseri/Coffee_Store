<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            MenuCategorySeeder::class,
            MenuItemSeeder::class,
            ArticleSeeder::class,
            GallerySeeder::class,
            StaffSeeder::class,
            TestimonialSeeder::class,
            SettingSeeder::class,
            HomepageSectionSeeder::class,
        ]);
    }
}
