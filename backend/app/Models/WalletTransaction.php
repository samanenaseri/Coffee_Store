<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory;

    const TYPE_DEPOSIT = 'deposit';
    const TYPE_PURCHASE = 'purchase';
    const TYPE_REFUND = 'refund';
    const TYPE_CHARGE = 'charge';
    const TYPE_COMMISSION = 'commission';

    protected $fillable = [
        'wallet_id',
        'type',
        'direction',
        'status',
        'title',
        'description',
        'amount',
        'order_id',
        'reference_id',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function getTomanAmountAttribute(): float
    {
        return $this->amount / 10;
    }
}
