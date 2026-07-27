<?php

namespace App\Http\Controllers\Submission;

use App\Enums\ManuscriptStatus;
use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Models\ManuscriptAuthor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $timeFilter = $request->input('timeFilter', '6months');

        $startDate = match ($timeFilter) {
            '30days' => Carbon::now()->subDays(30),
            '1year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonths(6),
        };

        $manuscriptsQuery = Manuscript::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate);

        $filteredManuscripts = $manuscriptsQuery->orderBy('created_at', 'desc')->get();

        $manuscriptsData = $filteredManuscripts->map(function ($manuscript) {
            return [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'status' => $manuscript->status,
                'created_at' => $manuscript->created_at ? $manuscript->created_at->toIso8601String() : null,
                'updated_at' => $manuscript->updated_at->toIso8601String(),
                'journal' => $manuscript->journal_name,
                'category' => $manuscript->category_name,
            ];
        });

        // ── Action items — manuscripts needing author action ──
        $allManuscripts = Manuscript::where('user_id', $user->id)->get();

        $actionItems = [
            'revisions_needed' => $allManuscripts->filter(fn ($m) => in_array($m->status, [
                ManuscriptStatus::MINOR_REVISION,
                ManuscriptStatus::MAJOR_REVISION,
            ])
            )->values()->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'status' => $m->status,
                'updated_at' => $m->updated_at->toIso8601String(),
                'days_since' => $m->updated_at->diffInDays(now()),
            ]),
            'awaiting_approval' => $allManuscripts->filter(fn ($m) => $m->status === ManuscriptStatus::AWAITING_AUTHOR_APPROVAL
            )->values()->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'status' => $m->status,
                'updated_at' => $m->updated_at->toIso8601String(),
                'days_since' => $m->updated_at->diffInDays(now()),
            ]),
            'under_review' => $allManuscripts->filter(fn ($m) => $m->status === ManuscriptStatus::UNDER_REVIEW
            )->values()->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'status' => $m->status,
                'updated_at' => $m->updated_at->toIso8601String(),
            ]),
        ];

        // ── Co-author summary ──
        $manuscriptIds = $allManuscripts->pluck('id');
        $coAuthorRecords = ManuscriptAuthor::whereIn('manuscript_id', $manuscriptIds)
            ->with('author')
            ->where('user_id', '!=', $user->id)
            ->get();

        $coAuthors = $coAuthorRecords->groupBy('user_id')->map(function ($records, $userId) {
            $author = $records->first()->author;

            return [
                'id' => (int) $userId,
                'name' => $author?->name ?? 'Unknown',
                'email' => $author?->email ?? '',
                'manuscript_count' => $records->count(),
                'is_corresponding' => $records->some(fn ($r) => $r->is_corresponding),
            ];
        })->values();

        // ── Timeline events (recent activity across manuscripts) ──
        $timelineEvents = collect();
        foreach ($allManuscripts as $m) {
            $events = [];

            $events[] = [
                'type' => 'submitted',
                'label' => 'Submitted',
                'date' => $m->created_at->toIso8601String(),
                'manuscript_id' => $m->id,
                'manuscript_title' => $m->title,
            ];

            if (in_array($m->status, [ManuscriptStatus::UNDER_REVIEW, ManuscriptStatus::MINOR_REVISION, ManuscriptStatus::MAJOR_REVISION, ManuscriptStatus::ACCEPTED, ManuscriptStatus::PUBLISHED])) {
                $events[] = [
                    'type' => 'under_review',
                    'label' => 'Under Review',
                    'date' => $m->updated_at->toIso8601String(),
                    'manuscript_id' => $m->id,
                    'manuscript_title' => $m->title,
                ];
            }

            if (in_array($m->status, [ManuscriptStatus::MINOR_REVISION, ManuscriptStatus::MAJOR_REVISION, ManuscriptStatus::ACCEPTED, ManuscriptStatus::PUBLISHED])) {
                $events[] = [
                    'type' => 'revision',
                    'label' => 'Revision Decision',
                    'date' => $m->updated_at->toIso8601String(),
                    'manuscript_id' => $m->id,
                    'manuscript_title' => $m->title,
                ];
            }

            if (in_array($m->status, [ManuscriptStatus::ACCEPTED, ManuscriptStatus::PUBLISHED])) {
                $events[] = [
                    'type' => 'accepted',
                    'label' => 'Accepted',
                    'date' => $m->decision_date?->toIso8601String() ?? $m->updated_at->toIso8601String(),
                    'manuscript_id' => $m->id,
                    'manuscript_title' => $m->title,
                ];
            }

            if ($m->status === ManuscriptStatus::PUBLISHED) {
                $events[] = [
                    'type' => 'published',
                    'label' => 'Published',
                    'date' => $m->publication_date?->toIso8601String() ?? $m->updated_at->toIso8601String(),
                    'manuscript_id' => $m->id,
                    'manuscript_title' => $m->title,
                ];
            }

            if ($m->status === ManuscriptStatus::REJECTED) {
                $events[] = [
                    'type' => 'rejected',
                    'label' => 'Rejected',
                    'date' => $m->decision_date?->toIso8601String() ?? $m->updated_at->toIso8601String(),
                    'manuscript_id' => $m->id,
                    'manuscript_title' => $m->title,
                ];
            }

            $timelineEvents = $timelineEvents->concat($events);
        }

        $timelineEvents = $timelineEvents->sortByDesc('date')->take(10)->values();

        // ── Monthly submission data ──
        $monthlySubmissionData = [];
        $endDate = Carbon::now();
        $currentMonth = $startDate->copy()->startOfMonth();

        while ($currentMonth <= $endDate) {
            $monthName = $currentMonth->shortEnglishMonth;
            $submissionsInMonth = Manuscript::where('user_id', $user->id)
                ->whereYear('created_at', $currentMonth->year)
                ->whereMonth('created_at', $currentMonth->month)
                ->get();
            $monthlySubmissionData[] = [
                'month' => $monthName,
                'submissions' => $submissionsInMonth->count(),
                'accepted' => $submissionsInMonth->whereIn('status', [ManuscriptStatus::ACCEPTED, ManuscriptStatus::PUBLISHED])->count(),
                'rejected' => $submissionsInMonth->where('status', ManuscriptStatus::REJECTED)->count(),
            ];
            $currentMonth->addMonth();
        }

        return Inertia::render('author/dashboard', [
            'manuscripts' => $manuscriptsData,
            'monthlySubmissionData' => $monthlySubmissionData,
            'currentTimeFilter' => $timeFilter,
            'actionItems' => $actionItems,
            'coAuthors' => $coAuthors,
            'timelineEvents' => $timelineEvents,
        ]);
    }
}
