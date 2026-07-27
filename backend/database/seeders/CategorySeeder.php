<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'title' => 'نوشیدنی‌های گرم',
                'slug' => 'hot-drinks',
                'description' => 'انواع قهوه‌ها و نوشیدنی‌های گرم با بهترین کیفیت',
                'icon' => '☕',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'نوشیدنی‌های سرد',
                'slug' => 'cold-drinks',
                'description' => 'نوشیدنی‌های سرد و خنک برای روزهای گرم',
                'icon' => '🧊',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'دسرها',
                'slug' => 'desserts',
                'description' => 'دسرهای خوشمزه و تازه روزانه',
                'icon' => '🍰',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'شیرینی‌ها',
                'slug' => 'pastries',
                'description' => 'شیرینی‌های تازه و خانگی',
                'icon' => '🥐',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'صبحانه',
                'slug' => 'breakfast',
                'description' => 'صبحانه‌های کامل و مقوی',
                'icon' => '🍳',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
