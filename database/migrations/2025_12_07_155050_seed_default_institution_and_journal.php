<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration seeds the default institution and journal for existing data,
     * migrating the system from single-tenant to multi-tenant architecture.
     */
    public function up(): void
    {
        // Only run if there are existing records to migrate
        $hasManuscripts = DB::table('manuscripts')->exists();
        $hasIssues = DB::table('issues')->exists();
        $hasUsers = DB::table('users')->exists();

        if (! $hasManuscripts && ! $hasIssues && ! $hasUsers) {
            return; // No data to migrate
        }

        // Create default institution (Mindoro State University)
        $institutionId = DB::table('institutions')->insertGetId([
            'name' => 'Mindoro State University',
            'slug' => 'minsu',
            'abbreviation' => 'MinSU',
            'domain' => null, // Will be set later based on deployment
            'logo_path' => null,
            'address' => 'Mindoro, Philippines',
            'contact_email' => 'research@minsu.edu.ph',
            'website' => 'https://www.minsu.edu.ph',
            'settings' => json_encode([]),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create default journal (Daluyang Dunong)
        $journalId = DB::table('journals')->insertGetId([
            'institution_id' => $institutionId,
            'name' => 'Daluyang Dunong Multidisciplinary Research Journal',
            'slug' => 'ddmrj',
            'abbreviation' => 'DDMRJ',
            'description' => 'A peer-reviewed multidisciplinary research journal of Mindoro State University.',
            'issn' => null, // To be filled with actual ISSN
            'eissn' => null,
            'logo_path' => null,
            'cover_image_path' => null,
            'submission_guidelines' => null,
            'review_policy' => null,
            'publication_frequency' => 'Bi-annual',
            'settings' => json_encode([]),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Migrate existing manuscripts to the default journal
        if ($hasManuscripts) {
            DB::table('manuscripts')
                ->whereNull('journal_id')
                ->update(['journal_id' => $journalId]);
        }

        // Migrate existing issues to the default journal
        if ($hasIssues) {
            DB::table('issues')
                ->whereNull('journal_id')
                ->update(['journal_id' => $journalId]);
        }

        // Migrate existing users to the default institution
        if ($hasUsers) {
            DB::table('users')
                ->whereNull('institution_id')
                ->update(['institution_id' => $institutionId]);

            // Also create institution_user pivot entries for all users
            $userIds = DB::table('users')->pluck('id');
            foreach ($userIds as $userId) {
                DB::table('institution_user')->insertOrIgnore([
                    'institution_id' => $institutionId,
                    'user_id' => $userId,
                    'is_primary' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Migrate existing role assignments to be journal-scoped (team_id)
        DB::table('model_has_roles')
            ->whereNull('team_id')
            ->update(['team_id' => $journalId]);

        // Assign all existing users with roles to the journal_user pivot
        $usersWithRoles = DB::table('model_has_roles')
            ->where('model_type', 'App\\Models\\User')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('model_has_roles.model_id as user_id', 'roles.name as role_name')
            ->get();

        foreach ($usersWithRoles as $userRole) {
            DB::table('journal_user')->insertOrIgnore([
                'journal_id' => $journalId,
                'user_id' => $userRole->user_id,
                'role' => $userRole->role_name,
                'is_active' => true,
                'assigned_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Clear journal_id from manuscripts
        DB::table('manuscripts')->update(['journal_id' => null]);

        // Clear journal_id from issues
        DB::table('issues')->update(['journal_id' => null]);

        // Clear institution_id from users
        DB::table('users')->update(['institution_id' => null]);

        // Clear team_id from role assignments
        DB::table('model_has_roles')->update(['team_id' => null]);

        // Remove pivot entries
        DB::table('journal_user')->delete();
        DB::table('institution_user')->delete();

        // Remove default journal and institution
        DB::table('journals')->where('slug', 'ddmrj')->delete();
        DB::table('institutions')->where('slug', 'minsu')->delete();
    }
};
