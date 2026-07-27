<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    use HasFactory;

    /** Actual table name (not Laravel's pluralized default) */
    protected $table = 'order_status_history';

    protected $fillable = [
        'order_id',
        'status',
        'description',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
