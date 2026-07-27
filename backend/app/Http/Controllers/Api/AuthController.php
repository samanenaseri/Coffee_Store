<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'phone' => $this->normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'phone' => 'nullable|string|max:11',
            'password_confirmation' => 'required',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json(['message' => 'ایمیل یا شماره موبایل الزامی است.'], 422);
        }

        if (! empty($validated['phone']) && ! preg_match('/^09\d{9}$/', $validated['phone'])) {
            return response()->json(['message' => 'شماره موبایل معتبر نیست.'], 422);
        }

        $email = $validated['email'] ?? null;
        if (empty($email) && ! empty($validated['phone'])) {
            $email = $validated['phone'].'@phone.coffeestore.local';
        }

        // Let the "hashed" cast hash once — do not Hash::make here
        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
        ]);

        Wallet::create(['user_id' => $user->id]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'ثبت‌نام با موفقیت انجام شد.',
            'user' => $user->load('wallet'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->merge([
            'phone' => $this->normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:11',
            'password' => 'required|string',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json(['message' => 'ایمیل یا شماره موبایل الزامی است.'], 422);
        }

        $user = null;

        if (! empty($validated['phone'])) {
            $phone = $validated['phone'];
            $user = User::where('phone', $phone)->first();

            // Also try without leading zero / with leading zero
            if (! $user && str_starts_with($phone, '0')) {
                $user = User::where('phone', substr($phone, 1))->first();
            }
            if (! $user && ! str_starts_with($phone, '0') && strlen($phone) === 10) {
                $user = User::where('phone', '0'.$phone)->first();
            }

            if ($user) {
                $hashed = $user->getRawOriginal('password') ?? $user->password;
                if (empty($hashed) || ! is_string($hashed) || ! Hash::check($validated['password'], $hashed)) {
                    $user = null;
                }
            }
        } elseif (! empty($validated['email'])) {
            if ($token = JWTAuth::attempt([
                'email' => $validated['email'],
                'password' => $validated['password'],
            ])) {
                $user = Auth::user();
            }
        }

        if (! $user) {
            return response()->json([
                'message' => 'شماره موبایل یا رمز عبور اشتباه است.',
            ], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'ورود موفق',
            'user' => $user->load('wallet'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            auth('api')->invalidate();
        } catch (\Throwable $e) {
            // ignore invalid token on logout
        }

        return response()->json(['message' => 'خروج با موفقیت انجام شد.']);
    }

    public function profile(Request $request): JsonResponse
    {
        $user = auth('api')->user()->load('wallet');

        return response()->json(['user' => $user]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'avatar' => 'nullable|string|max:255',
        ]);

        $user = auth('api')->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh()->load('wallet'),
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'old_password' => 'required',
            'new_password' => ['required', 'confirmed', Password::min(8)],
            'new_password_confirmation' => 'required',
        ]);

        $user = auth('api')->user();
        $hashed = $user->getRawOriginal('password') ?? $user->password;

        if (empty($hashed) || ! Hash::check($validated['old_password'], $hashed)) {
            return response()->json(['message' => 'رمز عبور فعلی اشتباه است.'], 422);
        }

        // hashed cast will hash once
        $user->update(['password' => $validated['new_password']]);

        return response()->json(['message' => 'رمز عبور با موفقیت تغییر کرد.']);
    }

    /**
     * Normalize Iranian mobile numbers to 09xxxxxxxxx
     */
    private function normalizePhone(mixed $phone): ?string
    {
        if ($phone === null || $phone === '') {
            return null;
        }

        $digits = preg_replace('/\D+/', '', (string) $phone);
        if ($digits === null || $digits === '') {
            return null;
        }

        // 98912... → 0912...
        if (str_starts_with($digits, '98') && strlen($digits) === 12) {
            $digits = '0'.substr($digits, 2);
        }

        // 912... (10 digits) → 0912...
        if (strlen($digits) === 10 && str_starts_with($digits, '9')) {
            $digits = '0'.$digits;
        }

        return $digits;
    }
}
