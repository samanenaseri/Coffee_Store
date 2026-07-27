<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderPaymentController extends Controller
{
    /**
     * Customer: submit card-to-card transfer receipt for an order.
     */
    public function submitCardTransfer(Request $request, int $id): JsonResponse
    {
        $order = auth('api')->user()->orders()->findOrFail($id);

        // Accept card_to_card (and legacy "online" mapped to offline transfer)
        if (! in_array($order->payment_method, ['card_to_card', 'online'], true)) {
            return response()->json([
                'message' => 'این سفارش روش پرداخت کارت‌به‌کارت ندارد.',
            ], 422);
        }

        if ($order->payment_status === Order::PAYMENT_STATUS_PAID) {
            return response()->json([
                'message' => 'پرداخت این سفارش قبلاً تأیید شده است.',
            ], 422);
        }

        if ($order->payment_review_status === 'pending_review') {
            return response()->json([
                'message' => 'رسید واریز شما قبلاً ثبت شده و در انتظار بررسی مدیر است.',
                'data' => $order,
            ], 422);
        }

        $validated = $request->validate([
            'amount' => 'required|integer|min:1000',
            'transaction_ref' => 'required|string|min:3|max:100',
            'transfer_date' => 'required|date|before_or_equal:today',
            'note' => 'nullable|string|max:500',
        ], [
            'amount.required' => 'مبلغ واریزی الزامی است.',
            'transaction_ref.required' => 'شماره تراکنش / پیگیری الزامی است.',
            'transfer_date.required' => 'تاریخ واریز الزامی است.',
        ]);

        $order->update([
            'payment_method' => 'card_to_card',
            'card_transfer_amount' => $validated['amount'],
            'card_transfer_ref' => $validated['transaction_ref'],
            'card_transfer_date' => $validated['transfer_date'],
            'card_transfer_note' => $validated['note'] ?? null,
            'card_transfer_submitted_at' => now(),
            'payment_review_status' => 'pending_review',
            'payment_status' => Order::PAYMENT_STATUS_PENDING,
            'transaction_id' => $validated['transaction_ref'],
        ]);

        return response()->json([
            'message' => 'اطلاعات واریز ثبت شد و پس از تأیید مدیر، پرداخت سفارش تکمیل می‌شود.',
            'data' => $order->fresh()->load('items.product'),
        ]);
    }
}
