<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait SendsOtpSms
{
    protected function sendOtpSms(string $phone, string $code): bool
    {
        $apiKey = config('services.kavenegar.api_key');
        $sender = config('services.kavenegar.sender');
        $baseUrl = config('services.kavenegar.base_url', 'https://api.kavenegar.com/v1');

        if (empty($apiKey)) {
            Log::error('KaveNegar API key is not configured');
            return false;
        }

        $message = "کد تایید شما: {$code}\nکافه استور";

        $url = sprintf(
            '%s/%s/sms/send.json',
            rtrim($baseUrl, '/'),
            $apiKey
        );

        try {
            $response = Http::withoutVerifying()
                ->connectTimeout(config('services.kavenegar.connect_timeout', 5))
                ->timeout(config('services.kavenegar.timeout', 15))
                ->asForm()
                ->post($url, [
                    'sender' => $sender,
                    'receptor' => $phone,
                    'message' => $message,
                ]);

            $body = $response->json();

            if ($response->successful() && data_get($body, 'return.status') === 200) {
                return true;
            }

            Log::warning('KaveNegar API error', [
                'status' => data_get($body, 'return.status'),
                'message' => data_get($body, 'return.message'),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('KaveNegar API exception', [
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
