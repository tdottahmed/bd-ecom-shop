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

Route::get('/', [CustomerController::class, 'index'])->name('home');
Route::get('products/{category}', [CustomerController::class, 'category'])->name('products.category');
Route::get('products', [CustomerController::class, 'products'])->name('products.index');
Route::get('product/{product:slug}', [CustomerController::class, 'show'])->name('products.show');

Route::get('api/search', [CustomerController::class, 'search'])->name('api.search');
Route::get('api/categories/{category}/products', [CustomerController::class, 'categoryProducts'])->name('api.categories.products');

Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('rss.xml', [RssController::class, 'index'])->name('rss');

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
