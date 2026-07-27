<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpCode;
use App\Models\User;
use App\Models\Wallet;
use App\Traits\SendsOtpSms;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Tymon\JWTAuth\Facades\JWTAuth;

class OtpController extends Controller
{
    use SendsOtpSms;

    public function sendOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string|digits:11|regex:/^09\d{9}$/',
        ]);

        $phone = $validated['phone'];
        $key = 'otp_send:' . $phone;

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً ' . $seconds . ' ثانیه صبر کنید.',
            ], 429);
        }

        RateLimiter::hit($key, 120);

        $code = (string) rand(10000, 99999);

        OtpCode::create([
            'phone' => $phone,
            'code' => $code,
            'type' => 'login',
            'expires_at' => now()->addMinutes(2),
            'ip' => $request->ip(),
        ]);

        $this->sendOtpSms($phone, $code);

        return response()->json([
            'message' => 'کد تایید ارسال شد',
            'expires_in' => 120,
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|digits:5',
        ]);

        $otp = OtpCode::byPhone($validated['phone'])
            ->unused()
            ->notExpired()
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'کد تایید نامعتبر یا منقضی شده است.',
            ], 422);
        }

        $otp->increment('attempts');

        if ($otp->attempts >= 3) {
            $otp->markUsed();
            return response()->json([
                'message' => 'تعداد تلاش‌ها بیش از حد مجاز است. کد جدید دریافت کنید.',
            ], 422);
        }

        if ($otp->code !== $validated['code']) {
            return response()->json([
                'message' => 'کد تایید اشتباه است.',
            ], 422);
        }

        $otp->markUsed();

        $email = $validated['phone'] . '@phone.coffeestore.local';

        $user = User::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => 'کاربر ' . $validated['phone'],
                'email' => $email,
            ]
        );

        if ($user->wasRecentlyCreated) {
            Wallet::create(['user_id' => $user->id]);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'ورود موفق',
            'user' => $user->load('wallet'),
            'token' => $token,
        ]);
    }
}
