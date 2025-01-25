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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('authors');
            $table->enum('status', ['Published', 'Unpublished', 'Archived'])->default('Published');
            $table->text('abstract');
            $table->string('keywords')->nullable();
            $table->string('doi')->nullable(); // Digital Object Identifier
            $table->string('publication_date');
            $table->string('journal_name');
            $table->string('volume')->nullable();
            $table->string('issue')->nullable();
            $table->string('page_numbers')->nullable();
            $table->string('pdf_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
