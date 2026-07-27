<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMenuItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::with('category')->orderBy('sort_order');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $items = $query->paginate(20);

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:menu_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:menu_items,slug',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'is_available' => 'nullable|boolean',
            'is_popular' => 'nullable|boolean',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $item = MenuItem::create($validated);

        return response()->json($item, 201);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        $menuItem->load('category');

        return response()->json($menuItem);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:menu_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:menu_items,slug,' . $menuItem->id,
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'is_available' => 'nullable|boolean',
            'is_popular' => 'nullable|boolean',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $menuItem->update($validated);

        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted']);
    }
}
