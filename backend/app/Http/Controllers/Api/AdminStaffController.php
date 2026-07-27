<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminStaffController extends Controller
{
    public function index(): JsonResponse
    {
        $staff = Staff::orderBy('sort_order')->paginate(20);

        return response()->json($staff);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $staff = Staff::create($validated);

        return response()->json($staff, 201);
    }

    public function show(Staff $staff): JsonResponse
    {
        return response()->json($staff);
    }

    public function update(Request $request, Staff $staff): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $staff->update($validated);

        return response()->json($staff);
    }

    public function destroy(Staff $staff): JsonResponse
    {
        $staff->delete();

        return response()->json(['message' => 'Staff deleted']);
    }
}
