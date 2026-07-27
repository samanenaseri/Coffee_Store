<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('sort_order')->paginate(20);

        return response()->json($testimonials);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json($testimonial, 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $testimonial->update($validated);

        return response()->json($testimonial);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted']);
    }
}
