<?php

use Illuminate\Support\Facades\Schema;

test('team_id columns and indexes exist on permission tables', function () {
    $schema = Schema::getConnection()->getSchemaBuilder();

    expect(Schema::hasColumn('roles', 'team_id'))->toBeTrue();
    expect($schema->hasIndex('roles', ['team_id']))->toBeTrue();

    expect(Schema::hasColumn('model_has_roles', 'team_id'))->toBeTrue();
    expect($schema->hasIndex('model_has_roles', ['team_id']))->toBeTrue();

    expect(Schema::hasColumn('model_has_permissions', 'team_id'))->toBeTrue();
    expect($schema->hasIndex('model_has_permissions', ['team_id']))->toBeTrue();
});
