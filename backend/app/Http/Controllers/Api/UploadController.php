<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];

    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/svg',
        'image/x-ms-bmp',
        'image/pjpeg',
        'image/x-png',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'text/plain', // some browsers/servers report svg as text/plain
        'text/xml',
        'application/xml',
        'application/octet-stream',
    ];

    public function store(Request $request): JsonResponse
    {
        // Detect empty request caused by PHP post_max_size overflow
        $contentLength = (int) $request->header('Content-Length', 0);
        $postMax = $this->iniSizeToBytes((string) ini_get('post_max_size'));
        if ($contentLength > 0 && $postMax > 0 && $contentLength > $postMax) {
            return response()->json([
                'message' => 'حجم داده ارسالی بیش از حد مجاز سرور است (post_max_size='.ini_get('post_max_size').'). تصویر کوچک‌تری انتخاب کنید.',
            ], 413);
        }

        // 1) Multipart first (efficient — does not inflate size like base64)
        $file = $this->resolveUploadedFile($request);
        if ($file) {
            return $this->storeFromUploadedFile($request, $file);
        }

        // 2) Base64 JSON (small files / SVG fallback)
        if ($request->filled('content') || $request->filled('file_base64')) {
            return $this->storeFromBase64($request);
        }

        // Re-check multipart after base64 branch miss

        Log::warning('Upload: no usable file in request', [
            'content_type' => $request->header('Content-Type'),
            'content_length' => $request->header('Content-Length'),
            'input_keys' => array_keys($request->all()),
            'file_keys' => array_keys($request->allFiles()),
            'post_max_size' => ini_get('post_max_size'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
        ]);

        return response()->json([
            'message' => 'فایل ارسال نشده است. لطفاً دوباره تلاش کنید.',
            'hint' => 'اگر تصویر بزرگ است آن را کوچک‌تر کنید (زیر ۵ مگابایت). SVG هم پشتیبانی می‌شود.',
        ], 422);
    }

    private function storeFromUploadedFile(Request $request, UploadedFile $file): JsonResponse
    {
        if (! $file->isValid()) {
            $code = $file->getError();

            Log::warning('Upload: invalid uploaded file', [
                'error_code' => $code,
                'error_message' => $file->getErrorMessage(),
                'client_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ]);

            return response()->json([
                'message' => $this->uploadErrorMessage($code),
                'php_error_code' => $code,
            ], 422);
        }

        $originalName = $file->getClientOriginalName() ?: 'upload.bin';
        $clientExt = strtolower((string) ($file->getClientOriginalExtension() ?: pathinfo($originalName, PATHINFO_EXTENSION) ?: ''));
        $clientMime = (string) ($file->getClientMimeType() ?: '');
        // Prefer client-reported type; do not let server sniff rewrite extension
        $serverMime = (string) ($file->getMimeType() ?: '');

        if ($file->getSize() > 20 * 1024 * 1024) {
            return response()->json([
                'message' => 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.',
            ], 422);
        }

        $pathName = $file->getRealPath() ?: $file->getPathname();
        $contents = $pathName ? @file_get_contents($pathName) : false;
        if ($contents === false || $contents === '') {
            return response()->json([
                'message' => 'خواندن فایل آپلودشده روی سرور ناموفق بود.',
            ], 422);
        }

        // 1) Client extension from filename  2) magic bytes  3) mime — never map png→jpg
        $extension = $this->resolveExtensionPreferringOriginal(
            $originalName,
            $clientExt,
            $clientMime !== '' ? $clientMime : $serverMime,
            $contents
        );

        if (! $extension) {
            return response()->json([
                'message' => 'فرمت فایل مجاز نیست. (jpg, png, gif, webp, bmp, svg, ico)',
            ], 422);
        }

        if ($extension === 'svg' && $this->svgLooksUnsafe($contents)) {
            return response()->json([
                'message' => 'فایل SVG شامل محتوای غیرمجاز است.',
            ], 422);
        }

        Log::info('Upload stored', [
            'original_name' => $originalName,
            'client_ext' => $clientExt,
            'resolved_ext' => $extension,
            'client_mime' => $clientMime,
            'server_mime' => $serverMime,
            'size' => strlen($contents),
        ]);

        return $this->persistBinary(
            $contents,
            $extension,
            $this->sanitizeFolder($request->input('folder', 'uploads'))
        );
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = ltrim(str_replace(['..', '\\'], '', $request->input('path')), '/');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json(['message' => 'File deleted']);
        }

        return response()->json(['message' => 'File not found'], 404);
    }

    private function storeFromBase64(Request $request): JsonResponse
    {
        $raw = (string) ($request->input('content') ?: $request->input('file_base64') ?: '');
        $filename = (string) ($request->input('filename') ?: $request->input('name') ?: 'upload.png');
        $folder = $this->sanitizeFolder($request->input('folder', 'uploads'));

        if ($raw === '') {
            return response()->json(['message' => 'محتوای فایل خالی است.'], 422);
        }

        $mime = null;
        $base64 = $raw;

        if (preg_match('/^data:([^;]+);base64,(.*)$/s', $raw, $m)) {
            $mime = strtolower(trim($m[1]));
            $base64 = $m[2];
        }

        $binary = base64_decode($base64, true);
        if ($binary === false || $binary === '') {
            return response()->json(['message' => 'داده base64 نامعتبر است.'], 422);
        }

        if (strlen($binary) > 20 * 1024 * 1024) {
            return response()->json(['message' => 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.'], 422);
        }

        $extension = $this->resolveExtension($filename, pathinfo($filename, PATHINFO_EXTENSION), $mime ?? '');

        if (! $extension) {
            return response()->json([
                'message' => 'فرمت فایل مجاز نیست. (jpg, png, gif, webp, bmp, svg, ico)',
            ], 422);
        }

        if ($extension === 'svg' && $this->svgLooksUnsafe($binary)) {
            return response()->json([
                'message' => 'فایل SVG شامل محتوای غیرمجاز است.',
            ], 422);
        }

        return $this->persistBinary($binary, $extension, $folder);
    }

    private function persistBinary(string $binary, string $extension, string $folder): JsonResponse
    {
        $filename = Str::uuid().'.'.$extension;
        $path = trim($folder, '/').'/'.$filename;

        try {
            if (! Storage::disk('public')->exists($folder)) {
                Storage::disk('public')->makeDirectory($folder);
            }

            $ok = Storage::disk('public')->put($path, $binary);
        } catch (\Throwable $e) {
            Log::error('Upload store failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'ذخیره‌سازی فایل روی سرور انجام نشد.',
            ], 500);
        }

        if (! $ok) {
            return response()->json([
                'message' => 'ذخیره‌سازی فایل روی سرور انجام نشد.',
            ], 500);
        }

        return response()->json([
            'url' => '/storage/'.$path,
            'path' => $path,
        ]);
    }

    /**
     * hasFile() returns false for invalid uploads even when the file key exists.
     * Pull the UploadedFile object directly so we can surface the real PHP error.
     */
    private function resolveUploadedFile(Request $request): ?UploadedFile
    {
        $file = $request->file('file');
        if ($file instanceof UploadedFile) {
            return $file;
        }

        $all = $request->allFiles();
        if (isset($all['file'])) {
            $candidate = $all['file'];
            if ($candidate instanceof UploadedFile) {
                return $candidate;
            }
            if (is_array($candidate)) {
                $first = reset($candidate);
                if ($first instanceof UploadedFile) {
                    return $first;
                }
            }
        }

        foreach ($all as $value) {
            if ($value instanceof UploadedFile) {
                return $value;
            }
            if (is_array($value)) {
                foreach ($value as $inner) {
                    if ($inner instanceof UploadedFile) {
                        return $inner;
                    }
                }
            }
        }

        return null;
    }

    private function resolveExtension(string $filename, string $extension, string $mime): ?string
    {
        return $this->resolveExtensionPreferringOriginal($filename, $extension, $mime, null);
    }

    /**
     * Keep the original client extension whenever possible.
     * Never rewrite PNG/WebP/etc to JPG.
     */
    private function resolveExtensionPreferringOriginal(
        string $filename,
        string $extension,
        string $mime,
        ?string $binary,
    ): ?string {
        $extension = strtolower(ltrim($extension, '.'));

        // Prefer the client's original extension from the uploaded filename
        if ($extension !== '' && in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            return $extension;
        }

        $fromName = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if ($fromName !== '' && in_array($fromName, self::ALLOWED_EXTENSIONS, true)) {
            return $fromName;
        }

        // Magic-byte detection (only when extension is missing)
        if ($binary !== null && $binary !== '') {
            $fromMagic = $this->detectExtensionFromBinary($binary);
            if ($fromMagic !== null) {
                return $fromMagic;
            }
        }

        $mime = strtolower($mime);
        return match (true) {
            str_contains($mime, 'png') => 'png',
            str_contains($mime, 'webp') => 'webp',
            str_contains($mime, 'gif') => 'gif',
            str_contains($mime, 'svg') => 'svg',
            str_contains($mime, 'bmp') => 'bmp',
            str_contains($mime, 'icon') || str_contains($mime, 'ico') => 'ico',
            // jpeg mime only if nothing else matched — keep as jpeg not forced jpg rename of other formats
            str_contains($mime, 'jpeg') => 'jpeg',
            str_contains($mime, 'jpg') => 'jpg',
            default => null,
        };
    }

    private function detectExtensionFromBinary(string $binary): ?string
    {
        if (str_starts_with($binary, "\x89PNG\r\n\x1a\n")) {
            return 'png';
        }
        if (str_starts_with($binary, "\xFF\xD8\xFF")) {
            return 'jpg';
        }
        if (str_starts_with($binary, 'GIF87a') || str_starts_with($binary, 'GIF89a')) {
            return 'gif';
        }
        if (strlen($binary) >= 12 && str_starts_with($binary, 'RIFF') && substr($binary, 8, 4) === 'WEBP') {
            return 'webp';
        }
        if (str_starts_with($binary, 'BM')) {
            return 'bmp';
        }
        // ICO: 00 00 01 00
        if (strlen($binary) >= 4 && $binary[0] === "\x00" && $binary[1] === "\x00" && $binary[2] === "\x01" && $binary[3] === "\x00") {
            return 'ico';
        }
        $head = strtolower(substr($binary, 0, 256));
        if (str_contains($head, '<svg')) {
            return 'svg';
        }

        return null;
    }

    private function sanitizeFolder(mixed $folder): string
    {
        $folder = trim(str_replace(['..', '\\'], '', (string) ($folder ?: 'uploads')), '/');
        $folder = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $folder) ?: 'uploads';

        return $folder;
    }

    private function svgLooksUnsafe(string $contents): bool
    {
        $lower = strtolower($contents);

        // Block common XSS vectors in SVG while still allowing normal icons/logos
        $patterns = [
            '<script',
            'javascript:',
            'onerror=',
            'onload=',
            'onclick=',
            'onmouseover=',
            'xlink:href="javascript',
            'href="javascript',
        ];

        foreach ($patterns as $p) {
            if (str_contains($lower, $p)) {
                return true;
            }
        }

        // Must look like SVG
        if (! str_contains($lower, '<svg')) {
            return true;
        }

        return false;
    }

    private function uploadErrorMessage(int $code): string
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'حجم فایل بیشتر از حد مجاز سرور است (حداکثر فعلی PHP: '.ini_get('upload_max_filesize').').',
            UPLOAD_ERR_PARTIAL => 'فایل ناقص آپلود شد. دوباره تلاش کنید.',
            UPLOAD_ERR_NO_FILE => 'فایلی انتخاب نشده است.',
            UPLOAD_ERR_NO_TMP_DIR => 'پوشه موقت سرور وجود ندارد.',
            UPLOAD_ERR_CANT_WRITE => 'سرور نتوانست فایل را بنویسد.',
            UPLOAD_ERR_EXTENSION => 'افزونه PHP مانع آپلود شد.',
            default => 'آپلود فایل ناموفق بود (کد خطا: '.$code.').',
        };
    }

    private function iniSizeToBytes(string $value): int
    {
        $value = trim($value);
        if ($value === '') {
            return 0;
        }

        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return (int) match ($unit) {
            'g' => $number * 1024 * 1024 * 1024,
            'm' => $number * 1024 * 1024,
            'k' => $number * 1024,
            default => (float) $value,
        };
    }
}
