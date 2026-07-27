<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WalletSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $exists = DB::table('wallets')->where('user_id', $user->id)->exists();
            if (!$exists) {
                DB::table('wallets')->insert([
                    'user_id' => $user->id,
                    'balance' => 0,
                    'currency' => 'IRR',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
