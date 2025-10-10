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
        Schema::create('manuscript_authors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('author_order')->default(1);
            $table->boolean('is_corresponding')->default(false);
            $table->json('contribution_role')->nullable();
            $table->timestamps();

            $table->unique(['manuscript_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_authors');
    }
};
