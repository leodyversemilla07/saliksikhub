<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use App\Models\User;
use App\Notifications\ManuscriptApproved;
use App\Notifications\ManuscriptSubmitted;
use App\Notifications\ManuscriptRevisionSubmitted;
use App\Notifications\ManuscriptStatusChanged;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ManuscriptController extends Controller
{
    /**
     * Display a list of manuscripts for the authenticated user.
     */
    public function index()
    {
        $userId = Auth::id();

        $manuscripts = Manuscript::where('user_id', $userId)
            ->latest() // Sort by created_at DESC
            ->get();

        return Inertia::render('Manuscripts/Index', compact('manuscripts'));
    }

    /**
     * Show the form for creating a new manuscript.
     */
    public function create()
    {
        return Inertia::render('Manuscripts/Create');
    }

    /**
     * Store a new manuscript submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'required|mimes:doc,docx|max:20480',
        ]);

        try {
            if ($request->hasFile('manuscript')) {
                $userId = Auth::id();
                $yearMonth = date('Y/m');
                // Convert title to filename-safe string
                $safeTitle = str_replace([' ', '/', '\\', '?', '%', '*', ':', '|', '"', '<', '>', '.'], '-', $request->title);
                $safeTitle = strtolower(preg_replace('/[^A-Za-z0-9\-]/', '', $safeTitle));

                $file = $request->file('manuscript');
                $extension = $file->getClientOriginalExtension();

                // Create path: manuscripts/user_id/year/month/title.{original_extension}
                $path = Storage::disk('spaces')->putFileAs(
                    "manuscripts/{$userId}/{$yearMonth}",
                    $file,
                    "{$safeTitle}.{$extension}"
                );

                $validated['manuscript_path'] = $path;
            }

            $validated['user_id'] = Auth::id();
            $validated['status'] = Manuscript::STATUSES['SUBMITTED'];

            $manuscript = Manuscript::create($validated);

            // Notify all editors about the new submission
            $editors = User::where('role', 'editor')->get();
            foreach ($editors as $editor) {
                $editor->notify(new ManuscriptSubmitted($manuscript));
            }

            return redirect()->route('manuscripts.index')->with('success', 'Manuscript submitted successfully!');

        } catch (Exception $e) {
            logger()->error('Submission Error', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred during submission.');
        }
    }

    /**
     * Show a specific manuscript.
     */
    public function show($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);
            $userId = Auth::id();

            // Generate temporary URLs
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

            // For published manuscripts, also provide the final PDF
            if ($manuscript->status === 'Published' && $manuscript->final_pdf_path) {
                try {
                    $finalPdfUrl = Storage::disk('spaces')->temporaryUrl(
                        $manuscript->final_pdf_path,
                        now()->addMinutes(30)
                    );
                } catch (Exception $e) {
                    logger()->error('Final PDF URL Generation Error', [
                        'error_message' => $e->getMessage(),
                        'manuscript_id' => $id,
                    ]);
                }
            }

            return Inertia::render('Manuscripts/Show', [
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
                    // Add publication details for published manuscripts
                    'doi' => $manuscript->doi,
                    'volume' => $manuscript->volume,
                    'issue' => $manuscript->issue,
                    'page_range' => $manuscript->page_range,
                    'publication_date' => $manuscript->publication_date ? $manuscript->publication_date->toDateString() : null,
                ],
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
     * Delete a manuscript.
     */
    public function destroy($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->delete();

        return redirect()->route('manuscripts.index')->with('success', 'Manuscript deleted successfully');
    }

    public function notification()
    {
        $user = Auth::user();

        // Debug information about notifications
        $notificationsCount = $user->notifications()->count();
        $unreadCount = $user->unreadNotifications()->count();

        Log::info('Author notification page viewed', [
            'user_id' => $user->id,
            'total_notifications' => $notificationsCount,
            'unread_notifications' => $unreadCount,
        ]);

        return Inertia::render('Author/Notification', [
            'debug' => [
                'total_notifications' => $notificationsCount,
                'unread_notifications' => $unreadCount
            ]
        ]);
    }

    /**
     * Show the form for submitting a manuscript revision.
     */
    public function showRevisionForm($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);
            $userId = Auth::id();

            // Security check - only the author can submit revisions
            if ($manuscript->user_id !== $userId) {
                return redirect()->route('manuscripts.index')->with('error', 'You do not have permission to revise this manuscript.');
            }

            // Check if the manuscript requires revision
            if (
                $manuscript->status !== Manuscript::STATUSES['MINOR_REVISION'] &&
                $manuscript->status !== Manuscript::STATUSES['MAJOR_REVISION']
            ) {
                return redirect()->route('manuscripts.show', $id)
                    ->with('error', 'This manuscript does not require a revision at this time.');
            }

            // Get the most recent decision with comments
            $latestDecision = $manuscript->editorialDecisions()
                ->latest('decision_date')
                ->first();

            // Generate a temporary URL for the current manuscript file
            $manuscriptUrl = null;
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
                    ]);
                }
            }

            return Inertia::render('Manuscripts/Revision', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => $manuscript->keywords,
                    'manuscript_url' => $manuscriptUrl,
                    'status' => $manuscript->status,
                    'created_at' => $manuscript->created_at->toDateTimeString(),
                    'updated_at' => $manuscript->updated_at->toDateTimeString(),
                ],
                'decision' => $latestDecision ? [
                    'id' => $latestDecision->id,
                    'comments' => $latestDecision->comments_to_author,
                    'decision_type' => $latestDecision->decision_type,
                    'decision_date' => $latestDecision->decision_date->format('Y-m-d'),
                    'revision_deadline' => $latestDecision->revision_deadline ?
                        $latestDecision->revision_deadline->format('Y-m-d') : null,
                ] : null,
            ]);

        } catch (Exception $e) {
            logger()->error('Revision Form Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the revision form.');
        }
    }

    /**
     * Process a manuscript revision submission.
     */
    public function submitRevision(Request $request, $id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $userId = Auth::id();

        // Security check - only the author can submit revisions
        if ($manuscript->user_id !== $userId) {
            return redirect()->route('manuscripts.index')->with('error', 'You do not have permission to revise this manuscript.');
        }

        // Validate the request
        $validated = $request->validate([
            'revised_manuscript' => 'required|mimes:doc,docx|max:20480',
            'revision_comments' => 'required|string|min:10',
        ]);

        try {
            // Store the revision history before updating
            $revisionHistory = $manuscript->revision_history ?? [];
            $revisionHistory[] = [
                'version' => count($revisionHistory) + 1,
                'previous_status' => $manuscript->status,
                'manuscript_path' => $manuscript->manuscript_path,
                'submitted_at' => now()->toIso8601String(),
                'comments' => $validated['revision_comments'],
            ];

            // Upload the revised manuscript
            if ($request->hasFile('revised_manuscript')) {
                $yearMonth = date('Y/m');
                $safeTitle = str_replace([' ', '/', '\\', '?', '%', '*', ':', '|', '"', '<', '>', '.'], '-', $manuscript->title);
                $safeTitle = strtolower(preg_replace('/[^A-Za-z0-9\-]/', '', $safeTitle));
                $version = count($revisionHistory);

                $file = $request->file('revised_manuscript');
                $extension = $file->getClientOriginalExtension();

                // Create path with version number: manuscripts/user_id/year/month/title_v{version}.{extension}
                $path = Storage::disk('spaces')->putFileAs(
                    "manuscripts/{$userId}/{$yearMonth}",
                    $file,
                    "{$safeTitle}_v{$version}.{$extension}"
                );

                // Update manuscript with new file path
                $manuscript->manuscript_path = $path;
            }

            // Save the previous status for notification
            $previousStatus = $manuscript->status;

            // Update the manuscript status to "Submitted" to indicate it's ready for re-review
            $manuscript->status = Manuscript::STATUSES['SUBMITTED'];
            $manuscript->revision_history = $revisionHistory;
            $manuscript->revision_comments = $validated['revision_comments'];
            $manuscript->revised_at = now();
            $manuscript->save();

            // Notify editors that a revision has been submitted
            $editors = User::where('role', 'editor')->get();
            logger()->info('Sending revision notifications to editors', [
                'editor_count' => $editors->count(),
                'manuscript_id' => $manuscript->id
            ]);

            foreach ($editors as $editor) {
                try {
                    // Create and use a new notification class for revision submissions
                    $editor->notify(new ManuscriptRevisionSubmitted($manuscript));
                    logger()->info('Revision notification sent successfully', [
                        'editor_id' => $editor->id,
                        'editor_email' => $editor->email,
                        'manuscript_id' => $manuscript->id
                    ]);
                } catch (Exception $e) {
                    logger()->error('Failed to send revision notification', [
                        'error' => $e->getMessage(),
                        'editor_id' => $editor->id,
                        'manuscript_id' => $manuscript->id
                    ]);
                }
            }

            // Send status change notification to author if status changed
            if ($previousStatus !== Manuscript::STATUSES['SUBMITTED']) {
                try {
                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        $previousStatus,
                        Manuscript::STATUSES['SUBMITTED']
                    ));

                    logger()->info('Status change notification sent to author', [
                        'manuscript_id' => $manuscript->id,
                        'previous_status' => $previousStatus,
                        'new_status' => Manuscript::STATUSES['SUBMITTED']
                    ]);
                } catch (Exception $e) {
                    logger()->error('Failed to send status change notification to author', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id
                    ]);
                }
            }

            return redirect()->route('manuscripts.index')
                ->with('success', 'Revision submitted successfully. Your manuscript has been sent back for review.');

        } catch (Exception $e) {
            logger()->error('Revision Submission Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred during revision submission.');
        }
    }

    /**
     * Show the manuscript approval form for editors
     *
     * @param Manuscript $manuscript
     * @return \Inertia\Response
     */
    public function showApproveForm(Manuscript $manuscript)
    {
        try {
            // Generate temporary URL for the finalized manuscript
            $finalPdfUrl = null;
            if ($manuscript->final_pdf_path) {
                try {
                    $finalPdfUrl = Storage::disk('spaces')->temporaryUrl(
                        $manuscript->final_pdf_path,
                        now()->addMinutes(30)
                    );
                } catch (Exception $e) {
                    Log::error('Failed to generate temporary URL', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id,
                        'path' => $manuscript->final_pdf_path
                    ]);
                }
            }

            return Inertia::render('Manuscripts/ApproveManuscript', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'status' => $manuscript->status,
                    'final_pdf_url' => $finalPdfUrl,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error showing approval form', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id
            ]);

            return redirect()->back()->with('error', 'Failed to load approval form: ' . $e->getMessage());
        }
    }

    /**
     * Process the manuscript approval and prepare for publication
     *
     * @param Request $request
     * @param Manuscript $manuscript
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function approveManuscript(Request $request, Manuscript $manuscript)
    {
        try {
            DB::beginTransaction();

            // Save previous status for notification
            $previousStatus = $manuscript->status;

            $manuscript->author_approval_date = now(); // Set author approval date
            $manuscript->status = Manuscript::STATUSES['READY_TO_PUBLISH'];
            $manuscript->save();

            // Notify the author about publication
            try {
                $manuscript->author->notify(new ManuscriptApproved($manuscript));

                // Also notify about status change
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
                // Continue even if notification fails
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript has been marked as ready to publish.',
                    'redirect' => route('manuscripts.index')
                ]);
            }

            return redirect()->route('manuscripts.index')
                ->with('success', 'Manuscript has been marked as ready to publish.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error approving manuscript', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to approve manuscript: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to approve manuscript: ' . $e->getMessage());
        }
    }
}
