<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminHomepageSectionController extends Controller
{
    private const VALID_TYPES = [
        'hero', 'about', 'products', 'services',
        'menu', 'testimonials', 'gallery', 'banner', 'articles',
    ];

    public function index(): JsonResponse
    {
        $sections = HomepageSection::orderBy('sort_order')->get();

        return response()->json($sections);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', self::VALID_TYPES),
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|array',
            'image' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
            'link_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $section = HomepageSection::create($validated);

        return response()->json($section, 201);
    }

    public function show(HomepageSection $homepageSection): JsonResponse
    {
        return response()->json($homepageSection);
    }

    public function update(Request $request, HomepageSection $homepageSection): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', self::VALID_TYPES),
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|array',
            'image' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
            'link_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $homepageSection->update($validated);

        return response()->json($homepageSection);
    }

    public function destroy(HomepageSection $homepageSection): JsonResponse
    {
        $homepageSection->delete();

        return response()->json(['message' => 'Section deleted']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:homepage_sections,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            HomepageSection::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Order updated']);
    }
}
