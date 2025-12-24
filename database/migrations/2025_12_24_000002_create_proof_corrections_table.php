<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proof_corrections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->cascadeOnDelete();
            $table->integer('proof_round')->default(1);
            $table->string('proof_file_path')->nullable();
            $table->timestamp('sent_to_author_at')->nullable();
            $table->timestamp('author_responded_at')->nullable();
            $table->text('author_corrections')->nullable();
            $table->enum('status', ['pending', 'approved', 'corrections_needed'])->default('pending');
            $table->string('corrected_proof_path')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('manuscript_id');
            $table->index('proof_round');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proof_corrections');
    }
};
