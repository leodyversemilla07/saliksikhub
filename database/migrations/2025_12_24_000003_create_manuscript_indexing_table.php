<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manuscript_indexing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->cascadeOnDelete();
            $table->string('database_name'); // PubMed, Web of Science, Scopus, CrossRef, etc.
            $table->enum('status', ['pending', 'submitted', 'indexed', 'failed'])->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('indexed_at')->nullable();
            $table->text('metadata_json')->nullable(); // Stored metadata sent to the service
            $table->string('external_id')->nullable(); // ID from the indexing service
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index('manuscript_id');
            $table->index('database_name');
            $table->index('status');
            $table->unique(['manuscript_id', 'database_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manuscript_indexing');
    }
};
