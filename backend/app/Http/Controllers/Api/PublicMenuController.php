<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use Illuminate\Http\JsonResponse;

class PublicMenuController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = MenuCategory::active()
            ->with(['items' => function ($query) {
                $query->where('is_available', true)->orderBy('sort_order');
            }])
            ->ordered()
            ->get();

        return response()->json($categories);
    }

    public function show(string $slug): JsonResponse
    {
        $category = MenuCategory::active()
            ->with(['items' => function ($query) {
                $query->where('is_available', true)->orderBy('sort_order');
            }])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($category);
    }
}
