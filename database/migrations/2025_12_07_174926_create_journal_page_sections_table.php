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
        Schema::create('journal_page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_page_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Internal name for the section
            $table->enum('type', [
                'hero',           // Hero banner with title, subtitle, CTA
                'text',           // Rich text content
                'cards',          // Card grid (features, team members, etc.)
                'statistics',     // Statistics/metrics display
                'cta',            // Call to action section
                'image_text',     // Image with text side by side
                'accordion',      // FAQ/Accordion sections
                'contact_form',   // Contact form
                'editorial_board', // Editorial board members
                'recent_issues',  // Recent issues list
                'recent_articles', // Recent articles list
                'announcements',  // Announcements section
                'custom_html',    // Custom HTML block
            ]);
            $table->json('content')->nullable(); // Section-specific content
            $table->json('settings')->nullable(); // Section-specific settings (colors, layout, etc.)
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index(['journal_page_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_page_sections');
    }
};
