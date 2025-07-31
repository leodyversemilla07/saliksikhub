<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\User;
use App\Notifications\AuthorApprovalRequired;
use App\Notifications\ManuscriptDecision as ManuscriptDecisionNotification;
use App\Notifications\ManuscriptPublished;
use App\Notifications\ManuscriptStatusChanged;
use App\Services\StorageService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EditorController extends Controller
{
    /**
     * Display the editor dashboard with metrics and trends.
     */
    public function index()
    {
        // Get date ranges
        $currentMonth = now();
        $lastMonth = now()->subMonth();

        // Basic metrics with trends
        $totalManuscripts = Manuscript::count();

        $newSubmissions = Manuscript::whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $newSubmissionsLastMonth = Manuscript::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $publishedArticles = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $publishedLastMonth = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        // Active reviewers (users with any editor role)
        $activeReviewers = User::role(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor'])->count();

        // Calculate trends
        $submissionsTrend = $newSubmissionsLastMonth > 0
            ? round((($newSubmissions - $newSubmissionsLastMonth) / $newSubmissionsLastMonth) * 100, 1)
            : ($newSubmissions > 0 ? 100 : 0);

        $publishedTrend = $publishedLastMonth > 0
            ? round((($publishedArticles - $publishedLastMonth) / $publishedLastMonth) * 100, 1)
            : ($publishedArticles > 0 ? 100 : 0);

        // Monthly submission data for charts (Jan-Dec of current year)
        $monthlySubmissions = [];
        $year = now()->year;
        $months = [
            'Jan' => 1,
            'Feb' => 2,
            'Mar' => 3,
            'Apr' => 4,
            'May' => 5,
            'Jun' => 6,
            'Jul' => 7,
            'Aug' => 8,
            'Sep' => 9,
            'Oct' => 10,
            'Nov' => 11,
            'Dec' => 12
        ];
        foreach ($months as $monthName => $monthNum) {
            $submissions = Manuscript::whereMonth('created_at', $monthNum)
                ->whereYear('created_at', $year)
                ->count();

            $published = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
                ->whereMonth('created_at', $monthNum)
                ->whereYear('created_at', $year)
                ->count();

            $rejected = Manuscript::where('status', ManuscriptStatus::REJECTED)
                ->whereMonth('created_at', $monthNum)
                ->whereYear('created_at', $year)
                ->count();

            $monthlySubmissions[] = [
                'month' => $monthName,
                'submissions' => $submissions,
                'published' => $published,
                'rejected' => $rejected,
            ];
        }

        // Submission status distribution
        $statusDistribution = [
            [
                'name' => 'Under Review',
                'value' => Manuscript::where('status', ManuscriptStatus::UNDER_REVIEW)->count(),
                'color' => '#3B82F6',
            ],
            [
                'name' => 'Needs Revision',
                'value' => Manuscript::whereIn('status', [
                    ManuscriptStatus::MINOR_REVISION,
                    ManuscriptStatus::MAJOR_REVISION,
                ])->count(),
                'color' => '#8B5CF6',
            ],
            [
                'name' => 'Ready for Decision',
                'value' => Manuscript::where('status', ManuscriptStatus::SUBMITTED)->count(),
                'color' => '#10B981',
            ],
            [
                'name' => 'In Production',
                'value' => Manuscript::whereIn('status', [
                    ManuscriptStatus::ACCEPTED,
                    ManuscriptStatus::IN_COPYEDITING,
                    ManuscriptStatus::AWAITING_APPROVAL,
                    ManuscriptStatus::READY_TO_PUBLISH,
                ])->count(),
                'color' => '#F59E0B',
            ],
        ];

        // Revision rounds distribution
        $revisionRounds = [
            [
                'name' => 'No Revision',
                'value' => Manuscript::where('status', ManuscriptStatus::ACCEPTED)
                    ->orWhere('status', ManuscriptStatus::PUBLISHED)
                    ->whereNull('revision_history')
                    ->count(),
                'color' => '#10B981',
            ],
            [
                'name' => '1 Round',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) = 1')
                    ->count(),
                'color' => '#3B82F6',
            ],
            [
                'name' => '2 Rounds',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) = 2')
                    ->count(),
                'color' => '#F59E0B',
            ],
            [
                'name' => '3+ Rounds',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) >= 3')
                    ->count(),
                'color' => '#EF4444',
            ],
        ];

        // Recent submissions (last 10)
        $recentSubmissions = Manuscript::with('author')
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(function ($manuscript) {
                return [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'author' => $manuscript->author->firstname . ' ' . $manuscript->author->lastname,
                    'status' => $manuscript->status,
                    'submitted_date' => $manuscript->created_at->format('M j, Y'),
                    'days_since_submission' => $manuscript->created_at->diffInDays(now()),
                ];
            });

        // Overdue reviews
        $overdueReviews = Manuscript::where('status', ManuscriptStatus::UNDER_REVIEW)
            ->where('created_at', '<', now()->subDays(30))
            ->count();

        if ($overdueReviews > 0) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Overdue Reviews',
                'message' => "{$overdueReviews} manuscripts have been under review for over 30 days",
                'count' => $overdueReviews,
                'action' => 'View Overdue',
            ];
        }

        // Pending decisions
        $pendingDecisions = Manuscript::whereIn('status', [
            ManuscriptStatus::SUBMITTED,
            ManuscriptStatus::UNDER_REVIEW,
        ])->count();

        if ($pendingDecisions > 0) {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Pending Editorial Decisions',
                'message' => "{$pendingDecisions} manuscripts awaiting editorial action",
                'count' => $pendingDecisions,
                'action' => 'Review Now',
            ];
        }

        $dashboardData = [
            'metrics' => [
                [
                    'title' => 'New Submissions',
                    'value' => (string) $newSubmissions,
                    'trend' => $submissionsTrend >= 0 ? 'up' : 'down',
                    'percentage' => abs($submissionsTrend) . '%',
                    'description' => 'Last 30 days',
                    'color' => 'from-blue-500 to-indigo-600',
                ],
                [
                    'title' => 'Published Articles',
                    'value' => (string) $publishedArticles,
                    'trend' => $publishedTrend >= 0 ? 'up' : 'down',
                    'percentage' => abs($publishedTrend) . '%',
                    'description' => 'Last 30 days',
                    'color' => 'from-green-500 to-emerald-600',
                ],
                [
                    'title' => 'Active Reviewers',
                    'value' => (string) $activeReviewers,
                    'trend' => 'up',
                    'percentage' => '0%',
                    'description' => 'Available reviewers',
                    'color' => 'from-purple-500 to-violet-600',
                ],
                [
                    'title' => 'Total Users',
                    'value' => (string) User::count(),
                    'trend' => 'up',
                    'percentage' => '',
                    'description' => 'Total registered users',
                    'color' => 'from-purple-500 to-indigo-600',
                ]
            ],
            'monthlySubmissions' => $monthlySubmissions,
            'statusDistribution' => $statusDistribution,
            'revisionRounds' => $revisionRounds,
            'recentSubmissions' => $recentSubmissions,
            'stats' => [
                'total_manuscripts' => $totalManuscripts,
                'pending_reviews' => Manuscript::where('status', ManuscriptStatus::SUBMITTED)->count(),
                'pending_decisions' => Manuscript::whereNull('decision_date')->count(),
            ],
        ];

        return Inertia::render('editor/dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }

    /**
     * Display a listing of all manuscripts for editors.
     */
    public function indexManuscripts()
    {
        return Inertia::render('editor/index', [
            'manuscripts' => Manuscript::with('author')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Display the details of a manuscript for editors.
     */
    public function showManuscript($id, StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            $manuscriptUrl = null;
            $finalPdfUrl = null;

            if ($manuscript->manuscript_path) {
                try {
                    $manuscriptUrl = $storageService->generateTemporaryUrl(
                        $manuscript->manuscript_path,
                        5
                    );
                } catch (Exception $e) {
                    logger()->error('Temporary URL Generation Error', [
                        'error_message' => $e->getMessage(),
                        'manuscript_id' => $id,
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }

            if ($manuscript->final_pdf_path) {
                try {
                    $finalPdfUrl = $storageService->generateTemporaryUrl(
                        $manuscript->final_pdf_path,
                        5
                    );
                } catch (Exception $e) {
                    logger()->error('Temporary URL Generation Error', [
                        'error_message' => $e->getMessage(),
                        'manuscript_id' => $id,
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }

            return Inertia::render('manuscripts/show-manuscript', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => explode(', ', $manuscript->keywords),
                    'manuscript_path' => $manuscriptUrl,
                    'final_pdf_path' => $finalPdfUrl,
                    'status' => $manuscript->status,
                    'user_id' => $manuscript->user_id,
                    'created_at' => $manuscript->created_at->toDateTimeString(),
                    'updated_at' => $manuscript->updated_at->toDateTimeString(),
                    'doi' => $manuscript->doi,
                    'volume' => $manuscript->volume,
                    'issue' => $manuscript->issue,
                    'page_range' => $manuscript->page_range,
                    'publication_date' => $manuscript->publication_date ? $manuscript->publication_date->toDateString() : null,
                    'author_approval_date' => $manuscript->author_approval_date ? $manuscript->author_approval_date->toDateString() : null,
                ],
                'user_roles' => Auth::user()->getRoleNames(),
            ]);
        } catch (Exception $e) {
            logger()->error('Manuscript Show Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the manuscript.');
        }
    }

    /**
     * Record an editorial decision for a manuscript.
     */
    public function makeDecision(Request $request, Manuscript $manuscript)
    {
        try {
            Log::info('Decision submission received', [
                'manuscript_id' => $manuscript->id,
                'decision_type' => $request->input('decision'),
                'has_deadline' => $request->has('revision_deadline'),
                'all_request_data' => $request->all(),
            ]);

            $request->validate([
                'decision' => 'required|in:accept,reject,minor_revision,major_revision',
                'comments' => 'required|string|min:10',
                'revision_deadline' => 'nullable|date|after:today',
            ]);

            DB::beginTransaction();

            $decisionType = $request->input('decision');

            $decision = new EditorialDecision;
            $decision->manuscript_id = $manuscript->id;
            $decision->editor_id = Auth::id();
            $decision->decision_type = $decisionType;
            $decision->comments_to_author = $request->input('comments');
            $decision->decision_date = now();
            $decision->status = 'Finalized';

            if ($request->has('revision_deadline')) {
                $decision->revision_deadline = $request->input('revision_deadline');
            }

            $decision->save();

            $previousStatus = $manuscript->status;

            // Local function to map decision type to manuscript status
            $mapDecisionTypeToManuscriptStatus = function ($decisionType) {
                switch ($decisionType) {
                    case 'accept':
                        return ManuscriptStatus::ACCEPTED;
                    case 'reject':
                        return ManuscriptStatus::REJECTED;
                    case 'minor_revision':
                        return ManuscriptStatus::MINOR_REVISION;
                    case 'major_revision':
                        return ManuscriptStatus::MAJOR_REVISION;
                    default:
                        return ManuscriptStatus::SUBMITTED;
                }
            };

            $newStatus = $mapDecisionTypeToManuscriptStatus($decisionType);

            Log::info('Status mapping', [
                'decision_type' => $decisionType,
                'mapped_status' => $newStatus,
                'previous_status' => $previousStatus,
            ]);

            $manuscript->status = $newStatus;
            $manuscript->decision_date = now();
            $manuscript->decision_comments = $request->input('comments');
            $manuscript->save();

            $manuscript->refresh();
            Log::info('Manuscript after update', [
                'id' => $manuscript->id,
                'new_status' => $manuscript->status,
                'status_updated' => $previousStatus !== $manuscript->status,
            ]);

            $author = User::find($manuscript->user_id);
            if ($author) {
                try {
                    $author->notify(new ManuscriptDecisionNotification($manuscript, $decision));

                    if ($previousStatus !== $manuscript->status) {
                        $author->notify(new ManuscriptStatusChanged($manuscript, (string) $previousStatus, (string) $manuscript->status));
                    }
                } catch (Exception $e) {
                    Log::error('Failed to send notification', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id,
                    ]);
                }
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Editorial decision has been recorded.',
                    'redirect' => route('editor.indexManuscripts'),
                ]);
            }

            return redirect()->route('editor.indexManuscripts')
                ->with('success', 'Editorial decision has been recorded.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error recording editorial decision', [
                'error' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'manuscript_id' => $manuscript->id,
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to record editorial decision: ' . $e->getMessage(),
                    'errors' => ['general' => 'Failed to record editorial decision.'],
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to record editorial decision: ' . $e->getMessage());
        }
    }

    /**
     * Set the status of a manuscript to Under Review.
     */
    public function setUnderReview($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            $previousStatus = $manuscript->status;
            $newStatus = ManuscriptStatus::UNDER_REVIEW;

            if ($previousStatus !== $newStatus) {
                $manuscript->status = $newStatus;
                $manuscript->save();

                $author = $manuscript->author;
                $author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    (string) $previousStatus,
                    (string) $newStatus
                ));

                Log::info('Manuscript status changed to Under Review', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $newStatus,
                ]);
            }

            return redirect()->back()->with('success', 'Manuscript is now under review.');
        } catch (Exception $e) {
            Log::error('Error setting manuscript under review', [
                'error' => $e->getMessage(),
                'manuscript_id' => $id,
            ]);

            return redirect()->back()->with('error', 'Failed to update manuscript status.');
        }
    }

    /**
     * Show the form for creating an editorial decision.
     */
    public function createEditorialDecision(Manuscript $manuscript)
    {
        return Inertia::render('editor/create-decision', [
            'manuscript' => $manuscript,
            'decisionTypes' => EditorialDecision::DECISION_TYPES,
        ]);
    }

    /**
     * Start the copy editing process for a manuscript.
     */
    public function startCopyEditing(Manuscript $manuscript)
    {
        try {
            Log::info('Starting copy editing process', [
                'manuscript_id' => $manuscript->id,
                'raw_status' => $manuscript->status,
                'status_type' => gettype($manuscript->status),
                'expected_status' => ManuscriptStatus::ACCEPTED,
                'status_match' => $manuscript->status === ManuscriptStatus::ACCEPTED,
            ]);

            $normalizedCurrentStatus = trim(strtoupper((string) $manuscript->status));
            $normalizedExpectedStatus = trim(strtoupper((string) ManuscriptStatus::ACCEPTED));

            if ($normalizedCurrentStatus !== $normalizedExpectedStatus) {
                Log::warning('Cannot start copy editing - status mismatch', [
                    'manuscript_id' => $manuscript->id,
                    'current_status' => $manuscript->status,
                    'normalized_current' => $normalizedCurrentStatus,
                    'expected_status' => ManuscriptStatus::ACCEPTED,
                    'normalized_expected' => $normalizedExpectedStatus,
                ]);

                if (request()->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Only accepted manuscripts can be sent for copy editing.',
                        'debug' => [
                            'current' => $manuscript->status,
                            'expected' => ManuscriptStatus::ACCEPTED,
                        ],
                    ], 422);
                }

                return redirect()->back()->with('error', 'Only accepted manuscripts can be sent for copy editing.');
            }

            $previousStatus = $manuscript->status;

            $manuscript->status = ManuscriptStatus::IN_COPYEDITING;

            $manuscript->save();

            $manuscript->refresh();
            Log::info('Status updated successfully', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'new_status' => $manuscript->status,
                'verification' => $manuscript->status === ManuscriptStatus::IN_COPYEDITING,
            ]);

            try {
                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    (string) $previousStatus,
                    (string) $manuscript->status
                ));

                Log::info('Manuscript status changed to In Copyediting', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status,
                ]);
            } catch (Exception $e) {
                Log::error('Failed to send status change notification', [
                    'error' => $e->getMessage(),
                    'manuscript_id' => $manuscript->id,
                ]);
            }

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript is now in the copy editing phase',
                ]);
            }

            return redirect()->route('editor.indexManuscripts', $manuscript)
                ->with('success', 'Manuscript is now in the copy editing phase.');
        } catch (Exception $e) {
            Log::error('Exception in startCopyEditing', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'manuscript_id' => $manuscript->id,
            ]);

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to start the copy editing process: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to start the copy editing process: ' . $e->getMessage());
        }
    }

    /**
     * Upload the finalized manuscript PDF after copy editing.
     */
    public function uploadFinalizedManuscript(Request $request, Manuscript $manuscript, StorageService $storageService)
    {
        try {
            $request->validate([
                'manuscript_file' => 'required|file|mimes:pdf|max:20480',
            ]);

            if ($manuscript->status !== ManuscriptStatus::IN_COPYEDITING) {
                Log::warning('Attempted to upload finalized manuscript for manuscript not in copyediting', [
                    'manuscript_id' => $manuscript->id,
                    'current_status' => $manuscript->status,
                    'expected_status' => ManuscriptStatus::IN_COPYEDITING,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'This manuscript is not currently in the copy editing phase.',
                ], 422);
            }

            $previousStatus = $manuscript->status;

            if ($request->hasFile('manuscript_file')) {
                $file = $request->file('manuscript_file');

                $safeTitle = preg_replace('/[^a-z0-9]+/', '-', strtolower($manuscript->title));
                $timestamp = now()->format('YmdHis');
                $filename = "final_{$manuscript->id}_{$timestamp}.pdf";

                $storagePath = $storageService->storeFile(
                    $file,
                    "manuscripts/finalized/{$manuscript->id}",
                    $filename
                );

                $manuscript->final_pdf_path = $storagePath;
                $manuscript->final_manuscript_uploaded_at = now();
                $manuscript->status = ManuscriptStatus::AWAITING_APPROVAL;
                $manuscript->save();

                $manuscript->refresh();

                Log::info('Finalized manuscript uploaded to DO Spaces', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status,
                    'storage_path' => $storagePath,
                    'file_size' => $file->getSize(),
                    'storage_disk' => 'spaces',
                    'uploaded_by' => Auth::id(),
                ]);

                try {
                    $manuscript->author->notify(new AuthorApprovalRequired($manuscript));

                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        (string) $previousStatus,
                        (string) $manuscript->status
                    ));
                } catch (Exception $e) {
                    Log::error('Failed to send notification for finalized manuscript', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id,
                    ]);
                }

                $temporaryUrl = null;
                try {
                    $temporaryUrl = $storageService->generateTemporaryUrl(
                        $storagePath,
                        5
                    );
                } catch (Exception $e) {
                    Log::warning('Could not generate temporary URL', [
                        'error' => $e->getMessage(),
                        'path' => $storagePath,
                    ]);
                }

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Finalized manuscript uploaded successfully. Author has been notified for approval.',
                        'file_path' => $storagePath,
                        'temporary_url' => $temporaryUrl,
                        'redirect' => route('editor.indexManuscripts'),
                    ]);
                }

                return redirect()->route('editor.indexManuscripts')
                    ->with('success', 'Finalized manuscript uploaded successfully. Author has been notified for approval.');
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file was uploaded or the file was invalid.',
                ], 422);
            }

            return redirect()->back()->with('error', 'No file was uploaded or the file was invalid.');
        } catch (Exception $e) {
            Log::error('Error uploading finalized manuscript to DO Spaces', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'manuscript_id' => $manuscript->id,
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload finalized manuscript: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to upload finalized manuscript: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for preparing a manuscript for publication.
     */
    public function showPublicationForm(Manuscript $manuscript)
    {
        if ($manuscript->status !== ManuscriptStatus::READY_TO_PUBLISH) {
            return redirect()->route('editor.indexManuscripts')
                ->with('error', 'Only approved manuscripts can be prepared for publication.');
        }

        $currentVolumes = Manuscript::select('volume')->distinct()->whereNotNull('volume')->orderBy('volume', 'desc')->pluck('volume');
        $currentIssues = Manuscript::select('issue')->distinct()->whereNotNull('issue')->orderBy('issue', 'desc')->pluck('issue');

        return Inertia::render('editor/prepare-publication', [
            'manuscript' => $manuscript,
            'currentVolumes' => $currentVolumes,
            'currentIssues' => $currentIssues,
        ]);
    }

    /**
     * Finalize and publish a manuscript, updating its metadata.
     */
    public function prepareForPublication(Request $request, Manuscript $manuscript)
    {
        try {
            $validated = $request->validate([
                'doi' => 'required|string|max:255|unique:manuscripts,doi,' . $manuscript->id,
                'volume' => 'required|string|max:50',
                'issue' => 'required|string|max:50',
                'page_range' => 'required|string|max:50',
                'publication_date' => 'required|date',
            ]);

            $previousStatus = $manuscript->status;

            DB::beginTransaction();

            $manuscript->doi = $validated['doi'];
            $manuscript->volume = $validated['volume'];
            $manuscript->issue = $validated['issue'];
            $manuscript->page_range = $validated['page_range'];
            $manuscript->publication_date = $validated['publication_date'];
            $manuscript->status = ManuscriptStatus::PUBLISHED;
            $manuscript->published_at = now();
            $manuscript->save();

            Log::info('Manuscript published', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'doi' => $validated['doi'],
                'volume' => $validated['volume'],
                'issue' => $validated['issue'],
            ]);

            try {
                $manuscript->author->notify(new ManuscriptPublished($manuscript));

                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    (string) $previousStatus,
                    (string) $manuscript->status
                ));
            } catch (Exception $e) {
                Log::error('Failed to send publication notification', [
                    'error' => $e->getMessage(),
                    'manuscript_id' => $manuscript->id,
                ]);
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript has been published successfully.',
                    'redirect' => route('editor.indexManuscripts'),
                ]);
            }

            return redirect()->route('editor.indexManuscripts')
                ->with('success', 'Manuscript has been published successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error publishing manuscript', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'manuscript_id' => $manuscript->id,
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to publish manuscript: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to publish manuscript: ' . $e->getMessage());
        }
    }
}
