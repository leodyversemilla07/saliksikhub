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
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->integer('volume_number');
            $table->integer('issue_number');
            $table->string('issue_title');
            $table->text('description');
            $table->date('publication_date')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('doi')->nullable();
            $table->string('theme')->nullable();
            $table->text('editorial_note')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'in_review', 'published', 'archived'])->default('draft');
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

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
        Schema::dropIfExists('issues');
    }
};
