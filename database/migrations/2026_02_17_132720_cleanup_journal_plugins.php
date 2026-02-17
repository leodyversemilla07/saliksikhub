<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('journal_plugins');
    }

    public function down(): void
    {
        // This is just to clean up, no rollback needed
    }
};
