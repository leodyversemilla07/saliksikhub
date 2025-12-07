<?php

namespace App\Http\Middleware;

use App\Models\Journal;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentJournal
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If journal context is already set (e.g., in tests), skip resolution
        if (app()->bound('currentJournal') && app('currentJournal') !== null) {
            $journal = app('currentJournal');

            // In production, set the team ID for journal-scoped roles
            // In tests, team_id is already set to null in Pest.php beforeEach
            if (! app()->runningUnitTests()) {
                setPermissionsTeamId($journal->id);
            }

            return $next($request);
        }

        $journal = $this->resolveJournal($request);

        // If no journal found via routing, try to get the default journal
        if (! $journal) {
            $journal = Journal::with('institution')
                ->where('is_active', true)
                ->first();
        }

        // If still no journal, continue without journal context
        // This allows the system to work in single-journal mode during transition
        if ($journal) {
            if (! $journal->is_active) {
                abort(403, 'This journal is currently inactive');
            }

            // Bind to container for global access
            app()->instance('currentJournal', $journal);
            app()->instance('currentInstitution', $journal->institution);

            // Set Spatie Permission team context for journal-scoped roles
            // Only in production - tests use null team_id for simpler role checks
            if (! app()->runningUnitTests()) {
                setPermissionsTeamId($journal->id);
            }
        }

        return $next($request);
    }

    /**
     * Resolve the journal from the request.
     */
    protected function resolveJournal(Request $request): ?Journal
    {
        // Strategy 1: Check for journal route parameter (path-based: /j/{journal}/...)
        if ($journalSlug = $request->route('journal')) {
            // If it's already a Journal model (route model binding)
            if ($journalSlug instanceof Journal) {
                return $journalSlug;
            }

            return Journal::with('institution')
                ->where('slug', $journalSlug)
                ->first();
        }

        // Strategy 2: Check for subdomain/domain matching
        $host = $request->getHost();

        // 2a: Check if host matches institution domain directly
        $journal = Journal::with('institution')
            ->whereHas('institution', fn ($q) => $q->where('domain', $host))
            ->where('is_active', true)
            ->first();

        if ($journal) {
            return $journal;
        }

        // 2b: Check for journal slug as subdomain (e.g., mrj.saliksikhub.test)
        $parts = explode('.', $host);
        if (count($parts) >= 2) {
            $subdomain = $parts[0];
            $journal = Journal::with('institution')
                ->where('slug', $subdomain)
                ->where('is_active', true)
                ->first();

            if ($journal) {
                return $journal;
            }
        }

        // Strategy 3: Check for institution + journal combo in route
        $institutionSlug = $request->route('institution');
        $journalSlug = $request->route('journalSlug');

        if ($institutionSlug && $journalSlug) {
            return Journal::with('institution')
                ->whereHas('institution', fn ($q) => $q->where('slug', $institutionSlug))
                ->where('slug', $journalSlug)
                ->first();
        }

        // Strategy 4: Check session for user-selected journal
        if ($journalId = $request->session()->get('selected_journal_id')) {
            $journal = Journal::with('institution')
                ->where('id', $journalId)
                ->where('is_active', true)
                ->first();

            if ($journal) {
                return $journal;
            }
        }

        return null;
    }
}
