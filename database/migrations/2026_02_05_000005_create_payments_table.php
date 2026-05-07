<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('manuscript_id')->nullable()->constrained()->onDelete('set null');

            // Payment type
            $table->enum('payment_type', [
                'submission_fee',
                'publication_charge',
                'subscription_fee',
                'page_charge',
                'color_charge',
                'other',
            ]);

            // Amount
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');

            // Payment status
            $table->enum('status', [
                'pending',
                'processing',
                'completed',
                'failed',
                'refunded',
                'cancelled',
            ])->default('pending');

            // Payment gateway details
            $table->string('payment_gateway')->nullable();  // stripe, paypal, etc.
            $table->string('transaction_id')->unique()->nullable();
            $table->string('gateway_transaction_id')->nullable();
            $table->text('gateway_response')->nullable();

            // Payment method
            $table->string('payment_method')->nullable();  // card, bank_transfer, etc.

            // Dates
            $table->timestamp('paid_at')->nullable();
            $table->decimal('refunded_amount', 10, 2)->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamp('expires_at')->nullable();  // For pending payments

            // Additional info
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();  // Store additional data

            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('manuscript_id');
            $table->index('payment_type');
            $table->index('status');
            $table->index('transaction_id');
            $table->index('gateway_transaction_id');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
