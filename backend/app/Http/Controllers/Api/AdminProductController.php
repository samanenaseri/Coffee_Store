<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category')->orderBy('sort_order');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'price' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'weight_unit' => 'nullable|string|in:g,kg',
            'price_per_kg' => 'nullable|integer|min:0',
            'weight_packages' => 'nullable|array',
            'weight_packages.*.id' => 'nullable|string|max:50',
            'weight_packages.*.weight' => 'required_with:weight_packages|numeric|min:0.01',
            'weight_packages.*.unit' => 'required_with:weight_packages|string|in:g,kg',
            'weight_packages.*.price' => 'required_with:weight_packages|integer|min:0',
            'image' => 'nullable|string|max:255',
            'image_alt' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'inventory' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $validated = $this->normalizeWeightData($validated);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load('category');

        return response()->json($product);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'price' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'weight_unit' => 'nullable|string|in:g,kg',
            'price_per_kg' => 'nullable|integer|min:0',
            'weight_packages' => 'nullable|array',
            'weight_packages.*.id' => 'nullable|string|max:50',
            'weight_packages.*.weight' => 'required_with:weight_packages|numeric|min:0.01',
            'weight_packages.*.unit' => 'required_with:weight_packages|string|in:g,kg',
            'weight_packages.*.price' => 'required_with:weight_packages|integer|min:0',
            'image' => 'nullable|string|max:255',
            'image_alt' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'inventory' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string|max:500',
        ]);

        $validated = $this->normalizeWeightData($validated);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    /**
     * Normalize weight packages and keep base price/weight in sync with first package.
     */
    private function normalizeWeightData(array $validated): array
    {
        $packages = $validated['weight_packages'] ?? null;

        if (! is_array($packages) || count($packages) === 0) {
            $validated['weight_packages'] = null;

            return $validated;
        }

        $normalized = [];

        foreach ($packages as $index => $package) {
            $unit = ($package['unit'] ?? 'g') === 'kg' ? 'kg' : 'g';
            $weight = (float) ($package['weight'] ?? 0);
            $price = (int) ($package['price'] ?? 0);
            $id = ! empty($package['id'])
                ? (string) $package['id']
                : 'pkg_'.($index + 1).'_'.uniqid();

            if ($weight <= 0) {
                continue;
            }

            $normalized[] = [
                'id' => $id,
                'weight' => $weight,
                'unit' => $unit,
                'price' => max(0, $price),
            ];
        }

        if (count($normalized) === 0) {
            $validated['weight_packages'] = null;

            return $validated;
        }

        usort($normalized, function (array $a, array $b) {
            $aKg = $a['unit'] === 'kg' ? $a['weight'] : $a['weight'] / 1000;
            $bKg = $b['unit'] === 'kg' ? $b['weight'] : $b['weight'] / 1000;

            return $aKg <=> $bKg;
        });

        $validated['weight_packages'] = $normalized;

        $first = $normalized[0];
        $validated['weight'] = $first['weight'];
        $validated['weight_unit'] = $first['unit'];
        $validated['price'] = $first['price'];

        return $validated;
    }
}
