<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TeamsPermission
{
    /**
     * Handle an incoming request.
     *
     * Set the team context for Spatie Permission package.
     * For super_admin and global roles, we use team_id = 0.
     * For journal-specific roles, we use the journal_id from session.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! empty(auth()->user())) {
            $user = auth()->user();

            // For super_admin, always use team_id = 0 (global/platform level)
            if ($user->role === 'super_admin') {
                setPermissionsTeamId(0);
            } else {
                // For other roles, use the journal_id from session or default to 0
                $teamId = session('team_id', session('current_journal_id', 0));
                setPermissionsTeamId($teamId);
            }

            // Unset cached relations so new team relations will be loaded
            $user->unsetRelation('roles')->unsetRelation('permissions');
        }

        return $next($request);
    }
}
