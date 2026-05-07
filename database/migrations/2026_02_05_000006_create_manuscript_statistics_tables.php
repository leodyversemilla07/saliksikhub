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
        Schema::create('manuscript_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->foreignId('galley_id')->nullable()->constrained()->onDelete('cascade');

            // COUNTER 5 metrics
            $table->enum('metric_type', [
                'investigation',        // Abstract/landing page view
                'request',              // Full text download
            ]);

            // User identification (for unique counting)
            $table->string('session_id')->nullable();
            $table->string('user_ip')->nullable();
            $table->string('user_agent')->nullable();

            // Geographic data
            $table->string('country_code', 2)->nullable();  // ISO 3166-1 alpha-2
            $table->string('region')->nullable();
            $table->string('city')->nullable();

            // Institution (for SUSHI reporting)
            $table->foreignId('institution_id')->nullable()->constrained()->onDelete('set null');

            // Date/time
            $table->date('metric_date');
            $table->timestamp('metric_time');

            // Referrer
            $table->string('referrer_url')->nullable();

            // Access method
            $table->enum('access_method', [
                'regular',
                'machine',
                'crawler',
            ])->default('regular');

            // Platform
            $table->string('platform')->nullable();  // web, mobile, api

            $table->timestamps();

            // Indexes for fast querying
            $table->index('manuscript_id');
            $table->index('galley_id');
            $table->index('metric_type');
            $table->index('metric_date');
            $table->index('country_code');
            $table->index('institution_id');
            $table->index(['manuscript_id', 'metric_date', 'metric_type'], 'ms_manuscript_date_type_idx');
            $table->index(['session_id', 'metric_date'], 'ms_session_date_idx');
        });

        // Create aggregated statistics table for faster reporting
        Schema::create('manuscript_statistics_aggregated', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');

            // Aggregation period
            $table->date('date');
            $table->enum('period_type', ['daily', 'monthly', 'yearly']);

            // COUNTER 5 metrics
            $table->unsignedBigInteger('total_investigations')->default(0);
            $table->unsignedBigInteger('unique_investigations')->default(0);
            $table->unsignedBigInteger('total_requests')->default(0);
            $table->unsignedBigInteger('unique_requests')->default(0);

            // By format
            $table->json('requests_by_format')->nullable();  // {"PDF": 100, "HTML": 50}

            // Geographic breakdown
            $table->json('by_country')->nullable();  // {"US": 50, "UK": 30}

            $table->timestamps();

            // Unique constraint to prevent duplicates
            $table->unique(['manuscript_id', 'date', 'period_type'], 'ms_agg_manuscript_date_period_unique');

            // Indexes
            $table->index('manuscript_id', 'ms_agg_manuscript_idx');
            $table->index('date', 'ms_agg_date_idx');
            $table->index('period_type', 'ms_agg_period_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_statistics_aggregated');
        Schema::dropIfExists('manuscript_statistics');
    }
};
