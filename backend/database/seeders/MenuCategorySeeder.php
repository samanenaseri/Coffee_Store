<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use Illuminate\Database\Seeder;

class MenuCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'title' => 'نوشیدنی‌های گرم',
                'slug' => 'hot-drinks',
                'description' => 'انواع قهوه‌ها و نوشیدنی‌های گرم',
                'icon' => '☕',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'نوشیدنی‌های سرد',
                'slug' => 'cold-drinks',
                'description' => 'نوشیدنی‌های سرد و خنک',
                'icon' => '🧊',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'دسرها',
                'slug' => 'desserts',
                'description' => 'دسرهای تازه و خانگی',
                'icon' => '🍰',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'ویژه',
                'slug' => 'special',
                'description' => 'پیشنهادات ویژه و نوشیدنی‌های خاص',
                'icon' => '⭐',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            MenuCategory::create($category);
        }
    }
}
