<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // User has already verified their email, redirect to their respective dashboard
            return $this->redirectToDashboard($request->user());
        }

        // Send the email verification notification
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    /**
     * Redirect to the appropriate dashboard based on user roles.
     */
    protected function redirectToDashboard($user): RedirectResponse
    {
        $roles = $user->getRoleNames(); // Get user roles

        // Determine which dashboard route to redirect to based on roles
        if ($roles->contains('admin')) {
            return redirect()->intended(route('admin.dashboard'));
        } elseif ($roles->contains('editor')) {
            return redirect()->intended(route('editor.dashboard'));
        } elseif ($roles->contains('reviewer')) {
            return redirect()->intended(route('reviewer.dashboard'));
        } elseif ($roles->contains('author')) {
            return redirect()->intended(route('author.dashboard'));
        }

        // Fallback to a default dashboard route if no specific role matches
        return redirect()->intended(route('dashboard'));
    }
}
