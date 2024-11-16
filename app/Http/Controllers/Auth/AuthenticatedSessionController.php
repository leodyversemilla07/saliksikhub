<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::user();
        $roles = $user->getRoleNames(); // Get user roles

        // Determine the appropriate dashboard route based on roles
        if ($roles->contains('admin')) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } elseif ($roles->contains('editor')) {
            return redirect()->intended(route('editor.dashboard', absolute: false));
        } elseif ($roles->contains('reviewer')) {
            return redirect()->intended(route('reviewer.dashboard', absolute: false));
        } elseif ($roles->contains('author')) {
            return redirect()->intended(route('author.dashboard', absolute: false));
        }

        // Fallback to a default dashboard route if no specific role matches
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
