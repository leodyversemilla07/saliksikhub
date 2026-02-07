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
        // Add team_id (journal_id) to roles table
        Schema::table('roles', function (Blueprint $table) {
            if (! Schema::hasColumn('roles', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('guard_name');
                $table->index('team_id');
            }
        });

        // Add team_id to model_has_roles table
        Schema::table('model_has_roles', function (Blueprint $table) {
            if (! Schema::hasColumn('model_has_roles', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('model_type');
                $table->index('team_id');
            }
        });

        // Add team_id to model_has_permissions table
        Schema::table('model_has_permissions', function (Blueprint $table) {
            if (! Schema::hasColumn('model_has_permissions', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('model_type');
                $table->index('team_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $schema = Schema::getConnection()->getSchemaBuilder();
        $rolesTeamIndexName = null;
        $modelHasRolesTeamIndexName = null;
        $modelHasPermissionsTeamIndexName = null;

        foreach ($schema->getIndexes('roles') as $index) {
            if ($index['columns'] === ['team_id']) {
                $rolesTeamIndexName = $index['name'];
                break;
            }
        }

        foreach ($schema->getIndexes('model_has_roles') as $index) {
            if ($index['columns'] === ['team_id']) {
                $modelHasRolesTeamIndexName = $index['name'];
                break;
            }
        }

        foreach ($schema->getIndexes('model_has_permissions') as $index) {
            if ($index['columns'] === ['team_id']) {
                $modelHasPermissionsTeamIndexName = $index['name'];
                break;
            }
        }

        Schema::table('roles', function (Blueprint $table) use ($rolesTeamIndexName) {
            if (Schema::hasColumn('roles', 'team_id')) {
                if ($rolesTeamIndexName !== null) {
                    $table->dropIndex($rolesTeamIndexName);
                }
                $table->dropColumn('team_id');
            }
        });

        Schema::table('model_has_roles', function (Blueprint $table) use ($modelHasRolesTeamIndexName) {
            if (Schema::hasColumn('model_has_roles', 'team_id')) {
                if ($modelHasRolesTeamIndexName !== null) {
                    $table->dropIndex($modelHasRolesTeamIndexName);
                }
                $table->dropColumn('team_id');
            }
        });

        Schema::table('model_has_permissions', function (Blueprint $table) use ($modelHasPermissionsTeamIndexName) {
            if (Schema::hasColumn('model_has_permissions', 'team_id')) {
                if ($modelHasPermissionsTeamIndexName !== null) {
                    $table->dropIndex($modelHasPermissionsTeamIndexName);
                }
                $table->dropColumn('team_id');
            }
        });
    }
};
