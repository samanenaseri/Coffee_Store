<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMenuCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = MenuCategory::withCount('items')->orderBy('sort_order')->paginate(20);

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:menu_categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $category = MenuCategory::create($validated);

        return response()->json($category, 201);
    }

    public function show(MenuCategory $menuCategory): JsonResponse
    {
        $menuCategory->loadCount('items');

        return response()->json($menuCategory);
    }

    public function update(Request $request, MenuCategory $menuCategory): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:menu_categories,slug,' . $menuCategory->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $menuCategory->update($validated);

        return response()->json($menuCategory);
    }

    public function destroy(MenuCategory $menuCategory): JsonResponse
    {
        if ($menuCategory->items()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with linked items'], 422);
        }

        $menuCategory->delete();

        return response()->json(['message' => 'Menu category deleted']);
    }
}
