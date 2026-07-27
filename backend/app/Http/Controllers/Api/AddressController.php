<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(): JsonResponse
    {
        $addresses = auth('api')
            ->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['addresses' => $addresses]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->merge($this->normalizeAddressInput($request->all()));

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'receiver_name' => 'required|string|max:100',
            'phone' => 'required|string|max:11',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'address' => 'required|string',
            'postal_code' => 'required|string|max:10',
            'plaque' => 'nullable|string|max:20',
            'unit' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_default' => 'nullable|boolean',
        ], [
            'title.required' => 'عنوان آدرس الزامی است.',
            'receiver_name.required' => 'نام گیرنده الزامی است.',
            'phone.required' => 'شماره موبایل الزامی است.',
            'phone.max' => 'شماره موبایل نباید بیشتر از ۱۱ رقم باشد.',
            'province.required' => 'استان الزامی است.',
            'city.required' => 'شهر الزامی است.',
            'address.required' => 'نشانی کامل الزامی است.',
            'postal_code.required' => 'کد پستی الزامی است.',
        ]);

        // Normalize phone to 11 digits starting with 09
        $phone = preg_replace('/\D+/', '', (string) $validated['phone']);
        if (strlen($phone) === 10 && str_starts_with($phone, '9')) {
            $phone = '0'.$phone;
        }
        if (! preg_match('/^09\d{9}$/', $phone)) {
            return response()->json([
                'message' => 'شماره موبایل معتبر نیست. (مثال: 09123456789)',
            ], 422);
        }
        $validated['phone'] = $phone;

        $postal = preg_replace('/\D+/', '', (string) $validated['postal_code']);
        if (strlen($postal) !== 10) {
            return response()->json([
                'message' => 'کد پستی باید ۱۰ رقم باشد.',
            ], 422);
        }
        $validated['postal_code'] = $postal;

        $validated['user_id'] = auth('api')->id();
        $validated['is_default'] = (bool) ($validated['is_default'] ?? false);

        if ($validated['is_default']) {
            auth('api')->user()->addresses()->update(['is_default' => false]);
        }

        $address = Address::create($validated);

        return response()->json([
            'message' => 'آدرس با موفقیت ثبت شد.',
            'address' => $address->fresh(),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $address = auth('api')->user()->addresses()->findOrFail($id);

        return response()->json(['address' => $address]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $address = auth('api')->user()->addresses()->findOrFail($id);

        $request->merge($this->normalizeAddressInput($request->all()));

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'receiver_name' => 'sometimes|string|max:100',
            'phone' => 'sometimes|string|max:11',
            'province' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'address' => 'sometimes|string',
            'postal_code' => 'sometimes|string|max:10',
            'plaque' => 'nullable|string|max:20',
            'unit' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_default' => 'nullable|boolean',
        ]);

        if (isset($validated['phone'])) {
            $phone = preg_replace('/\D+/', '', (string) $validated['phone']);
            if (strlen($phone) === 10 && str_starts_with($phone, '9')) {
                $phone = '0'.$phone;
            }
            $validated['phone'] = $phone;
        }

        if (isset($validated['postal_code'])) {
            $validated['postal_code'] = preg_replace('/\D+/', '', (string) $validated['postal_code']);
        }

        if (array_key_exists('is_default', $validated) && $validated['is_default']) {
            auth('api')->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => 'آدرس با موفقیت بروزرسانی شد.',
            'address' => $address->fresh(),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $address = auth('api')->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted successfully.']);
    }

    public function setDefault($id): JsonResponse
    {
        $user = auth('api')->user();
        $address = $user->addresses()->findOrFail($id);

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated successfully.',
            'address' => $address->fresh(),
        ]);
    }

    /**
     * Accept camelCase or snake_case from clients.
     */
    private function normalizeAddressInput(array $input): array
    {
        $map = [
            'receiverName' => 'receiver_name',
            'postalCode' => 'postal_code',
            'isDefault' => 'is_default',
        ];

        foreach ($map as $camel => $snake) {
            if (array_key_exists($camel, $input) && ! array_key_exists($snake, $input)) {
                $input[$snake] = $input[$camel];
            }
        }

        return $input;
    }
}
