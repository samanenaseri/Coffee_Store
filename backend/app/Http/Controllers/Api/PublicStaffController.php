<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;

class PublicStaffController extends Controller
{
    public function index(): JsonResponse
    {
        $staff = Staff::active()->ordered()->get();

        return response()->json($staff);
    }
}
