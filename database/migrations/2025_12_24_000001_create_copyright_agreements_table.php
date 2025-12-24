<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('copyright_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->enum('agreement_type', ['copyright_transfer', 'license_to_publish', 'creative_commons'])->default('license_to_publish');
            $table->string('license_type')->nullable(); // CC-BY, CC-BY-NC, etc.
            $table->text('terms')->nullable();
            $table->string('agreement_file_path')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->string('signature')->nullable(); // Digital signature or IP address
            $table->boolean('is_signed')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('manuscript_id');
            $table->index('author_id');
            $table->index('is_signed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('copyright_agreements');
    }
};
