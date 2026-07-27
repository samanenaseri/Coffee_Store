<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->unsignedBigInteger('price');
            $table->string('image', 500)->nullable();
            $table->string('image_alt', 200)->default('');
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->text('description')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('inventory')->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('slug');
            $table->index('category_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
