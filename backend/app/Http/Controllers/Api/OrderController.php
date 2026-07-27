<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Normalize camelCase → snake_case for address/items so both clients work
        $payload = $this->normalizeOrderPayload($request->all());
        $request->merge($payload);

        $validated = $request->validate([
            'address' => 'required|array',
            'address.receiver_name' => 'required|string|max:100',
            'address.phone' => 'required|string|max:15',
            'address.province' => 'required|string|max:100',
            'address.city' => 'required|string|max:100',
            'address.postal_code' => 'required|string|max:10',
            'address.address' => 'required|string',

            'shipping' => 'required|array',
            'shipping.method' => 'required|string|in:post,express,pickup',
            'shipping.cost' => 'required|integer|min:0',

            'payment' => 'required|array',
            'payment.method' => 'required|string|in:online,cash_on_delivery,wallet,card_to_card',

            // Legacy weekdays OR new format: YYYY-MM-DD_morning|afternoon
            'delivery_day' => [
                'nullable',
                'string',
                'max:40',
                'regex:/^(saturday|sunday|monday|tuesday|wednesday|thursday|friday|\d{4}-\d{2}-\d{2}_(morning|afternoon))$/',
            ],
            'delivery_date' => 'nullable|date',
            'delivery_slot' => 'nullable|string|in:morning,afternoon',

            'use_wallet' => 'boolean',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'nullable|integer|min:0',
            // items_total = cart sum only (without shipping)
            'total' => 'required|integer|min:0',
        ], [
            'address.receiver_name.required' => 'نام گیرنده الزامی است.',
            'address.phone.required' => 'شماره تماس گیرنده الزامی است.',
            'address.province.required' => 'استان الزامی است.',
            'address.city.required' => 'شهر الزامی است.',
            'address.postal_code.required' => 'کد پستی الزامی است.',
            'address.address.required' => 'آدرس کامل الزامی است.',
            'items.required' => 'سبد خرید خالی است.',
        ]);

        $user = auth('api')->user();

        // Prefer DB prices when available
        $itemsTotal = 0;
        $normalizedItems = [];
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $unitPrice = $product ? (int) $product->price : (int) ($item['unit_price'] ?? 0);
            $qty = (int) $item['quantity'];
            $itemsTotal += $unitPrice * $qty;
            $normalizedItems[] = [
                'product_id' => (int) $item['product_id'],
                'quantity' => $qty,
                'unit_price' => $unitPrice,
            ];
        }

        $shippingCost = (int) $validated['shipping']['cost'];
        // Client may send cart-only total or cart+shipping; prefer server-computed items total
        $orderTotal = $itemsTotal + $shippingCost;

        $walletAmount = 0;
        $payableAmount = $orderTotal;

        if (! empty($validated['use_wallet']) && $user->wallet && $user->wallet->balance > 0) {
            $walletAmount = min((int) $user->wallet->balance, $orderTotal);
            $payableAmount = max($orderTotal - $walletAmount, 0);
        }

        $paymentMethod = $validated['payment']['method'];

        // If nothing left to pay, treat as wallet-paid
        if ($payableAmount === 0) {
            $paymentMethod = 'wallet';
        }

        $paymentStatus = Order::PAYMENT_STATUS_PENDING;
        if ($paymentMethod === 'wallet' || $payableAmount === 0) {
            $paymentStatus = Order::PAYMENT_STATUS_PAID;
        }

        $order = DB::transaction(function () use (
            $user,
            $validated,
            $normalizedItems,
            $shippingCost,
            $paymentMethod,
            $paymentStatus,
            $orderTotal,
            $walletAmount,
            $payableAmount,
        ) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => Order::STATUS_PENDING,
                'receiver_name' => $validated['address']['receiver_name'],
                'receiver_phone' => $validated['address']['phone'],
                'province' => $validated['address']['province'],
                'city' => $validated['address']['city'],
                'order_address' => $validated['address']['address'],
                'postal_code' => $validated['address']['postal_code'],
                'shipping_method' => $validated['shipping']['method'],
                'delivery_day' => $validated['delivery_day'] ?? null,
                'delivery_date' => $validated['delivery_date'] ?? $this->extractDeliveryDate($validated['delivery_day'] ?? null),
                'delivery_slot' => $validated['delivery_slot'] ?? $this->extractDeliverySlot($validated['delivery_day'] ?? null),
                'shipping_cost' => $shippingCost,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'total' => $orderTotal,
                'wallet_amount' => $walletAmount,
                'payable_amount' => $payableAmount,
            ]);

            foreach ($normalizedItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            if ($walletAmount > 0 && $user->wallet) {
                $user->wallet->decrement('balance', $walletAmount);
            }

            return $order;
        });

        $wallet = $user->wallet ? $user->wallet->fresh() : null;

        return response()->json([
            'message' => 'سفارش با موفقیت ثبت شد.',
            'data' => $order->load('items.product'),
            'wallet' => $wallet,
        ], 201);
    }

    /**
     * Accept both camelCase (frontend) and snake_case field names.
     */
    private function normalizeOrderPayload(array $input): array
    {
        if (isset($input['address']) && is_array($input['address'])) {
            $a = $input['address'];
            $input['address'] = [
                'receiver_name' => $a['receiver_name'] ?? $a['receiverName'] ?? null,
                'phone' => $a['phone'] ?? null,
                'province' => $a['province'] ?? null,
                'city' => $a['city'] ?? null,
                'postal_code' => $a['postal_code'] ?? $a['postalCode'] ?? null,
                'address' => $a['address'] ?? null,
            ];
        }

        if (isset($input['items']) && is_array($input['items'])) {
            $input['items'] = array_map(function ($item) {
                if (! is_array($item)) {
                    return $item;
                }

                return [
                    'product_id' => $item['product_id'] ?? $item['productId'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'unit_price' => $item['unit_price'] ?? $item['unitPrice'] ?? null,
                ];
            }, $input['items']);
        }

        if (array_key_exists('useWallet', $input) && ! array_key_exists('use_wallet', $input)) {
            $input['use_wallet'] = $input['useWallet'];
        }

        if (array_key_exists('deliveryDay', $input) && ! array_key_exists('delivery_day', $input)) {
            $input['delivery_day'] = $input['deliveryDay'];
        }

        return $input;
    }

    private function extractDeliveryDate(?string $deliveryDay): ?string
    {
        if (! $deliveryDay) {
            return null;
        }
        if (preg_match('/^(\d{4}-\d{2}-\d{2})_(morning|afternoon)$/', $deliveryDay, $m)) {
            return $m[1];
        }

        return null;
    }

    private function extractDeliverySlot(?string $deliveryDay): ?string
    {
        if (! $deliveryDay) {
            return null;
        }
        if (preg_match('/^\d{4}-\d{2}-\d{2}_(morning|afternoon)$/', $deliveryDay, $m)) {
            return $m[1];
        }

        return null;
    }
}
