<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminGalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Gallery::orderBy('sort_order')->paginate(20);

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:gallery,slug',
            'image' => 'required|string|max:500',
            'image_alt' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $validated['category'] = $validated['category'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? '';

        $item = Gallery::create($validated);

        return response()->json($item, 201);
    }

    public function show(Gallery $gallery): JsonResponse
    {
        return response()->json($gallery);
    }

    public function update(Request $request, Gallery $gallery): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:gallery,slug,' . $gallery->id,
            'image' => 'required|string|max:500',
            'image_alt' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        if (array_key_exists('category', $validated) && $validated['category'] === null) {
            $validated['category'] = '';
        }
        if (array_key_exists('image_alt', $validated) && $validated['image_alt'] === null) {
            $validated['image_alt'] = '';
        }

        $gallery->update($validated);

        return response()->json($gallery);
    }

    public function destroy(Gallery $gallery): JsonResponse
    {
        $gallery->delete();

        return response()->json(['message' => 'Gallery item deleted']);
    }
}
