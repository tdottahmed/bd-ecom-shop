<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductRequestController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CustomerAccountController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Payment\BkashController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Payment\SSLCommerzController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Webhook\CarryBeeWebhookController;
use App\Http\Controllers\Webhook\PathaoWebhookController;
use App\Http\Controllers\Webhook\SteadfastWebhookController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('lp/{slug}', [LandingPageController::class, 'show'])->name('landing-page.show');
Route::post('lp/{slug}/order', [LandingPageController::class, 'order'])->name('landing-page.order');

Route::get('/', [CustomerController::class, 'index'])->name('home');
Route::get('products/{category}', [CustomerController::class, 'category'])->name('products.category');
Route::get('products', [CustomerController::class, 'products'])->name('products.index');
Route::get('product/{product:slug}', [CustomerController::class, 'show'])->name('products.show');
Route::get('brands', [CustomerController::class, 'brands'])->name('brands.index');
Route::get('brand/{brand:slug}', [CustomerController::class, 'brand'])->name('brands.show');

Route::get('about-us', [PageController::class, 'about'])->name('pages.about');
Route::get('contact-us', [PageController::class, 'contact'])->name('pages.contact');
Route::post('contact-us', [PageController::class, 'submitContact'])->name('pages.contact.submit');
Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('blog/{blogPost:slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('faq', [PageController::class, 'faq'])->name('pages.faq');
Route::get('privacy-policy', [PageController::class, 'privacyPolicy'])->name('pages.privacy-policy');
Route::get('terms-and-conditions', [PageController::class, 'termsConditions'])->name('pages.terms');
Route::get('page/{slug}', [PageController::class, 'show'])->name('pages.show');

Route::get('api/search', [CustomerController::class, 'search'])->name('api.search');
Route::get('api/categories/{category}/products', [CustomerController::class, 'categoryProducts'])->name('api.categories.products');

Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('rss.xml', [RssController::class, 'index'])->name('rss');
Route::post('newsletter/subscribe', [NewsletterSubscriptionController::class, 'store'])->middleware('throttle:5,1')->name('newsletter.subscribe');

// Courier webhooks (public — excluded from CSRF by bootstrap/app.php or VerifyCsrfToken)
Route::post('webhooks/pathao',    [PathaoWebhookController::class,    'handle'])->name('webhooks.pathao');
Route::post('webhooks/steadfast', [SteadfastWebhookController::class, 'handle'])->name('webhooks.steadfast');
Route::post('webhooks/carrybee',  [CarryBeeWebhookController::class,  'handle'])->name('webhooks.carrybee');

// Payment gateway callbacks (excluded from CSRF — see bootstrap/app.php)
Route::prefix('payment')->name('payment.')->group(function () {
    // SSLCommerz — all callbacks are POST (browser-redirected + IPN)
    Route::post('sslcommerz/success', [SSLCommerzController::class, 'success'])->name('sslcommerz.success');
    Route::post('sslcommerz/fail', [SSLCommerzController::class, 'fail'])->name('sslcommerz.fail');
    Route::post('sslcommerz/cancel', [SSLCommerzController::class, 'cancel'])->name('sslcommerz.cancel');
    Route::post('sslcommerz/ipn', [SSLCommerzController::class, 'ipn'])->name('sslcommerz.ipn');

    // bKash — callback is GET (bKash redirects browser)
    Route::get('bkash/callback', [BkashController::class, 'callback'])->name('bkash.callback');

    // Generic payment failed page
    Route::get('failed', [PaymentController::class, 'failed'])->name('failed');
});

Route::get('/dashboard', function () {
    if (Auth::check() && get_setting('customer_auth_enabled', '0') === '1') {
        return redirect()->route('account.dashboard');
    }

    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('api/product-requests', [ProductRequestController::class, 'store'])->middleware('throttle:10,1')->name('product-requests.store');

Route::get('cart', [CartController::class, 'index'])->name('cart.index');

Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('checkout', [CheckoutController::class, 'store'])->middleware('throttle:10,1')->name('checkout.store');
Route::get('order-success/{order}', [CheckoutController::class, 'success'])->name('order.success');
Route::post('api/orders/history', [CheckoutController::class, 'getOrders'])->name('api.orders.history');
Route::delete('api/orders/{order}', [CheckoutController::class, 'destroy'])->name('api.orders.destroy');

Route::middleware(['auth', 'customer.auth.enabled'])->prefix('account')->name('account.')->group(function () {
    Route::get('/', [CustomerAccountController::class, 'dashboard'])->name('dashboard');
    Route::get('/orders', [CustomerAccountController::class, 'orders'])->name('orders');
    Route::get('/orders/{order}', [CustomerAccountController::class, 'orderShow'])->name('orders.show');
    Route::get('/orders/{order}/invoice', [CustomerAccountController::class, 'orderInvoice'])->name('orders.invoice');
    Route::get('/orders/{order}/invoice/pdf', [CustomerAccountController::class, 'orderInvoicePdf'])->name('orders.invoice.pdf');
    Route::get('/cart', [CustomerAccountController::class, 'cart'])->name('cart');
    Route::get('/profile', [CustomerAccountController::class, 'profile'])->name('profile');
    Route::get('/addresses', [CustomerAccountController::class, 'addresses'])->name('addresses');
    Route::put('/profile', [CustomerAccountController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [CustomerAccountController::class, 'updatePassword'])->name('password.update');
    Route::post('/cart/sync', [CustomerAccountController::class, 'syncCart'])->name('cart.sync');
});

Route::get('storage/link', function () {


    Artisan::call('storage:link');
    $storageLinkOutput = Artisan::output();

    Artisan::call('optimize:clear');
    $optimizeClearOutput = Artisan::output();

    Artisan::call('config:clear');
    $configClearOutput = Artisan::output();

    return response()->json([
        'status' => 'ok',
        'storage:link' => trim($storageLinkOutput),
        'optimize:clear' => trim($optimizeClearOutput),
        'config:clear' => trim($configClearOutput),
    ]);
});

require __DIR__ . '/admin.php';

require __DIR__ . '/auth.php';
