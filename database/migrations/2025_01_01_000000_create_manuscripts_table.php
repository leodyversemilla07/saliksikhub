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
        Schema::create('manuscripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('issue_id')->nullable();
            $table->string('title', 255);
            $table->string('slug')->nullable()->unique();
            $table->text('authors');
            $table->text('abstract');
            $table->text('keywords');
            $table->enum('status', [
                'submitted',
                'under_screening',
                'desk_rejected',
                'under_review',
                'awaiting_reviewer_selection',
                'awaiting_reviewer_assignment',
                'in_review',
                'minor_revision_required',
                'major_revision_required',
                'revision_submitted',
                'awaiting_revision',
                'accepted',
                'conditionally_accepted',
                'rejected',
                'in_production',
                'in_copyediting',
                'in_typesetting',
                'awaiting_author_approval',
                'ready_for_publication',
                'published',
                'published_online_first',
                'withdrawn',
                'on_hold',
            ])->default('submitted');
            $table->enum('screening_status', [
                'Pending',
                'Passed',
                'Failed',
            ])->default('Pending');
            $table->text('screening_comments')->nullable();
            $table->timestamp('screened_at')->nullable();
            $table->foreignId('screened_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('revision_history')->nullable();
            $table->text('revision_comments')->nullable();
            $table->timestamp('revised_at')->nullable();
            $table->string('manuscript_path')->nullable();
            $table->foreignId('editor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submission_date')->useCurrent();
            $table->timestamp('decision_date')->nullable();
            $table->text('decision_comments')->nullable();
            $table->date('publication_date')->nullable();
            $table->string('doi', 255)->nullable();
            $table->string('volume', 50)->nullable();
            $table->string('issue', 50)->nullable();
            $table->string('page_range', 50)->nullable();
            $table->string('final_pdf_path')->nullable();
            $table->timestamp('final_manuscript_uploaded_at')->nullable();
            $table->date('author_approval_date')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('issue_id')->references('id')->on('issues')->onDelete('set null');

            // Add indexes for better query performance
            $table->index('status');
            $table->index('submission_date');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscripts');
    }
};
