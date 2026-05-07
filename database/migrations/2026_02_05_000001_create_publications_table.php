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
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');

            // Version information
            $table->integer('version_major')->default(1);
            $table->integer('version_minor')->default(0);
            $table->enum('version_stage', [
                'preprint',           // Author Original (AO)
                'under_review',       // Published Manuscript Under Review (PMUR)
                'published',          // Version of Record (VoR)
                'corrected',          // Corrected version
                'retracted',           // Retracted
            ])->default('preprint');

            // Publication status
            $table->enum('status', [
                'draft',              // Being prepared
                'queued',             // Scheduled for publication
                'published',          // Live/public
                'declined',            // Rejected for publication
            ])->default('draft');

            // Access control
            $table->enum('access_status', [
                'open',               // Open access
                'subscription',       // Requires subscription
                'embargo',            // Embargoed until date
                'restricted',          // Restricted access
            ])->default('open');
            $table->date('embargo_date')->nullable();

            // Publication metadata
            $table->string('title')->nullable();
            $table->text('abstract')->nullable();
            $table->json('keywords')->nullable();
            $table->string('language', 10)->default('en');
            $table->string('license_url')->nullable();
            $table->text('copyright_holder')->nullable();
            $table->integer('copyright_year')->nullable();

            // Publishing details
            $table->date('date_published')->nullable();
            $table->date('date_submitted')->nullable();
            $table->date('date_accepted')->nullable();

            // Page information
            $table->string('pages')->nullable();
            $table->integer('page_start')->nullable();
            $table->integer('page_end')->nullable();

            // Identifiers
            $table->string('url_path')->nullable();

            // Cover image
            $table->string('cover_image')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('manuscript_id');
            $table->index('status');
            $table->index('version_stage');
            $table->index('date_published');
            $table->index(['version_major', 'version_minor']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
