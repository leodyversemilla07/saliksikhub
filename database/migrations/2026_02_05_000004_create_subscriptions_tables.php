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
        Schema::create('subscription_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->nullable()->constrained()->onDelete('cascade');
            
            // Type details
            $table->string('name');
            $table->text('description')->nullable();
            
            // Pricing
            $table->decimal('cost', 10, 2);
            $table->string('currency', 3)->default('USD');
            
            // Duration
            $table->integer('duration_months');
            
            // Type
            $table->enum('subscription_type', [
                'individual',
                'institutional'
            ])->default('individual');
            
            // Access options
            $table->boolean('format_online')->default(true);
            $table->boolean('format_print')->default(false);
            
            // Institutional options
            $table->integer('concurrent_users')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->integer('sequence')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index('journal_id');
            $table->index('is_active');
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('institution_id')->nullable()->constrained()->onDelete('cascade');
            
            // Subscription period
            $table->date('date_start');
            $table->date('date_end');
            
            // Status
            $table->enum('status', [
                'active',
                'pending',
                'expired',
                'cancelled',
                'suspended'
            ])->default('pending');
            
            // Institutional subscription details
            $table->text('ip_ranges')->nullable();  // JSON array of IP ranges
            $table->string('domain')->nullable();   // Institution domain
            
            // Payment tracking (will be added after payments table exists)
            $table->unsignedBigInteger('payment_id')->nullable();
            
            // Renewal
            $table->boolean('auto_renew')->default(false);
            $table->timestamp('renewal_reminder_sent_at')->nullable();
            
            // Notes
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('subscription_type_id');
            $table->index('user_id');
            $table->index('institution_id');
            $table->index('status');
            $table->index(['date_start', 'date_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('subscription_types');
    }
};
