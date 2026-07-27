<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use Illuminate\Database\Seeder;

class HomepageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            [
                'type' => 'hero',
                'title' => 'عطر قهوه',
                'subtitle' => 'هر فنجان، یک داستان',
                'description' => null,
                'content' => [
                    'mediaType' => 'video',
                    'videoSrc' => '/videos/scroll-video-final.mp4',
                    'imageSrc' => '',
                    'scrollHeight' => 500,
                ],
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'type' => 'about',
                'title' => 'طعم خوب لحظه ها با قهوه ی ناب',
                'subtitle' => null,
                'description' => 'قهوه فقط یک نوشیدنی نیست؛ برای خیلی‌ها شروع آرامِ یک روز شلوغ است. عطرش فضا را پر می‌کند و طعمش انگار چند دقیقه به آدم فرصت مکث و نفس کشیدن می‌دهد.',
                'content' => [
                    'secondaryImage' => '/images/circle.webp',
                    'experienceNumber' => 7,
                    'experienceLabel' => 'سال تجربه',
                    'drinks' => [
                        ['title' => 'دمنوش معطر', 'description' => 'نوشیدنی گرم و خوش‌عطری که حس آرامش و تازگی می‌دهد.', 'icon' => 'tea-cup'],
                        ['title' => 'اسپرسو', 'description' => 'قهوه‌ای غلیظ و پرانرژی با طعمی عمیق و ماندگار.', 'icon' => 'coffee-cup'],
                        ['title' => 'آیس کافی', 'description' => 'قهوه‌ای خنک و دل‌چسب، مناسب روزهای گرم.', 'icon' => 'cold-coffee'],
                        ['title' => 'لاته', 'description' => 'ترکیب لطیف قهوه و شیر با طعمی نرم و خامه‌ای.', 'icon' => 'cuppoccino'],
                    ],
                ],
                'image' => '/images/woman-coffee.jpg',
                'link' => null,
                'link_text' => null,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'type' => 'products',
                'title' => 'محصولات',
                'subtitle' => '',
                'description' => null,
                'content' => ['limit' => 4],
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'type' => 'services',
                'title' => 'خدمات',
                'subtitle' => null,
                'description' => null,
                'content' => [
                    'cards' => [
                        ['title' => 'سفارش قهوه', 'description' => 'انتخاب طعم دلخواهت و یک فنجان تازه، فقط چند قدم تا تو!', 'icon' => 'order'],
                        ['title' => 'ارسال فوری قهوه', 'description' => 'رسال فوری قهوه؛ طعم تازه و گرم، در کوتاه‌ترین زمان کنار تو!', 'icon' => 'fast-delivery'],
                        ['title' => 'تحویل قهوه', 'description' => 'تحویل قهوه؛ رساندن عطر و طعم تازه، درست تا دمِ در!', 'icon' => 'delivered'],
                    ],
                ],
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'type' => 'menu',
                'title' => 'منوی کافه',
                'subtitle' => 'دسته‌بندی موردنظر را انتخاب کنید',
                'description' => null,
                'content' => null,
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'type' => 'testimonials',
                'title' => 'نظر مشتریان ما',
                'subtitle' => 'تجربه مشتریان از خرید قهوه و محصولات ما',
                'description' => null,
                'content' => null,
                'image' => '/images/testimonal-bg.jpg',
                'link' => null,
                'link_text' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'type' => 'gallery',
                'title' => 'گالری عکس',
                'subtitle' => 'تصاویر فروشگاه و محصولات ما',
                'description' => null,
                'content' => ['limit' => 6],
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'type' => 'banner',
                'title' => 'بنر تصویری',
                'subtitle' => null,
                'description' => 'نوشیدن قهوه فقط چشیدن یک طعم نیست؛ انگار چند دقیقه آرامش را در یک فنجان نگه داشته‌ای. عطر گرم و طعم دلنشینش خستگی را کم می‌کند و حال‌وهوای روز را عوض می‌کند.',
                'content' => null,
                'image' => '/images/great-coffee-bean.jpeg',
                'link' => '/products',
                'link_text' => 'مشاهده محصولات',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'type' => 'articles',
                'title' => 'مقالات',
                'subtitle' => 'جدیدترین مقالات و نکات درباره قهوه',
                'description' => null,
                'content' => ['limit' => 5],
                'image' => null,
                'link' => null,
                'link_text' => null,
                'sort_order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($sections as $index => $section) {
            HomepageSection::updateOrCreate(
                ['type' => $section['type']],
                $section
            );
        }
    }
}
