<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\PasswordResetResponse;
use Laravel\Fortify\Contracts\ResetsUserPasswords;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Manually bind Fortify contracts
        $this->app->singleton(CreatesNewUsers::class, CreateNewUser::class);
        $this->app->singleton(UpdatesUserProfileInformation::class, UpdateUserProfileInformation::class);
        $this->app->singleton(UpdatesUserPasswords::class, UpdateUserPassword::class);
        $this->app->singleton(ResetsUserPasswords::class, ResetUserPassword::class);

        // Custom login response
        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse
            {
                public function toResponse($request)
                {
                    $user = auth()->user();

                    // Super Admin - check DB role column (team-independent)
                    if ($user->role === 'super_admin') {
                        return redirect()->route('admin.institutions.index');
                    }

                    // For other roles, check both DB column and Spatie roles
                    $role = $user->role;

                    if (in_array($role, ['chief_editor', 'editor_in_chief', 'editor', 'associate_editor', 'managing_editor'])) {
                        return redirect()->route('editor.dashboard');
                    } elseif ($role === 'reviewer') {
                        return redirect()->route('reviewer.dashboard');
                    } elseif ($role === 'author') {
                        return redirect()->route('manuscripts.index');
                    }

                    return redirect('/dashboard');
                }
            };
        });

        // Custom password reset response
        $this->app->singleton(PasswordResetResponse::class, function () {
            return new class implements PasswordResetResponse
            {
                public function toResponse($request)
                {
                    return redirect()->route('login');
                }
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Custom redirect after login based on user role
        Fortify::redirects('login', function () {
            $user = auth()->user();
            $role = $user->role;

            // Super Admin - redirect to admin panel
            if ($role === 'super_admin') {
                return route('admin.institutions.index');
            }

            if (in_array($role, ['chief_editor', 'editor_in_chief', 'managing_editor'])) {
                return route('editor.dashboard');
            } elseif (in_array($role, ['editor', 'associate_editor'])) {
                return route('editor.dashboard');
            } elseif ($role === 'reviewer') {
                return route('reviewer.dashboard');
            } elseif ($role === 'author') {
                return route('manuscripts.index');
            }

            return '/dashboard';
        });

        // Redirect to login after password reset
        Fortify::redirects('password-reset', fn () => route('login'));

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
