<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'title' => 'محیط داخلی کافه',
                'slug' => 'interior-1',
                'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر محیط داخلی کافه با نورپردازی گرم',
                'category' => 'interior',
                'description' => 'فضای دنج و صمیمی کافه با نورپردازی گرم',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'میز باریستا',
                'slug' => 'barista-workspace',
                'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر میز کار باریستا با ابزارهای حرفه‌ای',
                'category' => 'staff',
                'description' => 'میز کار باریستا با اسپرسوساز حرفه‌ای',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'کاپوچینو هنری',
                'slug' => 'cappuccino-art',
                'image' => 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر کاپوچینو با لاته آرت زیبا',
                'category' => 'drinks',
                'description' => 'کاپوچینو با لاته آرت حرفه‌ای',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'ویترین شیرینی',
                'slug' => 'pastry-display',
                'image' => 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر ویترین شیرینی‌های تازه',
                'category' => 'food',
                'description' => 'ویترین شیرینی‌ها و دسرهای تازه روزانه',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'تراس بیرونی',
                'slug' => 'outdoor-terrace',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر تراس بیرونی کافه',
                'category' => 'interior',
                'description' => 'تراس بیرونی با فضای سبز و دلنشین',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'اسپرسو دوبل',
                'slug' => 'espresso-double',
                'image' => 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر اسپرسو دوبل با کرما',
                'category' => 'drinks',
                'description' => 'اسپرسو دوبل با کرما طلایی',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'title' => 'کیک شکلاتی',
                'slug' => 'chocolate-cake',
                'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر کیک شکلاتی خانگی',
                'category' => 'food',
                'description' => 'کیک شکلاتی تازه با روکش گاناش',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'title' => 'دانه‌های قهوه',
                'slug' => 'coffee-beans',
                'image' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر دانه‌های قهوه بوداده',
                'category' => 'beans',
                'description' => 'دانه‌های قهوه عربیکا بوداده تازه',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'title' => 'آیس لاته',
                'slug' => 'iced-latte',
                'image' => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر آیس لاته با یخ',
                'category' => 'drinks',
                'description' => 'آیس لاته خنک و گوارا',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'title' => 'محیط شبانه کافه',
                'slug' => 'night-ambiance',
                'image' => 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
                'image_alt' => 'تصویر محیط کافه در شب',
                'category' => 'interior',
                'description' => 'فضای دلنشین کافه در شب با نورهای رنگی',
                'sort_order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($items as $item) {
            Gallery::create($item);
        }
    }
}
