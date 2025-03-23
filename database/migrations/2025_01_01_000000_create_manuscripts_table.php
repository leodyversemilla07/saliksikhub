<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('manuscripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title', 255);
            $table->text('authors');
            $table->text('abstract');
            $table->text('keywords');
            $table->enum('status', [
                'Submitted',
                'Under Review',
                'Minor Revision',
                'Major Revision',
                'Accepted',
                'Copyediting',
                'Awaiting Approval',
                'Ready to Publish',
                'Rejected',
                'Published'
            ])->default('Submitted');
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
            $table->timestamp('final_manuscript_uploaded_at')->nullable()->after('final_pdf_path');
            $table->date('author_approval_date')->nullable();
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('status');
            $table->index('submission_date');
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
