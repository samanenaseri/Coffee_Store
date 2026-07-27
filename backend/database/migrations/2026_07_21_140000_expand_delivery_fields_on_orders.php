<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'delivery_date')) {
                $table->date('delivery_date')->nullable()->after('delivery_day');
            }
            if (! Schema::hasColumn('orders', 'delivery_slot')) {
                $table->string('delivery_slot', 20)->nullable()->after('delivery_date');
            }
        });

        // Expand delivery_day length for values like 2026-07-28_afternoon
        try {
            $driver = Schema::getConnection()->getDriverName();
            if ($driver === 'mysql') {
                DB::statement('ALTER TABLE orders MODIFY delivery_day VARCHAR(40) NULL');
            } elseif ($driver === 'pgsql') {
                DB::statement('ALTER TABLE orders ALTER COLUMN delivery_day TYPE VARCHAR(40)');
            }
            // sqlite: ignore type length
        } catch (\Throwable $e) {
            // non-fatal
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'delivery_slot')) {
                $table->dropColumn('delivery_slot');
            }
            if (Schema::hasColumn('orders', 'delivery_date')) {
                $table->dropColumn('delivery_date');
            }
        });
    }
};
