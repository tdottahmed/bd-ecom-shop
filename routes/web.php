<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\Webhook\PathaoWebhookController;

Route::get('/', [CustomerController::class, 'index'])->name('home');
Route::get('products/{category}', [CustomerController::class, 'category'])->name('products.category');
Route::get('products', [CustomerController::class, 'products'])->name('products.index');
Route::get('product/{product:slug}', [CustomerController::class, 'show'])->name('products.show');
Route::get('brands', [CustomerController::class, 'brands'])->name('brands.index');
Route::get('brand/{brand:slug}', [CustomerController::class, 'brand'])->name('brands.show');

Route::get('about-us', [PageController::class, 'about'])->name('pages.about');
Route::get('contact-us', [PageController::class, 'contact'])->name('pages.contact');
Route::get('page/{slug}', [PageController::class, 'show'])->name('pages.show');

Route::get('api/search', [CustomerController::class, 'search'])->name('api.search');
Route::get('api/categories/{category}/products', [CustomerController::class, 'categoryProducts'])->name('api.categories.products');

Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('rss.xml', [RssController::class, 'index'])->name('rss');
Route::post('newsletter/subscribe', [NewsletterSubscriptionController::class, 'store'])->name('newsletter.subscribe');

// Courier webhooks (public — excluded from CSRF by bootstrap/app.php or VerifyCsrfToken)
Route::post('webhooks/pathao', [PathaoWebhookController::class, 'handle'])->name('webhooks.pathao');

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('cart', [CartController::class, 'index'])->name('cart.index');

Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('order-success/{order}', [CheckoutController::class, 'success'])->name('order.success');
Route::post('api/orders/history', [CheckoutController::class, 'getOrders'])->name('api.orders.history');
Route::delete('api/orders/{order}', [CheckoutController::class, 'destroy'])->name('api.orders.destroy');

require __DIR__ . '/admin.php';

require __DIR__ . '/auth.php';
