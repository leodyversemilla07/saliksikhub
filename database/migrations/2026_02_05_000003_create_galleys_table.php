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
        Schema::create('galleys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publication_id')->constrained()->onDelete('cascade');
            
            // Galley details
            $table->string('label', 50);           // e.g., "PDF", "HTML", "ePub", "XML"
            $table->string('locale', 10)->default('en');
            $table->string('file_path');           // S3 path to file
            $table->string('mime_type', 100);      // application/pdf, text/html, etc.
            $table->unsignedBigInteger('file_size')->nullable();  // in bytes
            
            // File metadata
            $table->string('original_filename')->nullable();
            $table->string('remote_url')->nullable();  // If hosted externally
            
            // Display options
            $table->boolean('is_approved')->default(false);
            $table->integer('sequence')->default(0);  // Display order
            
            // Access tracking
            $table->unsignedBigInteger('download_count')->default(0);
            $table->timestamp('last_downloaded_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('publication_id');
            $table->index('label');
            $table->index('mime_type');
            $table->index(['publication_id', 'sequence']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleys');
    }
};
