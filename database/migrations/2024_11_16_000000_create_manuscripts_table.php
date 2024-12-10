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
            $table->string('title');
            $table->string('authors');
            $table->text('abstract');
            $table->string('keywords');
            $table->string('status')->default('Submitted');
            $table->string('manuscript_path')->nullable();
            $table->foreignId('editor_id')->nullable()->constrained('users');
            $table->timestamp('decision_date')->nullable();
            $table->text('decision_comments')->nullable();
            $table->timestamps();
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
