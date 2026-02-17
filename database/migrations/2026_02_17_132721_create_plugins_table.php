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
        Schema::create('plugins', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->string('version');
            $table->string('author')->nullable();
            $table->text('description')->nullable();
            $table->string('path');
            $table->boolean('is_global')->default(false);
            $table->boolean('enabled')->default(false);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->index('name');
            $table->index('enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plugins');
    }
};
