<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class PublicCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::active()->withCount('products')->ordered()->get();

        return response()->json($categories);
    }
}
