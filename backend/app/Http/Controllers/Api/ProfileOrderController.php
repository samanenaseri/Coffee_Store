<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = auth('api')->user()->orders()->with('items.product')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Profile UI filters client-side by tab; load a larger page so cancelled
        // orders are not missing after the first 10 active ones.
        $perPage = min(max((int) $request->input('per_page', 50), 1), 100);
        $orders = $query->paginate($perPage);

        return response()->json($orders);
    }

    public function show($id): JsonResponse
    {
        $order = auth('api')
            ->user()
            ->orders()
            ->with(['items.product'])
            ->findOrFail($id);

        try {
            $order->load('statusHistory');
        } catch (\Throwable $e) {
            $order->setRelation('statusHistory', collect());
        }

        return response()->json(['order' => $order]);
    }

    public function reorder($id): JsonResponse
    {
        $order = auth('api')->user()->orders()->with('items')->findOrFail($id);

        $cartItems = $order->items->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
            ];
        });

        return response()->json([
            'message' => 'Order items retrieved for reorder.',
            'items' => $cartItems,
        ]);
    }

    public function cancel(Request $request, $id): JsonResponse
    {
        $order = auth('api')->user()->orders()->findOrFail($id);

        if (! $order->canCancel()) {
            return response()->json(['message' => 'This order cannot be cancelled.'], 422);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order->requestCancellation($validated['reason']);

        return response()->json([
            'message' => 'سفارش با موفقیت لغو شد.',
            'order' => $order->fresh()->load('items.product'),
        ]);
    }

    public function returnItem(Request $request, $id): JsonResponse
    {
        $order = auth('api')->user()->orders()->findOrFail($id);

        if (! $order->canReturn()) {
            return response()->json(['message' => 'This order cannot be returned.'], 422);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order->requestReturn($validated['reason']);

        return response()->json([
            'message' => 'درخواست مرجوعی ثبت شد و در حال بررسی است.',
            'order' => $order->fresh()->load('items.product'),
        ]);
    }
}
