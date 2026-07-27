<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $seoColumns = function (Blueprint $table) {
            $table->string('meta_title', 255)->nullable()->after('slug');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('og_title', 255)->nullable()->after('meta_description');
            $table->text('og_description')->nullable()->after('og_title');
            $table->string('og_image', 500)->nullable()->after('og_description');
        };

        Schema::table('products', $seoColumns);
        Schema::table('articles', $seoColumns);
        Schema::table('categories', $seoColumns);
        Schema::table('gallery', $seoColumns);
        Schema::table('menu_categories', $seoColumns);

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('slug', 200)->nullable()->unique()->after('title');
            $table->string('meta_title', 255)->nullable()->after('slug');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('og_title', 255)->nullable()->after('meta_description');
            $table->text('og_description')->nullable()->after('og_title');
            $table->string('og_image', 500)->nullable()->after('og_description');
        });
    }

    public function down(): void
    {
        $removeColumns = function (Blueprint $table) {
            $table->dropColumn([
                'meta_title', 'meta_description',
                'og_title', 'og_description', 'og_image',
            ]);
        };

        Schema::table('products', $removeColumns);
        Schema::table('articles', $removeColumns);
        Schema::table('categories', $removeColumns);
        Schema::table('gallery', $removeColumns);
        Schema::table('menu_categories', $removeColumns);

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'meta_title', 'meta_description',
                'og_title', 'og_description', 'og_image',
            ]);
        });
    }
};
