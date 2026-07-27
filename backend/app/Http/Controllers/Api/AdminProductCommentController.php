<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductCommentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductComment::with(['product:id,title,slug', 'user:id,name,email,phone'])
            ->latest();

        if ($request->filled('status')) {
            if ($request->status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_approved', false);
            }
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('author_name', 'like', '%'.$search.'%')
                    ->orWhere('body', 'like', '%'.$search.'%')
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('title', 'like', '%'.$search.'%');
                    });
            });
        }

        $comments = $query->paginate(20);

        return response()->json($comments);
    }

    public function show(ProductComment $productComment): JsonResponse
    {
        $productComment->load(['product:id,title,slug,image', 'user:id,name,email,phone']);

        return response()->json($productComment);
    }

    public function update(Request $request, ProductComment $productComment): JsonResponse
    {
        $validated = $request->validate([
            'is_approved' => 'sometimes|boolean',
            'body' => 'sometimes|string|min:3|max:2000',
            'rating' => 'sometimes|integer|min:1|max:5',
            'author_name' => 'sometimes|string|max:100',
        ]);

        $productComment->update($validated);

        if (array_key_exists('is_approved', $validated) || array_key_exists('rating', $validated)) {
            $this->refreshProductRating($productComment->product_id);
        }

        $productComment->load(['product:id,title,slug', 'user:id,name,email,phone']);

        return response()->json($productComment);
    }

    public function approve(ProductComment $productComment): JsonResponse
    {
        $productComment->update(['is_approved' => true]);
        $this->refreshProductRating($productComment->product_id);

        return response()->json([
            'message' => 'نظر تأیید شد.',
            'comment' => $productComment->fresh(['product:id,title,slug', 'user:id,name']),
        ]);
    }

    public function reject(ProductComment $productComment): JsonResponse
    {
        $productComment->update(['is_approved' => false]);
        $this->refreshProductRating($productComment->product_id);

        return response()->json([
            'message' => 'نظر به حالت در انتظار برگشت.',
            'comment' => $productComment->fresh(['product:id,title,slug', 'user:id,name']),
        ]);
    }

    public function destroy(ProductComment $productComment): JsonResponse
    {
        $productId = $productComment->product_id;
        $productComment->delete();
        $this->refreshProductRating($productId);

        return response()->json(['message' => 'نظر حذف شد.']);
    }

    private function refreshProductRating(int $productId): void
    {
        $product = Product::find($productId);
        if (! $product) {
            return;
        }

        $avg = $product->comments()->approved()->avg('rating');
        $product->update([
            'rating' => $avg !== null ? round((float) $avg, 1) : 0,
        ]);
    }
}
