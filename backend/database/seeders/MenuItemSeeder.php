<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $hotDrinks = MenuCategory::where('slug', 'hot-drinks')->first();
        $coldDrinks = MenuCategory::where('slug', 'cold-drinks')->first();
        $desserts = MenuCategory::where('slug', 'desserts')->first();
        $special = MenuCategory::where('slug', 'special')->first();

        $items = [
            // Hot Drinks
            [
                'category_id' => $hotDrinks->id,
                'title' => 'اسپرسو دوبل',
                'description' => 'دو شات اسپرسو قوی و غلیظ',
                'price' => 200000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $hotDrinks->id,
                'title' => 'لاتچینو',
                'description' => 'لاته با دارچین و شکر قهوه‌ای',
                'price' => 230000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 2,
            ],
            [
                'category_id' => $hotDrinks->id,
                'title' => 'هات چاکلت',
                'description' => 'شکلات داغ با خامه و مارشمالو',
                'price' => 210000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 3,
            ],
            [
                'category_id' => $hotDrinks->id,
                'title' => 'چای سبز',
                'description' => 'چای سبز تازه با نعناع',
                'price' => 120000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 4,
            ],

            // Cold Drinks
            [
                'category_id' => $coldDrinks->id,
                'title' => 'آیس لاته',
                'description' => 'لاته سرد با یخ و شیر',
                'price' => 220000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $coldDrinks->id,
                'title' => 'اسموتی موز',
                'description' => 'اسموتی موز با بادام و عسل',
                'price' => 200000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 2,
            ],
            [
                'category_id' => $coldDrinks->id,
                'title' => 'آب نارگیل',
                'description' => 'آب نارگیل تازه و طبیعی',
                'price' => 150000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 3,
            ],
            [
                'category_id' => $coldDrinks->id,
                'title' => 'موهیتو',
                'description' => 'موهیتو نعناع با لیمو و سoda',
                'price' => 180000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 4,
            ],

            // Desserts
            [
                'category_id' => $desserts->id,
                'title' => 'براونی',
                'description' => 'براونی شکلاتی با گردو',
                'price' => 180000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $desserts->id,
                'title' => 'کیک هویج',
                'description' => 'کیک هویج با خامه پنیری',
                'price' => 200000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 2,
            ],
            [
                'category_id' => $desserts->id,
                'title' => 'کوکی شکلاتی',
                'description' => 'کوکی تازه با تکه‌های شکلات',
                'price' => 100000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 3,
            ],
            [
                'category_id' => $desserts->id,
                'title' => 'دسر موس',
                'description' => 'دسر موس شکلاتی تازه',
                'price' => 220000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 4,
            ],

            // Special
            [
                'category_id' => $special->id,
                'title' => 'قهوه دمی ویژه',
                'description' => 'قهوه دمی با روش ویژه و دانه اتیوپی',
                'price' => 280000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $special->id,
                'title' => 'لاتته آرت',
                'description' => 'لاته با هنر آرت روی فوم',
                'price' => 250000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => $special->id,
                'title' => 'اسپرسو مارتینی',
                'description' => 'اسپرسو با طعم وانیل و شکلات سفید',
                'price' => 260000,
                'is_available' => true,
                'is_popular' => false,
                'sort_order' => 3,
            ],
            [
                'category_id' => $special->id,
                'title' => 'چای ماسالا',
                'description' => 'چای ماسالای هندی با ادویه‌جات',
                'price' => 190000,
                'is_available' => true,
                'is_popular' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($items as $item) {
            MenuItem::create($item);
        }
    }
}
