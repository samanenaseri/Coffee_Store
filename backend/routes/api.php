<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AdminArticleController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminGalleryController;
use App\Http\Controllers\Api\AdminHomepageSectionController;
use App\Http\Controllers\Api\AdminMenuCategoryController;
use App\Http\Controllers\Api\AdminMenuItemController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminProductCommentController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminSettingController;
use App\Http\Controllers\Api\ProductCommentController;
use App\Http\Controllers\Api\AdminStaffController;
use App\Http\Controllers\Api\AdminSupportController;
use App\Http\Controllers\Api\AdminTestimonialController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OtpController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderPaymentController;
use App\Http\Controllers\Api\ProfileOrderController;
use App\Http\Controllers\Api\PublicArticleController;
use App\Http\Controllers\Api\PublicCategoryController;
use App\Http\Controllers\Api\PublicGalleryController;
use App\Http\Controllers\Api\PublicHomepageController;
use App\Http\Controllers\Api\PublicMenuController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\PublicStaffController;
use App\Http\Controllers\Api\PublicTestimonialController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Named login route for auth middleware redirect fallback
    Route::get('login', fn () => response()->json(['message' => 'Unauthorized'], 401))->name('login');

    // Public routes
    Route::get('products', [PublicProductController::class, 'index']);
    Route::get('products/{slug}', [PublicProductController::class, 'show']);
    Route::get('products/{slug}/comments', [ProductCommentController::class, 'index']);

    Route::get('menu', [PublicMenuController::class, 'index']);
    Route::get('menu/{slug}', [PublicMenuController::class, 'show']);

    Route::get('articles', [PublicArticleController::class, 'index']);
    Route::get('articles/{slug}', [PublicArticleController::class, 'show']);

    Route::get('gallery', [PublicGalleryController::class, 'index']);
    Route::get('gallery/{slug}', [PublicGalleryController::class, 'show']);

    Route::get('staff', [PublicStaffController::class, 'index']);

    Route::get('testimonials', [PublicTestimonialController::class, 'index']);

    Route::get('categories', [PublicCategoryController::class, 'index']);
    Route::get('categories/{slug}', [PublicCategoryController::class, 'show']);

    Route::get('settings', [SettingController::class, 'index']);

    // Public homepage sections (CMS-driven layout)
    Route::get('homepage', [PublicHomepageController::class, 'index']);

    // Auth routes
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('otp/send', [OtpController::class, 'sendOtp']);
    Route::post('otp/verify', [OtpController::class, 'verifyOtp']);
    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/profile', [AuthController::class, 'profile']);
        Route::put('auth/profile', [AuthController::class, 'updateProfile']);
        Route::put('auth/password', [AuthController::class, 'changePassword']);

        // Addresses
        Route::apiResource('addresses', AddressController::class);
        Route::put('addresses/{id}/default', [AddressController::class, 'setDefault']);

        // Favorites
        Route::get('favorites', [FavoriteController::class, 'index']);
        Route::post('favorites/{productId}/toggle', [FavoriteController::class, 'toggle']);
        Route::get('favorites/{productId}/check', [FavoriteController::class, 'check']);

        // Wallet
        Route::get('wallet', [WalletController::class, 'index']);
        Route::post('wallet/charge', [WalletController::class, 'charge']);
        Route::get('wallet/transactions', [WalletController::class, 'transactions']);

        // Product comments
        Route::post('products/{slug}/comments', [ProductCommentController::class, 'store']);

        // Orders
        Route::post('orders', [OrderController::class, 'store']);
        Route::post('orders/{id}/card-transfer', [OrderPaymentController::class, 'submitCardTransfer']);

        // Profile Orders
        Route::get('profile/orders', [ProfileOrderController::class, 'index']);
        Route::get('profile/orders/{id}', [ProfileOrderController::class, 'show']);
        Route::post('profile/orders/{id}/reorder', [ProfileOrderController::class, 'reorder']);
        Route::post('profile/orders/{id}/cancel', [ProfileOrderController::class, 'cancel']);
        Route::post('profile/orders/{id}/return', [ProfileOrderController::class, 'returnItem']);

        // Support
        Route::get('support', [SupportController::class, 'index']);
        Route::post('support', [SupportController::class, 'store']);
        Route::get('support/{id}', [SupportController::class, 'show']);
        Route::post('support/{id}/reply', [SupportController::class, 'reply']);
    });

    // Admin routes
    Route::prefix('admin')->middleware(['auth:api'])->group(function () {
        Route::post('upload', [UploadController::class, 'store']);
        Route::delete('upload', [UploadController::class, 'destroy']);

        Route::get('dashboard', [AdminDashboardController::class, 'index']);

        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('products', AdminProductController::class);

        // Product comments moderation
        Route::get('product-comments', [AdminProductCommentController::class, 'index']);
        Route::get('product-comments/{productComment}', [AdminProductCommentController::class, 'show']);
        Route::put('product-comments/{productComment}', [AdminProductCommentController::class, 'update']);
        Route::post('product-comments/{productComment}/approve', [AdminProductCommentController::class, 'approve']);
        Route::post('product-comments/{productComment}/reject', [AdminProductCommentController::class, 'reject']);
        Route::delete('product-comments/{productComment}', [AdminProductCommentController::class, 'destroy']);

        Route::apiResource('menu-categories', AdminMenuCategoryController::class);
        Route::apiResource('menu-items', AdminMenuItemController::class);
        Route::apiResource('articles', AdminArticleController::class);
        Route::apiResource('gallery', AdminGalleryController::class);
        Route::apiResource('staff', AdminStaffController::class);
        Route::apiResource('testimonials', AdminTestimonialController::class);

        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::get('orders/{order}', [AdminOrderController::class, 'show']);
        Route::put('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::put('orders/{order}/action-status', [AdminOrderController::class, 'updateActionStatus']);
        Route::put('orders/{order}/tracking-code', [AdminOrderController::class, 'updateTrackingCode']);
        Route::post('orders/{order}/review-payment', [AdminOrderController::class, 'reviewPayment']);

        Route::get('users', [AdminUserController::class, 'index']);
        Route::get('users/{user}', [AdminUserController::class, 'show']);
        Route::put('users/{user}', [AdminUserController::class, 'update']);

        Route::get('support', [AdminSupportController::class, 'index']);
        Route::get('support/{supportTicket}', [AdminSupportController::class, 'show']);
        Route::post('support/{supportTicket}/reply', [AdminSupportController::class, 'reply']);
        Route::put('support/{supportTicket}/status', [AdminSupportController::class, 'updateStatus']);

        Route::get('settings', [AdminSettingController::class, 'index']);
        Route::put('settings', [AdminSettingController::class, 'update']);

        // Homepage sections
        Route::apiResource('homepage-sections', AdminHomepageSectionController::class);
        Route::post('homepage-sections/reorder', [AdminHomepageSectionController::class, 'reorder']);
    });
});
