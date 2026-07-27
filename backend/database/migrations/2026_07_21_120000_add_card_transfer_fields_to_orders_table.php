<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_review_status', 30)->nullable()->after('payment_status');
            $table->unsignedBigInteger('card_transfer_amount')->nullable()->after('transaction_id');
            $table->string('card_transfer_ref', 100)->nullable()->after('card_transfer_amount');
            $table->date('card_transfer_date')->nullable()->after('card_transfer_ref');
            $table->text('card_transfer_note')->nullable()->after('card_transfer_date');
            $table->timestamp('card_transfer_submitted_at')->nullable()->after('card_transfer_note');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_review_status',
                'card_transfer_amount',
                'card_transfer_ref',
                'card_transfer_date',
                'card_transfer_note',
                'card_transfer_submitted_at',
            ]);
        });
    }
};
