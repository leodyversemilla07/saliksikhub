<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * Check the user's role from the database `role` column.
     * This bypasses Spatie's team-based role checking for simpler role verification.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Pipe-separated list of allowed roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'User is not authenticated.');
        }

        // Parse roles (they may come as "role1|role2|role3" or as separate arguments)
        $allowedRoles = [];
        foreach ($roles as $role) {
            $allowedRoles = array_merge($allowedRoles, explode('|', $role));
        }

        // Check if user's role matches any allowed role
        if (in_array($user->role, $allowedRoles)) {
            return $next($request);
        }

        abort(403, 'User does not have the required role.');
    }
}
