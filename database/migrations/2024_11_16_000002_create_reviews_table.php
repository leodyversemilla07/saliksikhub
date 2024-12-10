<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade'); // Foreign key to assignments
            $table->text('feedback'); // Detailed feedback provided by the reviewer
            $table->enum('recommendation', ['Accept', 'Minor Revisions', 'Major Revisions', 'Reject'])->default('Accept'); // Review decision
            $table->dateTime('review_date')->default(DB::raw('CURRENT_TIMESTAMP')); // Date the review was completed
            $table->timestamps(); // created_at and updated_at

            // Indexes
            $table->index('assignment_id');
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
