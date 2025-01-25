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
        return Inertia::render('Auth/Register');
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
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default role (e.g., author)
        $user->assignRole('author');

        event(new Registered($user));

        Auth::login($user);

        // Assuming you assign roles during registration or have a way to determine the role
        $roles = $user->getRoleNames(); // Get user roles

        // Determine the appropriate dashboard route based on roles
        if ($roles->contains('admin')) {
            return redirect()->route('admin.dashboard')->with('success', 'Registration successful. Welcome!');
        } elseif ($roles->contains('editor')) {
            return redirect()->route('editor.dashboard')->with('success', 'Registration successful. Welcome!');
        } elseif ($roles->contains('reviewer')) {
            return redirect()->route('reviewer.dashboard')->with('success', 'Registration successful. Welcome!');
        } elseif ($roles->contains('author')) {
            return redirect()->route('author.dashboard')->with('success', 'Registration successful. Welcome!');
        }

        return redirect(route('dashboard', absolute: false))->with('success', 'Registration successful. Please log in.');
    }
}
