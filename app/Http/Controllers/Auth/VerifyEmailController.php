<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // Redirect to the appropriate dashboard after verification
        return $this->redirectToDashboard($request->user());
    }

    /**
     * Redirect to the appropriate dashboard based on user roles.
     */
    protected function redirectToDashboard($user): RedirectResponse
    {
        $roles = $user->getRoleNames(); // Get user roles

        // Determine which dashboard route to redirect to based on roles
        if ($roles->contains('admin')) {
            return redirect()->route('admin.dashboard')->with('success', 'Email verified! Welcome back, Admin.');
        } elseif ($roles->contains('editor')) {
            return redirect()->route('editor.dashboard')->with('success', 'Email verified! Welcome back, Editor.');
        } elseif ($roles->contains('reviewer')) {
            return redirect()->route('reviewer.dashboard')->with('success', 'Email verified! Welcome back, Reviewer.');
        } elseif ($roles->contains('author')) {
            return redirect()->route('author.dashboard')->with('success', 'Email verified! Welcome back, Author.');
        }

        // Fallback to a default dashboard route if no specific role matches
        return redirect()->route('dashboard')->with('success', 'Email verified! Welcome back!');
    }
}
