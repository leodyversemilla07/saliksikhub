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
        // Get manuscripts under review for this reviewer
        // For now, show all manuscripts under review since there's no specific reviewer assignment
        $manuscriptsUnderReview = Manuscript::where('status', ManuscriptStatus::UNDER_REVIEW)
            ->with('author')
            ->latest()
            ->get();

        return Inertia::render('reviewer/dashboard', [
            'manuscriptsUnderReview' => $manuscriptsUnderReview,
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
