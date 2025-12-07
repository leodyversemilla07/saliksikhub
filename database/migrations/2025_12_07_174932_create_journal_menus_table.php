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
        Schema::create('journal_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('journal_menus')->onDelete('cascade');
            $table->string('label');
            $table->string('url')->nullable(); // For external links
            $table->foreignId('journal_page_id')->nullable()->constrained()->onDelete('set null'); // For internal pages
            $table->enum('location', ['header', 'footer', 'both'])->default('header');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('open_in_new_tab')->default(false);
            $table->timestamps();

            $table->index(['journal_id', 'location', 'order']);
        });

        // Add theme/appearance settings to journals table
        Schema::table('journals', function (Blueprint $table) {
            $table->json('theme_settings')->nullable()->after('settings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_menus');

        Schema::table('journals', function (Blueprint $table) {
            $table->dropColumn('theme_settings');
        });
    }
};
