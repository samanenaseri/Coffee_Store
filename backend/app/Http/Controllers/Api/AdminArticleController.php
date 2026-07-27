<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::orderBy('sort_order')->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($articles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'image_alt' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    public function show(Article $article): JsonResponse
    {
        return response()->json($article);
    }

    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug,' . $article->id,
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'image_alt' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    public function destroy(Article $article): JsonResponse
    {
        $article->delete();

        return response()->json(['message' => 'Article deleted']);
    }
}
