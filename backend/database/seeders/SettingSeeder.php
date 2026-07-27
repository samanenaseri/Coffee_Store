<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'store_name',
                'value' => 'کافه استور',
            ],
            [
                'key' => 'store_slogan',
                'value' => 'طعمی متفاوت از زندگی',
            ],
            [
                'key' => 'store_logo',
                'value' => '',
            ],
            [
                'key' => 'store_phone',
                'value' => '02112345678',
            ],
            [
                'key' => 'store_mobile',
                'value' => '09121234567',
            ],
            [
                'key' => 'store_email',
                'value' => 'info@coffee-store.com',
            ],
            [
                'key' => 'store_address',
                'value' => 'تهران، خیابان ولیعصر، نبش کوچه گل',
            ],
            [
                'key' => 'store_address_en',
                'value' => 'Tehran, Vali-e-Asr St., Gol Alley',
            ],
            [
                'key' => 'store_working_hours',
                'value' => '۸ صبح تا ۱۲ شب',
            ],
            [
                'key' => 'store_instagram',
                'value' => '@coffeestore_ir',
            ],
            [
                'key' => 'store_telegram',
                'value' => '@coffeestore',
            ],
            [
                'key' => 'store_description',
                'value' => 'کافه استور با بیش از ۵ سال تجربه، بهترین قهوه‌ها و دسرهای تازه را با کیفیت بالا و قیمت مناسب ارائه می‌دهد.',
            ],
            [
                'key' => 'min_order_amount',
                'value' => '500000',
            ],
            [
                'key' => 'delivery_fee',
                'value' => '50000',
            ],
            [
                'key' => 'free_delivery_threshold',
                'value' => '1000000',
            ],
            [
                'key' => 'store_currency',
                'value' => 'IRR',
            ],
            [
                'key' => 'footer_background',
                'value' => '/images/footer.webp',
            ],
            [
                'key' => 'footer_links',
                'value' => json_encode([
                    ['label' => 'محصولات', 'url' => '/products'],
                    ['label' => 'درباره ما', 'url' => '/about'],
                    ['label' => 'تماس با ما', 'url' => '/contact'],
                ]),
            ],
            [
                'key' => 'header_links',
                'value' => json_encode([
                    ['label' => 'خانه', 'url' => '/'],
                    ['label' => 'محصولات', 'url' => '/products'],
                    ['label' => 'مقالات', 'url' => '/articles'],
                    ['label' => 'درباره ما', 'url' => '/about'],
                    ['label' => 'تماس', 'url' => '/contact'],
                ]),
            ],
            // About page
            [
                'key' => 'about_title',
                'value' => 'درباره ما',
            ],
            [
                'key' => 'about_description',
                'value' => 'ما یک فروشگاه تخصصی قهوه هستیم که با افتخار بهترین دانه‌های قهوه را از نقاط مختلف جهان انتخاب و به شما عزیزان ارائه می‌دهیم. باور ما این است که یک فنجان قهوه خوب، حاصل انتخاب دقیق، کیفیت بالا و توجه به جزئیات است.

به همین دلیل، کیفیت و تازگی محصولات برای ما در اولویت قرار دارد و تلاش می‌کنیم بهترین تجربه را برای دوستداران قهوه فراهم کنیم. مجموعه ما با ارائه انواع دانه‌های قهوه، نوشیدنی‌های بر پایه قهوه و محصولات مرتبط، فضایی را ایجاد کرده است تا هر فرد بتواند طعم مورد علاقه خود را پیدا کند.

هدف ما تنها فروش قهوه نیست؛ بلکه می‌خواهیم لحظاتی دلنشین و خاطره‌انگیز را در کنار عطر و طعم بی‌نظیر قهوه برای شما رقم بزنیم. رضایت مشتریان، ارائه محصولات باکیفیت و حفظ استانداردهای حرفه‌ای، ارزش‌هایی هستند که همواره به آن‌ها پایبند بوده‌ایم.',
            ],
            [
                'key' => 'about_main_image',
                'value' => '/images/about/about-main.jpg',
            ],
            [
                'key' => 'about_second_image',
                'value' => '/images/about/about-second.jpg',
            ],
            [
                'key' => 'about_staff_heading',
                'value' => 'تیم ما',
            ],
            [
                'key' => 'about_staff_description',
                'value' => 'با اعضای حرفه‌ای قهوه‌فروشی ما آشنا شوید',
            ],
            // Contact page
            [
                'key' => 'contact_hero_image',
                'value' => '/images/cup-about.png',
            ],
            [
                'key' => 'contact_title',
                'value' => 'تماس با ما',
            ],
            [
                'key' => 'contact_hero_description',
                'value' => 'اگر سوالی درباره محصولات، سفارش‌ها یا انتخاب قهوه مناسب دارید، خوشحال می‌شویم با ما در ارتباط باشید.',
            ],
            [
                'key' => 'contact_info_title',
                'value' => 'اطلاعات تماس',
            ],
            [
                'key' => 'contact_info_description',
                'value' => 'برای ثبت سفارش، پیگیری خرید یا دریافت مشاوره انتخاب قهوه، از راه‌های زیر با ما در ارتباط باشید.',
            ],
            [
                'key' => 'contact_form_title',
                'value' => 'ارسال پیام',
            ],
            [
                'key' => 'contact_form_description',
                'value' => 'پیامتون رو از این قسمت برای ما ارسال کنید.',
            ],
            [
                'key' => 'contact_map_background',
                'value' => '/images/footer.webp',
            ],
            [
                'key' => 'contact_map_title',
                'value' => 'موقعیت فروشگاه روی نقشه',
            ],
            [
                'key' => 'contact_map_description',
                'value' => 'بعداً می‌تونی این قسمت رو با Google Map یا Leaflet جایگزین کنی.',
            ],
            // SEO Settings
            [
                'key' => 'site_url',
                'value' => 'https://coffee-store.example.com',
            ],
            [
                'key' => 'default_meta_title',
                'value' => 'کافه استور | فروشگاه تخصصی قهوه',
            ],
            [
                'key' => 'default_meta_description',
                'value' => 'کافه استور با بیش از ۵ سال تجربه، بهترین قهوه‌ها و دسرهای تازه را با کیفیت بالا و قیمت مناسب ارائه می‌دهد.',
            ],
            [
                'key' => 'default_og_image',
                'value' => '/images/og-image.jpg',
            ],
            [
                'key' => 'site_favicon',
                'value' => '/favicon.ico',
            ],
            [
                'key' => 'google_analytics_id',
                'value' => '',
            ],
            [
                'key' => 'google_search_console_id',
                'value' => '',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
