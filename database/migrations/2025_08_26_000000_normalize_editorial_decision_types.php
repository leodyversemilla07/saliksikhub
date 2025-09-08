<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Idempotent normalization of common variants to canonical enum values
        DB::table('editorial_decisions')->where('decision_type', 'ACCEPT')->update(['decision_type' => 'Accept']);
        DB::table('editorial_decisions')->where('decision_type', 'accepted')->update(['decision_type' => 'Accept']);
        DB::table('editorial_decisions')->where('decision_type', 'ACCEPTED')->update(['decision_type' => 'Accept']);

        DB::table('editorial_decisions')->where('decision_type', 'MINOR_REVISION')->update(['decision_type' => 'Minor Revision']);
        DB::table('editorial_decisions')->where('decision_type', 'minor_revision')->update(['decision_type' => 'Minor Revision']);
        DB::table('editorial_decisions')->where('decision_type', 'Minor_Rev')->update(['decision_type' => 'Minor Revision']);

        DB::table('editorial_decisions')->where('decision_type', 'MAJOR_REVISION')->update(['decision_type' => 'Major Revision']);
        DB::table('editorial_decisions')->where('decision_type', 'major_revision')->update(['decision_type' => 'Major Revision']);

        DB::table('editorial_decisions')->where('decision_type', 'REJECT')->update(['decision_type' => 'Reject']);
        DB::table('editorial_decisions')->where('decision_type', 'rejected')->update(['decision_type' => 'Reject']);
        DB::table('editorial_decisions')->where('decision_type', 'REJECTED')->update(['decision_type' => 'Reject']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: do not attempt to revert normalized values automatically.
    }
};
