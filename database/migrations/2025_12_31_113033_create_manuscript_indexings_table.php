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
        Schema::create('manuscript_indexings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->string('database_name');
            $table->enum('status', ['pending', 'submitted', 'indexed', 'failed']);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('indexed_at')->nullable();
            $table->json('metadata_json')->nullable();
            $table->string('external_id')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['manuscript_id', 'database_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_indexings');
    }
};
