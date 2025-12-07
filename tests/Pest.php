<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

use App\Models\Institution;
use App\Models\Journal;
use Database\Seeders\RolesAndPermissionsSeeder;

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    // Set up default journal context for all tests
    $institution = Institution::factory()->create([
        'name' => 'Test University',
        'slug' => 'test-u',
    ]);

    $journal = Journal::factory()->forInstitution($institution)->create([
        'name' => 'Test Journal',
        'slug' => 'test-journal',
    ]);

    app()->instance('currentJournal', $journal);
    app()->instance('currentInstitution', $institution);

    // For tests, we DON'T set the team ID so roles work globally
    // This allows tests to work without complex team scoping setup
    // In production, the middleware will set the proper team ID
    setPermissionsTeamId(null);
});

function something()
{
    // ..
}
