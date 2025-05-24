<?php

namespace App\Http\Controllers;

use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\User;
use App\Notifications\AuthorApprovalRequired;
use App\Notifications\ManuscriptDecision as ManuscriptDecisionNotification;
use App\Notifications\ManuscriptPublished;
use App\Notifications\ManuscriptStatusChanged;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class EditorController extends Controller
{
    public function index()
    {
        return Inertia::render('editor/dashboard', [
            'dashboardData' => $this->getComprehensiveDashboardData(),
        ]);
    }

    public function indexManuscripts()
    {
        return Inertia::render('editor/index', [
            'manuscripts' => Manuscript::with('author')
                ->latest()
                ->get(),
        ]);
    }

    public function showManuscript($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            $manuscriptUrl = null;
            $finalPdfUrl = null;

            if ($manuscript->manuscript_path) {
                try {
                    $manuscriptUrl = Storage::disk('spaces')->temporaryUrl(
                        $manuscript->manuscript_path,
                        now()->addMinutes(5)
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
                    $finalPdfUrl = Storage::disk('spaces')->temporaryUrl(
                        $manuscript->final_pdf_path,
                        now()->addMinutes(5)
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
                'user_role' => Auth::user()->role,
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

    public function makeDecision(Request $request, Manuscript $manuscript)
    {
        try {
            Log::info('Decision submission received', [
                'manuscript_id' => $manuscript->id,
                'decision_type' => $request->input('decision'),
                'has_deadline' => $request->has('revision_deadline'),
                'all_request_data' => $request->all()
            ]);

            DB::beginTransaction();

            $validated = $this->validateDecision($request);

            $decisionType = $this->normalizeDecisionType($request->input('decision'));

            $decision = new EditorialDecision();
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

            $newStatus = $this->mapDecisionTypeToManuscriptStatus($decisionType);

            Log::info('Status mapping', [
                'decision_type' => $decisionType,
                'mapped_status' => $newStatus,
                'previous_status' => $previousStatus
            ]);

            $manuscript->status = $newStatus;
            $manuscript->decision_date = now();
            $manuscript->decision_comments = $request->input('comments');
            $manuscript->save();

            $manuscript->refresh();
            Log::info('Manuscript after update', [
                'id' => $manuscript->id,
                'new_status' => $manuscript->status,
                'status_updated' => $previousStatus !== $manuscript->status
            ]);

            $author = User::find($manuscript->user_id);
            if ($author) {
                try {
                    $author->notify(new ManuscriptDecisionNotification($manuscript, $decision));

                    if ($previousStatus !== $manuscript->status) {
                        $author->notify(new ManuscriptStatusChanged($manuscript, $previousStatus, $manuscript->status));
                    }
                } catch (Exception $e) {
                    Log::error('Failed to send notification', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id
                    ]);
                }
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Editorial decision has been recorded.',
                    'redirect' => route('editor.indexManuscripts')
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
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to record editorial decision: ' . $e->getMessage(),
                    'errors' => ['general' => 'Failed to record editorial decision.']
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to record editorial decision: ' . $e->getMessage());
        }
    }

    private function normalizeDecisionType(string $decisionType): string
    {
        $mapping = [
            'accept' => 'Accept',
            'minor_revision' => 'Minor Revision',
            'major_revision' => 'Major Revision',
            'reject' => 'Reject'
        ];

        return $mapping[$decisionType] ?? 'Minor Revision';
    }

    private function mapDecisionTypeToManuscriptStatus(string $decisionType): string
    {
        switch ($decisionType) {
            case 'Accept':
                return 'Accepted';
            case 'Reject':
                return 'Rejected';
            case 'Minor Revision':
                return 'Minor Revision';
            case 'Major Revision':
                return 'Major Revision';
            default:
                return 'Submitted';
        }
    }

    private function validateDecision(Request $request)
    {
        return $request->validate([
            'decision' => 'required|in:accept,reject,minor_revision,major_revision',
            'comments' => 'required|string|min:10',
            'revision_deadline' => 'nullable|date|after:today',
        ]);
    }

    public function setUnderReview($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            $previousStatus = $manuscript->status;
            $newStatus = Manuscript::STATUSES['UNDER_REVIEW'];

            if ($previousStatus !== $newStatus) {
                $manuscript->status = $newStatus;
                $manuscript->save();

                $author = $manuscript->author;
                $author->notify(new ManuscriptStatusChanged($manuscript, $previousStatus, $newStatus));

                Log::info('Manuscript status changed to Under Review', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $newStatus
                ]);
            }

            return redirect()->back()->with('success', 'Manuscript is now under review.');
        } catch (Exception $e) {
            Log::error('Error setting manuscript under review', [
                'error' => $e->getMessage(),
                'manuscript_id' => $id
            ]);

            return redirect()->back()->with('error', 'Failed to update manuscript status.');
        }
    }

    private function getDashboardStats()
    {
        return [
            'total_manuscripts' => Manuscript::count(),
            'pending_reviews' => Manuscript::where('status', Manuscript::STATUSES['SUBMITTED'])->count(),
            'pending_decisions' => Manuscript::whereNull('decision_date')->count(),
        ];
    }

    private function getComprehensiveDashboardData()
    {
        // Get date ranges
        $currentMonth = now();
        $lastMonth = now()->subMonth();
        $startOfYear = now()->startOfYear();
        
        // Basic metrics with trends
        $totalManuscripts = Manuscript::count();
        $totalLastMonth = Manuscript::where('created_at', '<', $currentMonth->startOfMonth())->count();
        
        $newSubmissions = Manuscript::whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $newSubmissionsLastMonth = Manuscript::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();
        
        $publishedArticles = Manuscript::where('status', Manuscript::STATUSES['PUBLISHED'])
            ->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $publishedLastMonth = Manuscript::where('status', Manuscript::STATUSES['PUBLISHED'])
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();
        
        // Active reviewers (users with editor role)
        $activeReviewers = User::where('role', 'editor')->count();
        
        // Calculate trends
        $submissionsTrend = $newSubmissionsLastMonth > 0 
            ? round((($newSubmissions - $newSubmissionsLastMonth) / $newSubmissionsLastMonth) * 100, 1)
            : ($newSubmissions > 0 ? 100 : 0);
        
        $publishedTrend = $publishedLastMonth > 0 
            ? round((($publishedArticles - $publishedLastMonth) / $publishedLastMonth) * 100, 1)
            : ($publishedArticles > 0 ? 100 : 0);
        
        // Monthly submission data for charts (last 12 months)
        $monthlySubmissions = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('M');
            
            $submissions = Manuscript::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            
            $published = Manuscript::where('status', Manuscript::STATUSES['PUBLISHED'])
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            
            $rejected = Manuscript::where('status', Manuscript::STATUSES['REJECTED'])
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            
            $monthlySubmissions[] = [
                'month' => $month,
                'submissions' => $submissions,
                'published' => $published,
                'rejected' => $rejected
            ];
        }
        
        // Submission status distribution
        $statusDistribution = [
            [
                'name' => 'Under Review',
                'value' => Manuscript::where('status', Manuscript::STATUSES['UNDER_REVIEW'])->count(),
                'color' => '#3B82F6'
            ],
            [
                'name' => 'Needs Revision',
                'value' => Manuscript::whereIn('status', [
                    Manuscript::STATUSES['MINOR_REVISION'],
                    Manuscript::STATUSES['MAJOR_REVISION']
                ])->count(),
                'color' => '#8B5CF6'
            ],
            [
                'name' => 'Ready for Decision',
                'value' => Manuscript::where('status', Manuscript::STATUSES['SUBMITTED'])->count(),
                'color' => '#10B981'
            ],
            [
                'name' => 'In Production',
                'value' => Manuscript::whereIn('status', [
                    Manuscript::STATUSES['ACCEPTED'],
                    Manuscript::STATUSES['IN_COPYEDITING'],
                    Manuscript::STATUSES['AWAITING_APPROVAL'],
                    Manuscript::STATUSES['READY_TO_PUBLISH']
                ])->count(),
                'color' => '#F59E0B'
            ]
        ];
        
        // Revision rounds distribution
        $revisionRounds = [
            [
                'name' => 'No Revision',
                'value' => Manuscript::where('status', Manuscript::STATUSES['ACCEPTED'])
                    ->orWhere('status', Manuscript::STATUSES['PUBLISHED'])
                    ->whereNull('revision_history')
                    ->count(),
                'color' => '#10B981'
            ],
            [
                'name' => '1 Round',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) = 1')
                    ->count(),
                'color' => '#3B82F6'
            ],
            [
                'name' => '2 Rounds',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) = 2')
                    ->count(),
                'color' => '#F59E0B'
            ],
            [
                'name' => '3+ Rounds',
                'value' => Manuscript::whereNotNull('revision_history')
                    ->whereRaw('JSON_LENGTH(revision_history) >= 3')
                    ->count(),
                'color' => '#EF4444'
            ]
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
                    'days_since_submission' => $manuscript->created_at->diffInDays(now())
                ];
            });
        
        // Overdue reviews
        $overdueReviews = Manuscript::where('status', Manuscript::STATUSES['UNDER_REVIEW'])
            ->where('created_at', '<', now()->subDays(30))
            ->count();
        
        if ($overdueReviews > 0) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Overdue Reviews',
                'message' => "{$overdueReviews} manuscripts have been under review for over 30 days",
                'count' => $overdueReviews,
                'action' => 'View Overdue'
            ];
        }
        
        // Pending decisions
        $pendingDecisions = Manuscript::whereIn('status', [
            Manuscript::STATUSES['SUBMITTED'],
            Manuscript::STATUSES['UNDER_REVIEW']
        ])->count();
        
        if ($pendingDecisions > 0) {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Pending Editorial Decisions',
                'message' => "{$pendingDecisions} manuscripts awaiting editorial action",
                'count' => $pendingDecisions,
                'action' => 'Review Now'
            ];
        }
        
        return [
            'metrics' => [
                [
                    'title' => 'New Submissions',
                    'value' => (string)$newSubmissions,
                    'trend' => $submissionsTrend >= 0 ? 'up' : 'down',
                    'percentage' => abs($submissionsTrend) . '%',
                    'description' => 'Last 30 days',
                    'color' => 'from-blue-500 to-indigo-600'
                ],
                [
                    'title' => 'Published Articles',
                    'value' => (string)$publishedArticles,
                    'trend' => $publishedTrend >= 0 ? 'up' : 'down',
                    'percentage' => abs($publishedTrend) . '%',
                    'description' => 'Last 30 days',
                    'color' => 'from-green-500 to-emerald-600'
                ],
                [
                    'title' => 'Active Reviewers',
                    'value' => (string)$activeReviewers,
                    'trend' => 'up',
                    'percentage' => '0%',
                    'description' => 'Available reviewers',
                    'color' => 'from-purple-500 to-violet-600'
                ]
            ],
            'monthlySubmissions' => $monthlySubmissions,
            'statusDistribution' => $statusDistribution,
            'revisionRounds' => $revisionRounds,
            'recentSubmissions' => $recentSubmissions,
            'stats' => [
                'total_manuscripts' => $totalManuscripts,
                'pending_reviews' => Manuscript::where('status', Manuscript::STATUSES['SUBMITTED'])->count(),
                'pending_decisions' => Manuscript::whereNull('decision_date')->count(),
            ]
        ];
    }

    public function showEditorialDecisions(Manuscript $manuscript)
    {
        $decisions = $manuscript->editorialDecisions()
            ->with('editor')
            ->latest('decision_date')
            ->get();

        return Inertia::render('editor/manuscript-decisions', [
            'manuscript' => $manuscript,
            'decisions' => $decisions,
        ]);
    }

    public function createEditorialDecision(Manuscript $manuscript)
    {
        return Inertia::render('editor/create-decision', [
            'manuscript' => $manuscript,
            'decisionTypes' => EditorialDecision::DECISION_TYPES,
        ]);
    }

    public function manageUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $users = User::where('id', '!=', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/user-management', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|in:author,editor',
            'affiliation' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'affiliation' => $validated['affiliation'] ?? null,
        ]);

        Log::info('User created by admin', [
            'user_id' => $user->id,
            'admin_id' => Auth::id(),
            'role' => $user->role,
        ]);

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $rules = [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:author,editor',
            'affiliation' => 'nullable|string|max:255',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
        }

        $validated = $request->validate($rules);

        $user->firstname = $validated['firstname'];
        $user->lastname = $validated['lastname'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (isset($validated['affiliation'])) {
            $user->affiliation = $validated['affiliation'];
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'exists:users,id',
        ]);

        $userIds = $request->userIds;

        if (in_array(Auth::id(), $userIds)) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
                'errors' => ['userIds' => 'Your account was included in the selection and cannot be deleted.'],
            ], 422);
        }

        User::whereIn('id', $userIds)->delete();

        return redirect()->back()->with('success', count($userIds) . ' users deleted successfully');
    }

    public function startCopyEditing(Manuscript $manuscript)
    {
        try {
            Log::info('Starting copy editing process', [
                'manuscript_id' => $manuscript->id,
                'raw_status' => $manuscript->status,
                'status_type' => gettype($manuscript->status),
                'expected_status' => Manuscript::STATUSES['ACCEPTED'],
                'status_match' => $manuscript->status === Manuscript::STATUSES['ACCEPTED'],
            ]);

            $normalizedCurrentStatus = trim(strtoupper($manuscript->status));
            $normalizedExpectedStatus = trim(strtoupper(Manuscript::STATUSES['ACCEPTED']));

            if ($normalizedCurrentStatus !== $normalizedExpectedStatus) {
                Log::warning('Cannot start copy editing - status mismatch', [
                    'manuscript_id' => $manuscript->id,
                    'current_status' => $manuscript->status,
                    'normalized_current' => $normalizedCurrentStatus,
                    'expected_status' => Manuscript::STATUSES['ACCEPTED'],
                    'normalized_expected' => $normalizedExpectedStatus
                ]);

                if (request()->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Only accepted manuscripts can be sent for copy editing.',
                        'debug' => [
                            'current' => $manuscript->status,
                            'expected' => Manuscript::STATUSES['ACCEPTED']
                        ]
                    ], 422);
                }
                return redirect()->back()->with('error', 'Only accepted manuscripts can be sent for copy editing.');
            }

            $previousStatus = $manuscript->status;

            $manuscript->status = 'Copyediting';

            $manuscript->save();

            $manuscript->refresh();
            Log::info('Status updated successfully', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'new_status' => $manuscript->status,
                'verification' => $manuscript->status === Manuscript::STATUSES['IN_COPYEDITING']
            ]);

            try {
                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    $previousStatus,
                    $manuscript->status
                ));

                Log::info('Manuscript status changed to In Copyediting', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status
                ]);
            } catch (Exception $e) {
                Log::error('Failed to send status change notification', [
                    'error' => $e->getMessage(),
                    'manuscript_id' => $manuscript->id
                ]);
            }

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript is now in the copy editing phase'
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
                'manuscript_id' => $manuscript->id
            ]);

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to start the copy editing process: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to start the copy editing process: ' . $e->getMessage());
        }
    }

    public function uploadFinalizedManuscript(Request $request, Manuscript $manuscript)
    {
        try {
            $request->validate([
                'manuscript_file' => 'required|file|mimes:pdf|max:20480',
            ]);

            if ($manuscript->status !== Manuscript::STATUSES['IN_COPYEDITING']) {
                Log::warning('Attempted to upload finalized manuscript for manuscript not in copyediting', [
                    'manuscript_id' => $manuscript->id,
                    'current_status' => $manuscript->status,
                    'expected_status' => Manuscript::STATUSES['IN_COPYEDITING']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'This manuscript is not currently in the copy editing phase.'
                ], 422);
            }

            $previousStatus = $manuscript->status;

            if ($request->hasFile('manuscript_file')) {
                $file = $request->file('manuscript_file');

                $safeTitle = preg_replace('/[^a-z0-9]+/', '-', strtolower($manuscript->title));
                $timestamp = now()->format('YmdHis');
                $filename = "final_{$manuscript->id}_{$timestamp}.pdf";

                $storagePath = "manuscripts/finalized/{$manuscript->id}/{$filename}";

                Storage::disk('spaces')->put($storagePath, file_get_contents($file), [
                    'visibility' => 'private',
                    'ContentType' => 'application/pdf',
                    'ContentDisposition' => 'inline; filename="' . $filename . '"'
                ]);

                $manuscript->final_pdf_path = $storagePath;
                $manuscript->final_manuscript_uploaded_at = now();
                $manuscript->status = Manuscript::STATUSES['AWAITING_APPROVAL'];
                $manuscript->save();

                $manuscript->refresh();

                Log::info('Finalized manuscript uploaded to DO Spaces', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status,
                    'storage_path' => $storagePath,
                    'file_size' => $file->getSize(),
                    'storage_disk' => 'spaces',
                    'uploaded_by' => Auth::id()
                ]);

                try {
                    $manuscript->author->notify(new AuthorApprovalRequired($manuscript));

                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        $previousStatus,
                        $manuscript->status
                    ));
                } catch (Exception $e) {
                    Log::error('Failed to send notification for finalized manuscript', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id
                    ]);
                }

                $temporaryUrl = null;
                try {
                    $temporaryUrl = Storage::disk('spaces')->temporaryUrl(
                        $storagePath,
                        now()->addMinutes(5)
                    );
                } catch (Exception $e) {
                    Log::warning('Could not generate temporary URL', [
                        'error' => $e->getMessage(),
                        'path' => $storagePath
                    ]);
                }

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Finalized manuscript uploaded successfully. Author has been notified for approval.',
                        'file_path' => $storagePath,
                        'temporary_url' => $temporaryUrl,
                        'redirect' => route('editor.indexManuscripts')
                    ]);
                }

                return redirect()->route('editor.indexManuscripts')
                    ->with('success', 'Finalized manuscript uploaded successfully. Author has been notified for approval.');
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file was uploaded or the file was invalid.'
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
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload finalized manuscript: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to upload finalized manuscript: ' . $e->getMessage());
        }
    }

    public function showPublicationForm(Manuscript $manuscript)
    {
        if ($manuscript->status !== Manuscript::STATUSES['READY_TO_PUBLISH']) {
            return redirect()->route('editor.indexManuscripts')
                ->with('error', 'Only approved manuscripts can be prepared for publication.');
        }

        $currentVolumes = Manuscript::select('volume')->distinct()->whereNotNull('volume')->orderBy('volume', 'desc')->pluck('volume');
        $currentIssues = Manuscript::select('issue')->distinct()->whereNotNull('issue')->orderBy('issue', 'desc')->pluck('issue');

        return Inertia::render('Editor/PreparePublication', [
            'manuscript' => $manuscript,
            'currentVolumes' => $currentVolumes,
            'currentIssues' => $currentIssues
        ]);
    }

    public function prepareForPublication(Request $request, Manuscript $manuscript)
    {
        try {
            $validated = $request->validate([
                'doi' => 'required|string|max:255|unique:manuscripts,doi,' . $manuscript->id,
                'volume' => 'required|integer|min:1',
                'issue' => 'required|integer|min:1',
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
            $manuscript->status = Manuscript::STATUSES['PUBLISHED'];
            $manuscript->published_at = now();
            $manuscript->save();

            Log::info('Manuscript published', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'doi' => $validated['doi'],
                'volume' => $validated['volume'],
                'issue' => $validated['issue']
            ]);

            try {
                $manuscript->author->notify(new ManuscriptPublished($manuscript));

                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    $previousStatus,
                    $manuscript->status
                ));
            } catch (Exception $e) {
                Log::error('Failed to send publication notification', [
                    'error' => $e->getMessage(),
                    'manuscript_id' => $manuscript->id
                ]);
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript has been published successfully.',
                    'redirect' => route('editor.indexManuscripts')
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
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to publish manuscript: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to publish manuscript: ' . $e->getMessage());
        }
    }
}
