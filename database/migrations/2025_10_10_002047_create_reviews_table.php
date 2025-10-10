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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->integer('review_round')->default(1);
            $table->timestamp('invitation_sent_at')->nullable();
            $table->enum('invitation_response', ['accepted', 'declined'])->nullable();
            $table->timestamp('response_date')->nullable();
            $table->timestamp('review_submitted_at')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->enum('recommendation', ['accept', 'minor_revision', 'major_revision', 'reject'])->nullable();
            $table->text('confidential_comments')->nullable();
            $table->text('author_comments')->nullable();
            $table->unsignedTinyInteger('quality_rating')->nullable();
            $table->unsignedTinyInteger('originality_rating')->nullable();
            $table->unsignedTinyInteger('methodology_rating')->nullable();
            $table->unsignedTinyInteger('significance_rating')->nullable();
            $table->string('annotated_file_path')->nullable();
            $table->enum('status', ['invited', 'accepted', 'in_progress', 'completed', 'declined'])->default('invited');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['manuscript_id', 'reviewer_id']);
            $table->index(['status', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
