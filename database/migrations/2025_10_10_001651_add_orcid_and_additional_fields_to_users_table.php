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
        Schema::table('users', function (Blueprint $table) {
            $table->string('orcid_id')->unique()->nullable()->after('email');
            $table->text('bio')->nullable()->after('country');
            $table->string('cv_path')->nullable()->after('bio');
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['orcid_id', 'bio', 'cv_path', 'last_login_at']);
        });
    }
};
