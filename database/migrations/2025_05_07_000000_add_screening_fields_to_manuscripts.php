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
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->enum('screening_status', [
                'Pending',
                'Passed',
                'Failed'
            ])->default('Pending')->after('status');
            $table->text('screening_comments')->nullable()->after('screening_status');
            $table->timestamp('screened_at')->nullable()->after('screening_comments');
            $table->foreignId('screened_by')->nullable()->constrained('users')->nullOnDelete()->after('screened_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn([
                'screening_status',
                'screening_comments',
                'screened_at',
                'screened_by'
            ]);
        });
    }
};
