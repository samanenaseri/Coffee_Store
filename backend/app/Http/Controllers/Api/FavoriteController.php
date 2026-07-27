<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;

class FavoriteController extends Controller
{
    public function index(): JsonResponse
    {
        $favorites = auth('api')
            ->user()
            ->favorites()
            ->with('product')
            ->paginate(20);

        return response()->json($favorites);
    }

    public function toggle($productId): JsonResponse
    {
        $userId = auth('api')->id();

        $favorite = Favorite::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($favorite) {
            $favorite->delete();
            $status = 'removed';
        } else {
            Favorite::create(['user_id' => $userId, 'product_id' => $productId]);
            $status = 'added';
        }

        return response()->json([
            'status' => $status,
            'total' => Favorite::where('user_id', $userId)->count(),
        ]);
    }

    public function check($productId): JsonResponse
    {
        $exists = Favorite::where('user_id', auth('api')->id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['exists' => $exists]);
    }
}
