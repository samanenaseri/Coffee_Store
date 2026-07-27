<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;

class PublicGalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Gallery::active()->ordered()->paginate(12);

        return response()->json($items);
    }

    public function show(string $slug): JsonResponse
    {
        $item = Gallery::active()->where('slug', $slug)->firstOrFail();

        return response()->json($item);
    }
}
