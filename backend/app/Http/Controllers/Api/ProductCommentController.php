<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCommentController extends Controller
{
    /**
     * Public: list approved comments for a product (by slug).
     */
    public function index(string $slug): JsonResponse
    {
        $product = Product::active()->where('slug', $slug)->firstOrFail();

        $comments = $product->comments()
            ->approved()
            ->latestFirst()
            ->paginate(10);

        $avg = (float) $product->comments()->approved()->avg('rating');
        $count = (int) $product->comments()->approved()->count();

        return response()->json([
            'product_id' => $product->id,
            'average_rating' => round($avg, 1),
            'comments_count' => $count,
            'comments' => $comments,
        ]);
    }

    /**
     * Authenticated customer: post a comment (pending approval).
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::active()->where('slug', $slug)->firstOrFail();
        $user = auth('api')->user();

        $validated = $request->validate([
            'body' => 'required|string|min:3|max:2000',
            'rating' => 'required|integer|min:1|max:5',
            'author_name' => 'nullable|string|max:100',
        ], [
            'body.required' => 'متن نظر الزامی است.',
            'body.min' => 'نظر باید حداقل ۳ کاراکتر باشد.',
            'rating.required' => 'امتیاز الزامی است.',
            'rating.min' => 'امتیاز باید بین ۱ تا ۵ باشد.',
            'rating.max' => 'امتیاز باید بین ۱ تا ۵ باشد.',
        ]);

        $authorName = trim((string) ($validated['author_name'] ?? ''));
        if ($authorName === '') {
            $authorName = $user->name ?: ('کاربر '.$user->id);
        }

        // Prevent spam: one pending/recent comment per user per product within 24h
        $recent = ProductComment::where('product_id', $product->id)
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDay())
            ->exists();

        if ($recent) {
            return response()->json([
                'message' => 'شما اخیراً برای این محصول نظر ثبت کرده‌اید. لطفاً بعداً دوباره تلاش کنید.',
            ], 429);
        }

        $comment = ProductComment::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'author_name' => $authorName,
            'body' => $validated['body'],
            'rating' => (int) $validated['rating'],
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'نظر شما ثبت شد و پس از تأیید مدیر نمایش داده می‌شود.',
            'comment' => $comment,
        ], 201);
    }
}
