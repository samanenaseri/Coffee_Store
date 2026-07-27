<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'سارا جعفری',
                'role' => 'مشتری دائمی',
                'comment' => 'بهترین کافه‌ای که تا حالا رفتم! قهوه‌شون فوق‌العاده‌ست و محیطشون خیلی دنج و آرامش‌بخشه. حتماً پیشنهاد می‌کنم.',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'امیر حسینی',
                'role' => 'عکاس',
                'comment' => 'محیط کافه خیلی خوشگله و برای عکاسی عالیه. قهوه‌شون هم بی‌نظیره. همیشه اینجا میام.',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'مریم نوری',
                'role' => 'دانشجو',
                'comment' => 'کاپوچینوی اینجا عالیه! هر روز صبح قبل از کلاس اینجا میام. قیمت‌هاشون هم مناسبه.',
                'rating' => 4,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'رضا محمدی',
                'role' => 'کارمند',
                'comment' => 'محیط کاری خوبی برای ریموت‌ورک. اینترنت پرسرعت و قهوه عالی. پیشنهاد می‌کنم.',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'زهرا کاظمی',
                'role' => 'نویسنده',
                'comment' => 'دسرهای اینجا دست‌کمی از قنادی‌های اروپایی نداره. کیک شکلاتیشون رو خیلی دوست دارم.',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'علی رضایی',
                'role' => 'مشتری جدید',
                'comment' => 'اولین بارم بود اینجا میومدم و خیلی راضی بودم. برخورد کارکنان خیلی محترمانه بود و قهوه‌شون عالی.',
                'rating' => 4,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
