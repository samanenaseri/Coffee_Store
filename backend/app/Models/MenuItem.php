<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'is_available',
        'is_popular',
        'image',
        'sort_order',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_available' => 'boolean',
        'is_popular' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }
}
