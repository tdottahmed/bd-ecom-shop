<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('new_product_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->string('product_name');
            $table->string('category')->nullable();
            $table->text('description');
            $table->string('reference_url')->nullable();
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->decimal('budget', 10, 2)->nullable();
            $table->text('admin_notes')->nullable();
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('new_product_requests');
    }
};
