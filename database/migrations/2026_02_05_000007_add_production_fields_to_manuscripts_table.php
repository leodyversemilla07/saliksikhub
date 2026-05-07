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
        Schema::table('manuscripts', function (Blueprint $table) {
            // Add production stage tracking
            $table->enum('production_stage', [
                'none',               // Not in production yet
                'copyediting',        // Being copyedited
                'typesetting',        // Being laid out
                'proofing',           // Author proofing
                'ready',              // Ready for publication
                'published',           // Published
            ])->default('none')->after('status');

            // Link to current published version
            $table->foreignId('current_publication_id')
                ->nullable()
                ->constrained('publications')
                ->onDelete('set null')
                ->after('production_stage');

            // Production workflow tracking
            $table->foreignId('copyeditor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->after('current_publication_id');

            $table->foreignId('layout_editor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->after('copyeditor_id');

            $table->timestamp('copyediting_started_at')->nullable()->after('layout_editor_id');
            $table->timestamp('copyediting_completed_at')->nullable()->after('copyediting_started_at');
            $table->timestamp('typesetting_started_at')->nullable()->after('copyediting_completed_at');
            $table->timestamp('typesetting_completed_at')->nullable()->after('typesetting_started_at');
            $table->timestamp('proofing_started_at')->nullable()->after('typesetting_completed_at');
            $table->timestamp('proofing_completed_at')->nullable()->after('proofing_started_at');

            // Index for production stage queries
            $table->index('production_stage');
            $table->index('current_publication_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropForeign(['current_publication_id']);
            $table->dropForeign(['copyeditor_id']);
            $table->dropForeign(['layout_editor_id']);

            $table->dropColumn([
                'production_stage',
                'current_publication_id',
                'copyeditor_id',
                'layout_editor_id',
                'copyediting_started_at',
                'copyediting_completed_at',
                'typesetting_started_at',
                'typesetting_completed_at',
                'proofing_started_at',
                'proofing_completed_at',
            ]);
        });
    }
};
