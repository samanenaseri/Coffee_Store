<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tracking_code', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('email', 'like', '%' . $search . '%');
                    });
            });
        }

        $orders = $query->paginate(20);

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        try {
            $order->load(['items.product', 'user', 'statusHistory']);
        } catch (\Throwable $e) {
            // Fallback if history relation fails for any reason
            $order->load(['items.product', 'user']);
            $order->setRelation('statusHistory', collect());
        }

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,returned',
        ]);

        $order->update(['status' => $validated['status']]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'description' => '',
        ]);

        return response()->json($order->fresh(['items.product', 'user', 'statusHistory']));
    }

    public function updateActionStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'action_status' => 'required|string',
        ]);

        $action = $validated['action_status'];
        $payload = ['action_status' => $action];

        // Approving a cancel request should mark the order as cancelled
        if (in_array($action, ['cancel_approved', 'cancelled', 'canceled'], true)) {
            $payload['status'] = Order::STATUS_CANCELLED;
            $payload['action_status'] = 'cancel_approved';
        }

        // Approving a return marks order as returned
        if (in_array($action, ['return_approved', 'returned'], true)) {
            $payload['status'] = Order::STATUS_RETURNED;
            $payload['action_status'] = $action === 'returned' ? 'returned' : 'return_approved';
        }

        $order->update($payload);

        try {
            $historyStatus = $payload['status'] ?? $action;
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $historyStatus,
                'description' => 'به‌روزرسانی وضعیت درخواست توسط ادمین: '.$action,
            ]);
        } catch (\Throwable $e) {
            // ignore history failures
        }

        return response()->json($order->fresh(['items.product', 'user']));
    }

    public function updateTrackingCode(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'tracking_code' => 'required|string|max:255',
        ]);

        $order->update(['tracking_code' => $validated['tracking_code']]);

        return response()->json($order);
    }

    /**
     * Approve or reject card-to-card payment receipt.
     */
    public function reviewPayment(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'decision' => 'required|in:approved,rejected',
            'note' => 'nullable|string|max:500',
        ]);

        if ($order->payment_method !== 'card_to_card') {
            return response()->json([
                'message' => 'این سفارش کارت‌به‌کارت نیست.',
            ], 422);
        }

        if ($validated['decision'] === 'approved') {
            $order->update([
                'payment_review_status' => Order::PAYMENT_REVIEW_APPROVED,
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
            ]);
        } else {
            $order->update([
                'payment_review_status' => Order::PAYMENT_REVIEW_REJECTED,
                'payment_status' => Order::PAYMENT_STATUS_PENDING,
                'paid_at' => null,
            ]);
        }

        if (! empty($validated['note'])) {
            $order->update([
                'description' => trim(($order->description ? $order->description."\n" : '').'بررسی پرداخت: '.$validated['note']),
            ]);
        }

        return response()->json([
            'message' => $validated['decision'] === 'approved'
                ? 'پرداخت تأیید شد.'
                : 'پرداخت رد شد.',
            'data' => $order->fresh(['items.product', 'user']),
        ]);
    }
}
