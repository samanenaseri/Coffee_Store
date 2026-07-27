<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            [
                'name' => 'امیر رضایی',
                'role' => 'باریستا ارشد',
                'description' => 'امیر با بیش از ۸ سال تجربه در زمینه قهوه، باریستای ارشد ماست. او در مسابقات ملی باریستایی مقام اول را کسب کرده است.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                'instagram' => '@amir_barista',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'سارا احمدی',
                'role' => 'سرآشپز دسر',
                'description' => 'سارا فارغ‌التحصیل رشته قنادی از آکادمی پاریس است و با خلاقیت خود بهترین دسرها را تهیه می‌کند.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                'instagram' => '@sara_pastry',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'محمد کریمی',
                'role' => 'مدیر فروشگاه',
                'description' => 'محمد با عشق به قهوه و مهمان‌نوازی، فروشگاه را با بهترین کیفیت اداره می‌کند.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                'instagram' => '@mohammad_manager',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'نیلوفر شریفی',
                'role' => 'باریستا',
                'description' => 'نیلوفر با مهارت در لاته آرت و علاقه به قهوه، بهترین نوشیدنی‌ها را تهیه می‌کند.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                'instagram' => '@niloofar_barista',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'رضا عباسی',
                'role' => 'باریستا',
                'description' => 'رضا علاقه‌مند به روش‌های نوین دم‌آوری قهوه است و همیشه بهترین طعم را ارائه می‌دهد.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                'instagram' => '@reza_barista',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($staff as $member) {
            Staff::create($member);
        }
    }
}
