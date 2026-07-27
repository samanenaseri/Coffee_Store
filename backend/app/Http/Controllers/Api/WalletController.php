<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(): JsonResponse
    {
        $wallet = auth('api')->user()->wallet;

        if (! $wallet) {
            $wallet = auth('api')->user()->wallet()->create([
                'balance' => 0,
                'currency' => 'IRR',
            ]);
        }

        return response()->json($wallet);
    }

    public function charge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1000',
        ]);

        $wallet = auth('api')->user()->wallet;

        if (! $wallet) {
            $wallet = auth('api')->user()->wallet()->create([
                'balance' => 0,
                'currency' => 'IRR',
            ]);
        }

        $wallet->increment('balance', $validated['amount']);

        $transaction = WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'charge',
            'direction' => 'credit',
            'status' => 'completed',
            'title' => 'شارژ کیف پول',
            'amount' => $validated['amount'],
        ]);

        return response()->json([
            'message' => 'Wallet charged successfully.',
            'wallet' => $wallet->fresh(),
            'transaction' => $transaction,
        ], 201);
    }

    public function transactions(Request $request): JsonResponse
    {
        $wallet = auth('api')->user()->wallet;

        if (! $wallet) {
            return response()->json([
                'current_page' => 1,
                'data' => [],
                'last_page' => 1,
                'total' => 0,
            ]);
        }

        $query = $wallet->transactions()->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->where('created_at', '<=', $request->to_date.' 23:59:59');
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }
}
