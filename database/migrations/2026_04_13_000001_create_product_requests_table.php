<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('product_name'); // preserved in case product is deleted
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->integer('quantity')->default(1);
            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'contacted', 'fulfilled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_requests');
    }
};
