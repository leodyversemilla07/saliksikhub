<?php

namespace App\Http\Controllers\Editorial;

use App\Enums\ManuscriptStatus;
use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Models\User;
use Inertia\Inertia;

class EditorDashboardController extends Controller
{
    /**
     * Display the editor dashboard with metrics and trends.
     */
    public function index()
    {
        $journal = app('currentJournal');

        $currentMonth = now();
        $lastMonth = now()->subMonth();

        $manuscriptQuery = fn () => Manuscript::query()
            ->when($journal, fn ($q) => $q->where('journal_id', $journal->id));

        $totalManuscripts = $manuscriptQuery()->count();

        $newSubmissions = $manuscriptQuery()->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $newSubmissionsLastMonth = $manuscriptQuery()->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $publishedArticles = $manuscriptQuery()->where('status', ManuscriptStatus::PUBLISHED)
            ->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $publishedLastMonth = $manuscriptQuery()->where('status', ManuscriptStatus::PUBLISHED)
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $activeReviewers = $journal
            ? $journal->users()->wherePivotIn('role', ['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor'])->count()
            : User::role(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor'])->count();

        $totalUsers = $journal
            ? $journal->users()->count()
            : User::count();

        $submissionsTrend = $newSubmissionsLastMonth > 0
            ? round((($newSubmissions - $newSubmissionsLastMonth) / $newSubmissionsLastMonth) * 100, 1)
            : ($newSubmissions > 0 ? 100 : 0);

        $publishedTrend = $publishedLastMonth > 0
            ? round((($publishedArticles - $publishedLastMonth) / $publishedLastMonth) * 100, 1)
            : ($publishedArticles > 0 ? 100 : 0);

        $monthlySubmissions = [];
        $year = now()->year;
        $months = [
            'Jan' => 1, 'Feb' => 2, 'Mar' => 3, 'Apr' => 4,
            'May' => 5, 'Jun' => 6, 'Jul' => 7, 'Aug' => 8,
            'Sep' => 9, 'Oct' => 10, 'Nov' => 11, 'Dec' => 12,
        ];
        foreach ($months as $monthName => $monthNum) {
            $monthlySubmissions[] = [
                'month' => $monthName,
                'submissions' => $manuscriptQuery()->whereMonth('created_at', $monthNum)
                    ->whereYear('created_at', $year)->count(),
                'published' => $manuscriptQuery()->where('status', ManuscriptStatus::PUBLISHED)
                    ->whereMonth('created_at', $monthNum)
                    ->whereYear('created_at', $year)->count(),
                'rejected' => $manuscriptQuery()->where('status', ManuscriptStatus::REJECTED)
                    ->whereMonth('created_at', $monthNum)
                    ->whereYear('created_at', $year)->count(),
            ];
        }

        $statusDistribution = [
            ['name' => 'Under Review', 'value' => $manuscriptQuery()->where('status', ManuscriptStatus::UNDER_REVIEW)->count(), 'color' => '#3B82F6'],
            ['name' => 'Needs Revision', 'value' => $manuscriptQuery()->whereIn('status', [ManuscriptStatus::MINOR_REVISION_REQUIRED, ManuscriptStatus::MAJOR_REVISION_REQUIRED])->count(), 'color' => '#8B5CF6'],
            ['name' => 'Ready for Decision', 'value' => $manuscriptQuery()->where('status', ManuscriptStatus::SUBMITTED)->count(), 'color' => '#10B981'],
            ['name' => 'In Production', 'value' => $manuscriptQuery()->whereIn('status', [ManuscriptStatus::ACCEPTED, ManuscriptStatus::IN_COPYEDITING, ManuscriptStatus::AWAITING_AUTHOR_APPROVAL, ManuscriptStatus::READY_FOR_PUBLICATION])->count(), 'color' => '#F59E0B'],
        ];

        $revisionRounds = [
            ['name' => 'No Revision', 'value' => $manuscriptQuery()->where('status', ManuscriptStatus::ACCEPTED)->orWhere('status', ManuscriptStatus::PUBLISHED)->whereNull('revision_history')->count(), 'color' => '#10B981'],
            ['name' => '1 Round', 'value' => $manuscriptQuery()->whereNotNull('revision_history')->whereRaw('JSON_LENGTH(revision_history) = 1')->count(), 'color' => '#3B82F6'],
            ['name' => '2 Rounds', 'value' => $manuscriptQuery()->whereNotNull('revision_history')->whereRaw('JSON_LENGTH(revision_history) = 2')->count(), 'color' => '#F59E0B'],
            ['name' => '3+ Rounds', 'value' => $manuscriptQuery()->whereNotNull('revision_history')->whereRaw('JSON_LENGTH(revision_history) >= 3')->count(), 'color' => '#EF4444'],
        ];

        $recentSubmissions = $manuscriptQuery()->with('author')
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'author' => $m->author->firstname.' '.$m->author->lastname,
                'status' => $m->status,
                'submitted_date' => $m->created_at->format('M j, Y'),
                'days_since_submission' => $m->created_at->diffInDays(now()),
            ]);

        $overdueReviews = $manuscriptQuery()->where('status', ManuscriptStatus::UNDER_REVIEW)
            ->where('created_at', '<', now()->subDays(30))
            ->count();

        $alerts = [];
        if ($overdueReviews > 0) {
            $alerts[] = ['type' => 'warning', 'title' => 'Overdue Reviews', 'message' => "{$overdueReviews} manuscripts have been under review for over 30 days", 'count' => $overdueReviews, 'action' => 'View Overdue'];
        }

        $pendingDecisions = $manuscriptQuery()->whereIn('status', [ManuscriptStatus::SUBMITTED, ManuscriptStatus::UNDER_REVIEW])->count();
        if ($pendingDecisions > 0) {
            $alerts[] = ['type' => 'info', 'title' => 'Pending Editorial Decisions', 'message' => "{$pendingDecisions} manuscripts awaiting editorial action", 'count' => $pendingDecisions, 'action' => 'Review Now'];
        }

        $dashboardData = [
            'metrics' => [
                ['title' => 'New Submissions', 'value' => (string) $newSubmissions, 'trend' => $submissionsTrend >= 0 ? 'up' : 'down', 'percentage' => abs($submissionsTrend).'%', 'description' => 'Last 30 days', 'color' => 'from-blue-500 to-indigo-600'],
                ['title' => 'Published Articles', 'value' => (string) $publishedArticles, 'trend' => $publishedTrend >= 0 ? 'up' : 'down', 'percentage' => abs($publishedTrend).'%', 'description' => 'Last 30 days', 'color' => 'from-green-500 to-emerald-600'],
                ['title' => 'Active Reviewers', 'value' => (string) $activeReviewers, 'trend' => 'up', 'percentage' => '0%', 'description' => 'Available reviewers', 'color' => 'from-purple-500 to-violet-600'],
                ['title' => 'Total Users', 'value' => (string) $totalUsers, 'trend' => 'up', 'percentage' => '', 'description' => 'Total registered users', 'color' => 'from-purple-500 to-indigo-600'],
            ],
            'monthlySubmissions' => $monthlySubmissions,
            'statusDistribution' => $statusDistribution,
            'revisionRounds' => $revisionRounds,
            'recentSubmissions' => $recentSubmissions,
            'stats' => [
                'total_manuscripts' => $totalManuscripts,
                'pending_reviews' => $manuscriptQuery()->where('status', ManuscriptStatus::SUBMITTED)->count(),
                'pending_decisions' => $manuscriptQuery()->whereNull('decision_date')->count(),
            ],
        ];

        return Inertia::render('editor/dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }
}
