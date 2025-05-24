<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role; // Import Role model if using Spatie's package

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'affiliation' => 'required|string|max:255',
            'country' => 'required|string|max:255', // Added country validation
            'username' => 'required|string|max:255|unique:'.User::class, // Added username validation
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'data_collection' => 'required|boolean', // Added data_collection validation
            'notifications' => 'required|boolean', // Added notifications validation
            'review_requests' => 'required|boolean', // Added review_requests validation
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'affiliation' => $request->affiliation,
            'country' => $request->country, // Added country
            'username' => $request->username, // Added username
            'password' => Hash::make($request->password),
            'data_collection' => $request->data_collection, // Added data_collection
            'notifications' => $request->notifications, // Added notifications
            'review_requests' => $request->review_requests, // Added review_requests
        ]);

        $user->assignRole('author');

        event(new Registered($user));

        Auth::login($user);

        $roleRoutes = [
            'admin' => 'admin.dashboard',
            'editor' => 'editor.dashboard',
            'reviewer' => 'reviewer.dashboard',
            'author' => 'author.dashboard',
        ];

        foreach ($roleRoutes as $role => $route) {
            if ($user->hasRole($role)) {
                return redirect()->route($route)->with('success', 'Registration successful. Welcome!');
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Registration successful. Please log in.');
    }
}
