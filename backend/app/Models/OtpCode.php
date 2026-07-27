<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OtpCode extends Model
{
    protected $fillable = [
        'phone',
        'code',
        'type',
        'expires_at',
        'used_at',
        'attempts',
        'ip',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'attempts' => 'integer',
    ];

    public function scopeUnused(Builder $query): Builder
    {
        return $query->whereNull('used_at');
    }

    public function scopeNotExpired(Builder $query): Builder
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeByPhone(Builder $query, string $phone): Builder
    {
        return $query->where('phone', $phone);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function markUsed(): void
    {
        $this->update(['used_at' => now()]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isUsable(): bool
    {
        return is_null($this->used_at) && !$this->isExpired() && $this->attempts < 3;
    }
}
