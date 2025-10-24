<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    /**
     * Display the reviewer dashboard.
     */
    public function dashboard()
    {
        $user = auth()->user();

        // Get review statistics for this reviewer
        $reviewsCompleted = $user->reviews()->where('status', 'completed')->count();
        $reviewsPending = $user->reviews()->whereIn('status', ['assigned', 'in_progress'])->count();
        $reviewsOverdue = $user->reviews()
            ->whereIn('status', ['assigned', 'in_progress'])
            ->where('deadline', '<', now())
            ->count();

        // Get recent reviews
        $recentReviews = $user->reviews()
            ->with('manuscript')
            ->latest()
            ->take(5)
            ->get();

        // Get review completion rate over time (last 6 months)
        $sixMonthsAgo = now()->subMonths(6);
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $completedInMonth = $user->reviews()
                ->where('status', 'completed')
                ->whereYear('updated_at', $month->year)
                ->whereMonth('updated_at', $month->month)
                ->count();

            $monthlyStats[] = [
                'month' => $month->format('M Y'),
                'completed' => $completedInMonth,
            ];
        }

        // Get average review time (in days)
        $avgReviewTime = $user->reviews()
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(DATEDIFF(completed_at, created_at)) as avg_days')
            ->first()
            ->avg_days ?? 0;

        // Get manuscripts currently under review by this reviewer
        $manuscriptsUnderReview = Manuscript::whereHas('reviews', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->whereIn('status', ['assigned', 'in_progress']);
        })->with('author')->get();

        return Inertia::render('reviewer/dashboard', [
            'manuscriptsUnderReview' => $manuscriptsUnderReview,
            'stats' => [
                'reviews_completed' => $reviewsCompleted,
                'reviews_pending' => $reviewsPending,
                'reviews_overdue' => $reviewsOverdue,
                'avg_review_time' => round($avgReviewTime, 1),
            ],
            'monthlyStats' => $monthlyStats,
            'recentReviews' => $recentReviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'manuscript_title' => $review->manuscript->title,
                    'status' => $review->status,
                    'deadline' => $review->deadline?->format('M j, Y'),
                    'created_at' => $review->created_at->format('M j, Y'),
                    'is_overdue' => $review->deadline && $review->deadline->isPast() && $review->status !== 'completed',
                ];
            }),
        ]);
    }

    /**
     * Display manuscripts available for review.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status', 'all');
        $search = $request->input('search');

        $query = $this->buildManuscriptQuery($status, $search);
        $manuscripts = $this->paginateManuscripts($query, $perPage, $request);

        return Inertia::render('reviewer/index', [
            'manuscripts' => $manuscripts,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Build the manuscript query with filters applied.
     */
    private function buildManuscriptQuery(string $status, ?string $search): \Illuminate\Database\Eloquent\Builder
    {
        $query = Manuscript::where('status', ManuscriptStatus::UNDER_REVIEW)
            ->with('author')
            ->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('authors', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($authorQuery) use ($search) {
                        $authorQuery->where('firstname', 'like', "%{$search}%")
                            ->orWhere('lastname', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * Paginate the manuscripts based on the per page parameter.
     */
    private function paginateManuscripts(\Illuminate\Database\Eloquent\Builder $query, $perPage, Request $request)
    {
        if ($perPage === 'all') {
            $manuscripts = $query->get();
            $total = $manuscripts->count();

            return new \Illuminate\Pagination\LengthAwarePaginator(
                $manuscripts,
                $total,
                $total > 0 ? $total : 1,
                1,
                [
                    'path' => $request->url(),
                    'query' => $request->query(),
                ]
            );
        }

        $perPage = $this->normalizePerPage($perPage);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Normalize the per page parameter to a valid integer.
     */
    private function normalizePerPage($perPage): int
    {
        if (! is_numeric($perPage) || $perPage < 1 || $perPage > 100) {
            return 10;
        }

        return (int) $perPage;
    }

    /**
     * Display the details of a manuscript for reviewers.
     */
    public function show(int $id, \App\Services\StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            return Inertia::render('manuscripts/show-manuscript', [
                'manuscript' => $this->formatManuscriptForDisplay($manuscript, $storageService),
            ]);
        } catch (\Exception $e) {
            logger()->error('Manuscript Show Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the manuscript.');
        }
    }

    /**
     * Format manuscript data for frontend display.
     */
    private function formatManuscriptForDisplay(Manuscript $manuscript, \App\Services\StorageService $storageService): array
    {
        return [
            'id' => $manuscript->id,
            'title' => $manuscript->title,
            'authors' => explode(', ', $manuscript->authors),
            'abstract' => $manuscript->abstract,
            'keywords' => explode(', ', $manuscript->keywords),
            'manuscript_path' => $this->generateTemporaryUrl($manuscript->manuscript_path, $storageService, $manuscript->id, 'manuscript'),
            'final_pdf_path' => $this->generateTemporaryUrl($manuscript->final_pdf_path, $storageService, $manuscript->id, 'final_pdf'),
            'status' => $manuscript->status,
            'user_id' => $manuscript->user_id,
            'created_at' => $manuscript->created_at->toDateTimeString(),
            'updated_at' => $manuscript->updated_at->toDateTimeString(),
            'doi' => $manuscript->doi,
            'volume' => $manuscript->volume,
            'issue' => $manuscript->issue,
            'page_range' => $manuscript->page_range,
            'publication_date' => $manuscript->publication_date?->toDateString(),
        ];
    }

    /**
     * Generate a temporary URL for a file path, handling errors gracefully.
     */
    private function generateTemporaryUrl(?string $path, \App\Services\StorageService $storageService, int $manuscriptId, string $fileType): ?string
    {
        if (! $path) {
            return null;
        }

        try {
            return $storageService->generateTemporaryUrl($path, 5);
        } catch (\Exception $e) {
            logger()->error('Temporary URL Generation Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $manuscriptId,
                'file_type' => $fileType,
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }
}
