<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'price',
        'weight',
        'weight_unit',
        'price_per_kg',
        'weight_packages',
        'image',
        'image_alt',
        'category_id',
        'description',
        'rating',
        'inventory',
        'is_active',
        'sort_order',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image',
    ];

    protected $casts = [
        'price' => 'integer',
        'weight' => 'float',
        'price_per_kg' => 'integer',
        'weight_packages' => 'array',
        'rating' => 'float',
        'is_active' => 'boolean',
        'inventory' => 'integer',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Favorite::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ProductComment::class);
    }

    public function approvedComments(): HasMany
    {
        return $this->hasMany(ProductComment::class)->where('is_approved', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    public function getTomanPriceAttribute(): float
    {
        return $this->price / 10;
    }
}
