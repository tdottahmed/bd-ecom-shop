<?php

use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CourierController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\HomeSettingsController;
use App\Http\Controllers\Admin\LandingPageController;
use App\Http\Controllers\Admin\MarketingController;
use App\Http\Controllers\Admin\NewsletterSubscriptionController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PathaoController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\SocialLoginController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware(['auth', 'admin.session'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Landing Pages
    Route::post('landing-pages/upload-image', [LandingPageController::class, 'uploadImage'])->name('landing-pages.upload-image');
    Route::post('landing-pages/{landingPage}/toggle-publish', [LandingPageController::class, 'togglePublish'])->name('landing-pages.toggle-publish');
    Route::resource('landing-pages', LandingPageController::class)->except(['show']);
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/import', [ProductImportController::class, 'index'])->name('products.import');
    Route::get('products/import/template', [ProductImportController::class, 'template'])->name('products.import.template');
    Route::post('products/import/preview', [ProductImportController::class, 'preview'])->name('products.import.preview');
    Route::post('products/import/confirm', [ProductImportController::class, 'confirm'])->name('products.import.confirm');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('product/store', [ProductController::class, 'store'])->name('product.store');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
    Route::post('products/{product}/update', [ProductController::class, 'update'])->name('product.update');
    Route::delete('products/delete/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::get('products/show/{product}', [ProductController::class, 'show'])->name('product.show');
    Route::post('products/{product}/update-stock', [ProductController::class, 'updateStock'])->name('product.update-stock');

    Route::resource('categories', CategoryController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('blogs', BlogController::class)->parameters([
        'blogs' => 'blog',
    ])->except(['show']);

    // New Modules
    Route::get('discounts', [DiscountController::class, 'index'])->name('discounts.index');
    Route::post('discounts/update', [DiscountController::class, 'update'])->name('discounts.update');
    Route::get('website', [WebsiteController::class, 'index'])->name('website.index');
    Route::post('website/update', [WebsiteController::class, 'update'])->name('website.update');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('payment-gateways', [PaymentGatewayController::class, 'index'])->name('payment-gateways.index');
    Route::post('payment-gateways/update', [PaymentGatewayController::class, 'update'])->name('payment-gateways.update');
    Route::get('courier', [CourierController::class, 'index'])->name('courier.index');
    Route::post('courier/update', [CourierController::class, 'update'])->name('courier.update');
    Route::get('social-login', [SocialLoginController::class, 'index'])->name('social-login.index');
    Route::post('social-login/update', [SocialLoginController::class, 'update'])->name('social-login.update');

    // Pathao address API
    Route::get('pathao/cities', [PathaoController::class, 'cities'])->name('pathao.cities');
    Route::get('pathao/zones/{cityId}', [PathaoController::class, 'zones'])->name('pathao.zones');
    Route::get('pathao/areas/{zoneId}', [PathaoController::class, 'areas'])->name('pathao.areas');
    Route::get('marketing', [MarketingController::class, 'index'])->name('marketing.index');
    Route::post('marketing/update', [MarketingController::class, 'update'])->name('marketing.update');
    Route::get('seo', [SeoController::class, 'index'])->name('seo.index');
    Route::post('seo/update', [SeoController::class, 'update'])->name('seo.update');
    Route::post('seo/regenerate-sitemap', [SeoController::class, 'regenerateSitemap'])->name('seo.regenerate-sitemap');
    Route::post('seo/regenerate-rss', [SeoController::class, 'regenerateRss'])->name('seo.regenerate-rss');

    Route::get('home-settings', [HomeSettingsController::class, 'index'])->name('home-settings.index');
    Route::post('home-settings/update', [HomeSettingsController::class, 'update'])->name('home-settings.update');

    Route::resource('pages', PageController::class)->except(['show']);
    
    Route::get('contact-messages', [\App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::get('contact-messages/{contactMessage}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'show'])->name('contact-messages.show');
    Route::post('contact-messages/{contactMessage}/reply', [\App\Http\Controllers\Admin\ContactMessageController::class, 'reply'])->name('contact-messages.reply');
    Route::delete('contact-messages/{contactMessage}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');

    Route::get('newsletter-subscriptions', [NewsletterSubscriptionController::class, 'index'])->name('newsletter-subscriptions.index');
    Route::post('newsletter-subscriptions/{newsletterSubscription}/toggle-status', [NewsletterSubscriptionController::class, 'toggleStatus'])->name('newsletter-subscriptions.toggle-status');
    Route::delete('newsletter-subscriptions/{newsletterSubscription}', [NewsletterSubscriptionController::class, 'destroy'])->name('newsletter-subscriptions.destroy');

    // Order Management
    Route::get('orders/bulk-details', [OrderController::class, 'bulkDetails'])->name('orders.bulk-details');
    Route::get('orders/bulk-invoice', [OrderController::class, 'bulkInvoice'])->name('orders.bulk-invoice');
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::get('orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
    Route::get('orders/{order}/check-fraud', [OrderController::class, 'checkFraud'])->name('orders.check-fraud');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Admin Notifications (JSON endpoints for header bell)
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notificationId}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});
