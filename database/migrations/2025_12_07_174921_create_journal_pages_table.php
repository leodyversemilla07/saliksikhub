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
        Schema::create('journal_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->enum('type', ['home', 'about', 'editorial_board', 'submission_guidelines', 'contact', 'custom'])->default('custom');
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->boolean('is_published')->default(true);
            $table->boolean('show_in_menu')->default(true);
            $table->integer('menu_order')->default(0);
            $table->timestamps();

            $table->unique(['journal_id', 'slug']);
            $table->index(['journal_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_pages');
    }
};
