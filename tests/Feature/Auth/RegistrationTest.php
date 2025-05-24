<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'firstname' => 'Test',
        'lastname' => 'User',
        'email' => 'test@example.com',
        'affiliation' => 'Test University',
        'country' => 'Test Country',
        'username' => 'testuser123',
        'password' => 'password',
        'password_confirmation' => 'password',
        'data_collection' => true,
        'notifications' => true,
        'review_requests' => true,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('author.dashboard', absolute: false));
});
