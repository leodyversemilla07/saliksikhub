<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get('/verify-email');

    $response->assertStatus(200);
});

test('email can be verified', function () {
    $user = User::factory()->unverified()->create();

    // Assign a role to the user (you may need to adjust this based on your setup)
    $user->assignRole('admin'); // Example role assignment

    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    // Check for dynamic redirection based on user role
    if ($user->hasRole('admin')) {
        $response->assertRedirect(route('admin.dashboard', absolute: false).'?verified=1');
    } elseif ($user->hasRole('editor')) {
        $response->assertRedirect(route('editor.dashboard', absolute: false).'?verified=1');
    } elseif ($user->hasRole('reviewer')) {
        $response->assertRedirect(route('reviewer.dashboard', absolute: false).'?verified=1');
    } elseif ($user->hasRole('author')) {
        $response->assertRedirect(route('author.dashboard', absolute: false).'?verified=1');
    } else {
        // Fallback to default dashboard route
        $response->assertRedirect(route('dashboard', absolute: false).'?verified=1');
    }
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});
