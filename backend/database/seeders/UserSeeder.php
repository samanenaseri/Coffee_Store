<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'مدیر فروشگاه',
            'email' => 'admin@coffee-store.com',
            'password' => Hash::make('password'),
            'phone' => '09121234567',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        $users = [
            [
                'name' => 'علی محمدی',
                'email' => 'ali@example.com',
                'password' => Hash::make('password'),
                'phone' => '09121111111',
                'is_admin' => false,
                'email_verified_at' => now(),
                'wallet_balance' => 500000,
            ],
            [
                'name' => 'زهرا کریمی',
                'email' => 'zahra@example.com',
                'password' => Hash::make('password'),
                'phone' => '09122222222',
                'is_admin' => false,
                'email_verified_at' => now(),
                'wallet_balance' => 750000,
            ],
            [
                'name' => 'رضا حسینی',
                'email' => 'reza@example.com',
                'password' => Hash::make('password'),
                'phone' => '09123333333',
                'is_admin' => false,
                'email_verified_at' => now(),
                'wallet_balance' => 300000,
            ],
        ];

        foreach ($users as $userData) {
            $balance = $userData['wallet_balance'];
            unset($userData['wallet_balance']);

            $user = User::create($userData);

            Wallet::create([
                'user_id' => $user->id,
                'balance' => $balance,
                'currency' => 'IRR',
            ]);
        }
    }
}
