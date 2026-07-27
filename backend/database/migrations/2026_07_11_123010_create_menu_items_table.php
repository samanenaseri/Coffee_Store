<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('menu_categories')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price');
            $table->boolean('is_available')->default(true);
            $table->boolean('is_popular')->default(false);
            $table->string('image', 500)->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
