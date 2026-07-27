<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('status', 20)->default('pending');
            $table->string('action_status', 30)->default('none');
            $table->string('receiver_name', 100);
            $table->string('receiver_phone', 11);
            $table->string('province', 100);
            $table->string('city', 100);
            $table->text('order_address');
            $table->string('postal_code', 10);
            $table->string('shipping_method', 50);
            $table->unsignedBigInteger('shipping_cost')->default(0);
            $table->string('tracking_code', 100)->nullable();
            $table->timestamp('estimated_delivery')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('payment_method', 30);
            $table->string('payment_status', 20)->default('pending');
            $table->string('transaction_id', 100)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->unsignedBigInteger('total');
            $table->unsignedBigInteger('wallet_amount')->default(0);
            $table->unsignedBigInteger('payable_amount');
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('tax_amount')->default(0);
            $table->text('description')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->timestamp('cancel_requested_at')->nullable();
            $table->text('return_reason')->nullable();
            $table->timestamp('return_requested_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
