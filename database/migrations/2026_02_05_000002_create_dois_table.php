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
        Schema::create('dois', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic relationship - can be attached to publications, issues, galleys
            $table->string('doiable_type');
            $table->unsignedBigInteger('doiable_id');
            $table->index(['doiable_type', 'doiable_id']);
            
            // DOI information
            $table->string('doi')->unique();  // e.g., 10.1234/journal.v1i1.1
            $table->string('prefix', 50);     // e.g., 10.1234
            $table->string('suffix');         // e.g., journal.v1i1.1
            
            // Registration details
            $table->enum('status', [
                'assigned',           // DOI created but not registered
                'queued',             // Queued for registration
                'deposited',          // Successfully registered
                'error',              // Registration failed
                'stale'               // Needs update
            ])->default('assigned');
            
            $table->enum('registration_agency', [
                'crossref',
                'datacite',
                'medra',
                'other'
            ])->nullable();
            
            // Registration tracking
            $table->timestamp('registered_at')->nullable();
            $table->text('registration_response')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('retry_count')->default(0);
            
            // Metadata
            $table->json('metadata')->nullable();  // Store XML/JSON for re-deposit
            
            $table->timestamps();
            
            // Indexes
            $table->index('doi');
            $table->index('status');
            $table->index('registration_agency');
            $table->index('registered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dois');
    }
};
