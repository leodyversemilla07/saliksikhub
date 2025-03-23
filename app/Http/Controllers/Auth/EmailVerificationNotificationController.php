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
        $roleRoutes = [
            'admin' => 'admin.dashboard',
            'editor' => 'editor.dashboard',
            'reviewer' => 'reviewer.dashboard',
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
