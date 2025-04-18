<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            // User has already verified their email, redirect to their respective dashboard
            return $this->redirectToDashboard($request->user());
        }

        // Render the email verification prompt
        return Inertia::render('auth/verify-email', ['status' => session('status')]);
    }

    /**
     * Redirect to the appropriate dashboard based on user roles.
     */
    protected function redirectToDashboard($user): RedirectResponse
    {
        $roleRoutes = [
            'editor' => 'editor.dashboard',
            'author' => 'author.dashboard',
        ];

        foreach ($roleRoutes as $role => $route) {
            if ($user->hasRole($role)) {
                return redirect()->intended(route($route, absolute: false));
            }
        }

        // Fallback to default dashboard
        return redirect()->intended(route('dashboard', absolute: false));
    }
}
