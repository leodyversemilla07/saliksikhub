<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstalled
{
    /**
     * In-memory flag to avoid repeated checks within the same process.
     */
    private static bool $installed = false;

    /**
     * Handle an incoming request.
     *
     * Redirects to the installation wizard if the platform has not been set up yet.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Never block install routes (prevents redirect loop)
        if ($request->is('install*')) {
            return $next($request);
        }

        // Fast path: in-memory flag (survives within same process)
        if (self::$installed) {
            return $next($request);
        }

        // Second fast path: check cache (survives across requests in production)
        if (Cache::get('platform_installed')) {
            self::$installed = true;

            return $next($request);
        }

        try {
            $hasAdmin = User::where('role', 'super_admin')->exists();

            if ($hasAdmin) {
                // Cache forever so subsequent requests skip the query
                Cache::forever('platform_installed', true);
                self::$installed = true;

                return $next($request);
            }
        } catch (\Exception $e) {
            // Database not available or migrations not run — redirect to installer
        }

        return redirect('/install');
    }

    /**
     * Reset the installed state. Used for testing.
     */
    public static function resetInstallState(): void
    {
        self::$installed = false;
        Cache::forget('platform_installed');
    }

    /**
     * Mark the platform as installed. Used for testing.
     */
    public static function markInstalled(): void
    {
        self::$installed = true;
        Cache::forever('platform_installed', true);
    }
}
