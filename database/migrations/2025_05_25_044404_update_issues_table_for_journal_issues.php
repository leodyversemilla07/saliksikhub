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
        Schema::table('issues', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['assignee_id']);
            $table->dropForeign(['reporter_id']);
            
            // Drop indexes
            $table->dropIndex(['assignee_id', 'status']);
            $table->dropIndex(['reporter_id']);
            $table->dropIndex(['type']);
            $table->dropIndex(['due_date']);
            
            // Drop old bug tracking columns
            $table->dropColumn(['type', 'priority', 'assignee_id', 'reporter_id', 'due_date', 'resolved_at', 'labels', 'attachments']);
            
            // Add journal issue specific columns
            $table->integer('volume_number')->after('id');
            $table->integer('issue_number')->after('volume_number');
            $table->date('publication_date')->nullable()->after('description');
            $table->string('cover_image')->nullable()->after('publication_date');
            $table->string('doi')->nullable()->after('cover_image');
            $table->string('theme')->nullable()->after('doi');
            $table->text('editorial_note')->nullable()->after('theme');
            
            // Update status column to use journal-appropriate statuses
            $table->enum('status', ['draft', 'in_review', 'published', 'archived'])->default('draft')->change();
            
            // Rename title to be more descriptive
            $table->renameColumn('title', 'issue_title');
            
            // Add user_id for the editor who created this issue
            $table->unsignedBigInteger('user_id')->after('editorial_note');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Add unique constraint for volume/issue combination
            $table->unique(['volume_number', 'issue_number'], 'unique_volume_issue');
            
            // Add useful indexes
            $table->index(['status']);
            $table->index(['publication_date']);
            $table->index(['volume_number', 'issue_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            // Restore old columns
            $table->enum('type', ['bug', 'feature', 'improvement', 'question'])->default('bug');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->unsignedBigInteger('assignee_id')->nullable();
            $table->unsignedBigInteger('reporter_id')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->json('labels')->nullable();
            $table->json('attachments')->nullable();
            
            // Drop journal issue columns
            $table->dropForeign(['user_id']);
            $table->dropUnique('unique_volume_issue');
            $table->dropColumn(['volume_number', 'issue_number', 'publication_date', 'cover_image', 'doi', 'theme', 'editorial_note', 'user_id']);
            
            // Restore original status enum
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open')->change();
            
            // Restore original title column name
            $table->renameColumn('issue_title', 'title');
        });
    }
};
