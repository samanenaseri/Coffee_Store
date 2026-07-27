<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;

class PublicArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::active()->orderBy('sort_order')->orderBy('created_at', 'desc')->paginate(6);

        return response()->json($articles);
    }

    public function show(string $slug): JsonResponse
    {
        $article = Article::active()->where('slug', $slug)->firstOrFail();

        return response()->json($article);
    }
}
