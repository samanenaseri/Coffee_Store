<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_RETURNED = 'returned';

    const PAYMENT_STATUS_PENDING = 'pending';
    const PAYMENT_STATUS_PAID = 'paid';
    const PAYMENT_STATUS_FAILED = 'failed';
    const PAYMENT_STATUS_REFUNDED = 'refunded';

    const PAYMENT_REVIEW_PENDING = 'pending_review';
    const PAYMENT_REVIEW_APPROVED = 'approved';
    const PAYMENT_REVIEW_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'status',
        'action_status',
        'receiver_name',
        'receiver_phone',
        'province',
        'city',
        'order_address',
        'postal_code',
        'shipping_method',
        'delivery_day',
        'delivery_date',
        'delivery_slot',
        'shipping_cost',
        'tracking_code',
        'estimated_delivery',
        'delivered_at',
        'payment_method',
        'payment_status',
        'payment_review_status',
        'transaction_id',
        'card_transfer_amount',
        'card_transfer_ref',
        'card_transfer_date',
        'card_transfer_note',
        'card_transfer_submitted_at',
        'paid_at',
        'total',
        'wallet_amount',
        'payable_amount',
        'discount_amount',
        'tax_amount',
        'description',
        'cancel_reason',
        'cancel_requested_at',
        'return_reason',
        'return_requested_at',
    ];

    protected $casts = [
        'shipping_cost' => 'integer',
        'estimated_delivery' => 'datetime',
        'delivered_at' => 'datetime',
        'paid_at' => 'datetime',
        'delivery_date' => 'date',
        'card_transfer_amount' => 'integer',
        'card_transfer_date' => 'date',
        'card_transfer_submitted_at' => 'datetime',
        'total' => 'integer',
        'wallet_amount' => 'integer',
        'payable_amount' => 'integer',
        'discount_amount' => 'integer',
        'tax_amount' => 'integer',
        'cancel_requested_at' => 'datetime',
        'return_requested_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function canCancel(): bool
    {
        if (! in_array($this->status, [self::STATUS_PENDING, self::STATUS_PROCESSING], true)) {
            return false;
        }

        // Already cancelled or another action is in progress
        if (in_array($this->status, [self::STATUS_CANCELLED, self::STATUS_RETURNED], true)) {
            return false;
        }

        $action = (string) ($this->action_status ?? 'none');

        return $action === 'none' || $action === '';
    }

    public function canReturn(): bool
    {
        if ($this->status !== self::STATUS_DELIVERED) {
            return false;
        }

        $action = (string) ($this->action_status ?? 'none');

        return $action === 'none' || $action === '';
    }

    /**
     * Customer cancels order (only while pending/processing — see canCancel).
     * Sets status to cancelled so it appears under the «لغوشده» tab immediately.
     */
    public function requestCancellation(string $reason): void
    {
        $this->update([
            'cancel_reason' => $reason,
            'cancel_requested_at' => now(),
            'action_status' => 'cancel_approved',
            'status' => self::STATUS_CANCELLED,
        ]);

        try {
            OrderStatusHistory::create([
                'order_id' => $this->id,
                'status' => self::STATUS_CANCELLED,
                'description' => 'سفارش توسط مشتری لغو شد',
            ]);
        } catch (\Throwable $e) {
            // History table optional; cancellation still succeeds
        }
    }

    public function requestReturn(string $reason): void
    {
        $this->update([
            'return_reason' => $reason,
            'return_requested_at' => now(),
            'action_status' => 'return_requested',
        ]);

        try {
            OrderStatusHistory::create([
                'order_id' => $this->id,
                'status' => 'return_requested',
                'description' => 'درخواست مرجوعی توسط مشتری ثبت شد',
            ]);
        } catch (\Throwable $e) {
            // History table optional
        }
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->latest();
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function getTomanTotalAttribute(): float
    {
        return $this->total / 10;
    }

    public function getTomanShippingCostAttribute(): float
    {
        return $this->shipping_cost / 10;
    }

    public function getTomanWalletAmountAttribute(): float
    {
        return $this->wallet_amount / 10;
    }

    public function getTomanPayableAmountAttribute(): float
    {
        return $this->payable_amount / 10;
    }

    public function getTomanDiscountAmountAttribute(): float
    {
        return $this->discount_amount / 10;
    }

    public function getTomanTaxAmountAttribute(): float
    {
        return $this->tax_amount / 10;
    }
}
