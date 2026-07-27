<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use Illuminate\Http\JsonResponse;

class PublicHomepageController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = HomepageSection::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($sections);
    }
}
