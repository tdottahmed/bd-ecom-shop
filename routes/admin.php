<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\CourierController;
use App\Http\Controllers\Admin\PriceCalculatorController;
use App\Http\Controllers\Admin\MarketingController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
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

  Route::resource('categories', CategoryController::class);
  Route::resource('brands', BrandController::class);

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
  Route::get('marketing', [MarketingController::class, 'index'])->name('marketing.index');
  Route::post('marketing/update', [MarketingController::class, 'update'])->name('marketing.update');
  Route::get('seo', [SeoController::class, 'index'])->name('seo.index');
  Route::post('seo/update', [SeoController::class, 'update'])->name('seo.update');
  Route::post('seo/regenerate-sitemap', [SeoController::class, 'regenerateSitemap'])->name('seo.regenerate-sitemap');
  Route::post('seo/regenerate-rss', [SeoController::class, 'regenerateRss'])->name('seo.regenerate-rss');

  // Order Management
  Route::get('orders/bulk-details', [OrderController::class, 'bulkDetails'])->name('orders.bulk-details');
  Route::get('orders/bulk-invoice', [OrderController::class, 'bulkInvoice'])->name('orders.bulk-invoice');
  Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
  Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
  Route::get('orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
  Route::get('orders/{order}/check-fraud', [OrderController::class, 'checkFraud'])->name('orders.check-fraud');
  Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});
