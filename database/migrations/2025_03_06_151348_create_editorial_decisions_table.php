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
        Schema::create('editorial_decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->foreignId('editor_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('decision_date')->nullable();
            $table->enum('decision_type', ['Accept', 'Minor Revision', 'Major Revision', 'Reject']);
            $table->text('comments_to_author')->nullable();
            $table->string('decision_file_path')->nullable();  // for uploading decision letter PDF
            $table->date('revision_deadline')->nullable();
            $table->enum('status', ['Pending', 'Finalized', 'Archived'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editorial_decisions');
    }
};
