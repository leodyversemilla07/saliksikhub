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
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
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
