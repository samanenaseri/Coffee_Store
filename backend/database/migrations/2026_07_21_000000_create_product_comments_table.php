<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_name', 100);
            $table->text('body');
            $table->unsignedTinyInteger('rating')->default(5); // 1-5
            $table->boolean('is_approved')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'is_approved']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_comments');
    }
};
