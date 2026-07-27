<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::active()->with('category')->orderBy('sort_order')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(12);

        return response()->json($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::active()->with('category')->where('slug', $slug)->firstOrFail();

        return response()->json($product);
    }
}
