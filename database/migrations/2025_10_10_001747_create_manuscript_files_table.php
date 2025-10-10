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
        Schema::create('manuscript_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->onDelete('cascade');
            $table->enum('file_type', ['main_document', 'cover_letter', 'figure', 'table', 'supplementary']);
            $table->string('filename');
            $table->string('storage_path');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('version')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['manuscript_id', 'file_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_files');
    }
};
