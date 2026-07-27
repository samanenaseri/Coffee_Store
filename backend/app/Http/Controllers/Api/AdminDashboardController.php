<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $totalUsers = User::count();
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $recentOrders = Order::with('user')->latest()->take(10)->get();

        $monthlyRevenue = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $revenue = Order::where('payment_status', 'paid')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total');

            $monthlyRevenue->push([
                'month' => $date->format('Y-m'),
                'revenue' => $revenue,
            ]);
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_orders' => $totalOrders,
            'total_products' => $totalProducts,
            'total_revenue' => $totalRevenue,
            'recent_orders' => $recentOrders,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }
}
