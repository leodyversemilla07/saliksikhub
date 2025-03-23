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
use Illuminate\Support\Facades\Validator;

class EditorController extends Controller
{
    // Dashboard and Index Methods
    public function index()
    {
        return Inertia::render('Editor/EditorDashboard', [
            'stats' => $this->getDashboardStats(),
        ]);
    }

    public function indexManuscripts()
    {
        return Inertia::render('Editor/Index', [
            'manuscripts' => Manuscript::with('author')
                ->latest()
                ->get(),
        ]);
    }

    public function showManuscript($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            // Generate temporary URLs for manuscript files
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

            return Inertia::render('Manuscripts/Show', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => explode(', ', $manuscript->keywords),
                    'manuscript_path' => $manuscriptUrl, // Change from manuscript_url to manuscript_path
                    'final_pdf_path' => $finalPdfUrl, // Change from final_pdf_url to final_pdf_path
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
            // Add more detailed debugging for troubleshooting
            Log::info('Decision submission received', [
                'manuscript_id' => $manuscript->id,
                'decision_type' => $request->input('decision'),
                'has_deadline' => $request->has('revision_deadline'),
                'all_request_data' => $request->all()
            ]);

            DB::beginTransaction();

            // Validate request
            $validated = $this->validateDecision($request);

            // Map the lowercase decision type to proper format if needed
            $decisionType = $this->normalizeDecisionType($request->input('decision'));

            // Create editorial decision
            $decision = new EditorialDecision();
            $decision->manuscript_id = $manuscript->id;
            $decision->editor_id = Auth::id(); // Match the column name from migration
            $decision->decision_type = $decisionType;
            $decision->comments_to_author = $request->input('comments');
            $decision->decision_date = now();
            $decision->status = 'Finalized'; // Set a status from the enum options

            if ($request->has('revision_deadline')) {
                $decision->revision_deadline = $request->input('revision_deadline');
            }

            $decision->save();

            // Save the previous status before changing it
            $previousStatus = $manuscript->status;

            // Map decision type to manuscript status
            $newStatus = $this->mapDecisionTypeToManuscriptStatus($decisionType);

            // Debug the status mapping
            Log::info('Status mapping', [
                'decision_type' => $decisionType,
                'mapped_status' => $newStatus,
                'previous_status' => $previousStatus
            ]);

            // Update manuscript status
            $manuscript->status = $newStatus;
            $manuscript->decision_date = now();
            $manuscript->decision_comments = $request->input('comments');
            $manuscript->save();

            // Verify the status was properly updated
            $manuscript->refresh();
            Log::info('Manuscript after update', [
                'id' => $manuscript->id,
                'new_status' => $manuscript->status,
                'status_updated' => $previousStatus !== $manuscript->status
            ]);

            // Send notification about the decision
            $author = User::find($manuscript->user_id);
            if ($author) {
                try {
                    $author->notify(new ManuscriptDecisionNotification($manuscript, $decision));

                    // Also send a status change notification
                    if ($previousStatus !== $manuscript->status) {
                        $author->notify(new ManuscriptStatusChanged($manuscript, $previousStatus, $manuscript->status));
                    }
                } catch (Exception $e) {
                    Log::error('Failed to send notification', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id
                    ]);
                    // Continue even if notification fails
                }
            }

            DB::commit();

            // Modify the response to work with React components
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

    /**
     * Normalize decision type from frontend to match database enum
     */
    private function normalizeDecisionType(string $decisionType): string
    {
        // Map frontend values to database enum values
        $mapping = [
            'accept' => 'Accept',
            'minor_revision' => 'Minor Revision',
            'major_revision' => 'Major Revision',
            'reject' => 'Reject'
        ];

        return $mapping[$decisionType] ?? 'Minor Revision'; // Default if not found
    }

    /**
     * Map editorial decision type to manuscript status
     */
    private function mapDecisionTypeToManuscriptStatus(string $decisionType): string
    {
        // Direct mapping based on the manuscript status enum in the migration
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
                return 'Submitted'; // Default fallback
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

    /**
     * Set a manuscript status to Under Review
     *
     * @param  int  $id  The manuscript ID
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setUnderReview($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            // Save the previous status before changing it
            $previousStatus = $manuscript->status;
            $newStatus = Manuscript::STATUSES['UNDER_REVIEW'];

            // Only proceed if the status is actually changing
            if ($previousStatus !== $newStatus) {
                $manuscript->status = $newStatus;
                $manuscript->save();

                // Send notification to the author about status change
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

    public function showEditorialDecisions(Manuscript $manuscript)
    {
        $decisions = $manuscript->editorialDecisions()
            ->with('editor')
            ->latest('decision_date')
            ->get();

        return Inertia::render('Editor/ManuscriptDecisions', [
            'manuscript' => $manuscript,
            'decisions' => $decisions,
        ]);
    }

    /**
     * Show form to create a new editorial decision
     */
    public function createEditorialDecision(Manuscript $manuscript)
    {
        return Inertia::render('Editor/CreateDecision', [
            'manuscript' => $manuscript,
            'decisionTypes' => EditorialDecision::DECISION_TYPES,
        ]);
    }

    /**
     * Display the user management page
     */
    public function manageUsers(Request $request)
    {
        // Get pagination parameters with defaults
        $perPage = $request->input('per_page', 10);

        // Get users with pagination, excluding the current user
        $users = User::where('id', '!=', Auth::id()) // Exclude current user
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Validate user input
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|in:author,editor',
            'affiliation' => 'nullable|string|max:255', // Added affiliation validation
        ]);

        // Create the user with all fields including affiliation
        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'affiliation' => $validated['affiliation'] ?? null, // Handle affiliation
        ]);

        // Log the user creation
        Log::info('User created by admin', [
            'user_id' => $user->id,
            'admin_id' => Auth::id(),
            'role' => $user->role,
        ]);

        // Return success response
        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        // Initialize validation rules
        $rules = [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:author,editor',
            'affiliation' => 'nullable|string|max:255',
        ];

        // Add password validation if password is being updated
        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
        }

        // Validate the request
        $validated = $request->validate($rules);

        // Update basic user information
        $user->firstname = $validated['firstname'];
        $user->lastname = $validated['lastname'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (isset($validated['affiliation'])) {
            $user->affiliation = $validated['affiliation'];
        }

        // Update password if provided
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // Save the user
        $user->save();

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        // Delete the user
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    /**
     * Bulk delete selected users
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'exists:users,id',
        ]);

        $userIds = $request->userIds;

        // Prevent self-deletion
        if (in_array(Auth::id(), $userIds)) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
                'errors' => ['userIds' => 'Your account was included in the selection and cannot be deleted.'],
            ], 422);
        }

        // Delete the users
        User::whereIn('id', $userIds)->delete();

        return redirect()->back()->with('success', count($userIds) . ' users deleted successfully');
    }

    /**
     * Start the copy editing process for a manuscript
     */
    public function startCopyEditing(Manuscript $manuscript)
    {
        try {
            // More robust debugging to see EXACTLY what's happening
            Log::info('Starting copy editing process', [
                'manuscript_id' => $manuscript->id,
                'raw_status' => $manuscript->status,
                'status_type' => gettype($manuscript->status),
                'expected_status' => Manuscript::STATUSES['ACCEPTED'],
                'status_match' => $manuscript->status === Manuscript::STATUSES['ACCEPTED'],
            ]);

            // More robust status comparison - normalize to uppercase and trim
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

            // Save the previous status before changing it
            $previousStatus = $manuscript->status;

            // TEMPORARY FIX: Use a shorter status value until migration is applied
            // 'Copyediting' is shorter than 'In Copyediting'
            $manuscript->status = 'Copyediting';

            // Option 2: If even that doesn't work, use a status code
            // $manuscript->status = 'CE'; 

            $manuscript->save();

            // Force refresh the model to verify the change took effect
            $manuscript->refresh();
            Log::info('Status updated successfully', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'new_status' => $manuscript->status,
                'verification' => $manuscript->status === Manuscript::STATUSES['IN_COPYEDITING']
            ]);

            // Notify author about the status change
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
                // Continue even if notification fails
            }

            // Respond with JSON for AJAX requests
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript is now in the copy editing phase'
                ]);
            }

            // Redirect for non-AJAX requests
            return redirect()->route('editor.indexManuscripts', $manuscript)
                ->with('success', 'Manuscript is now in the copy editing phase.');

        } catch (Exception $e) {
            // Make error logging more detailed
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

    /**
     * Upload a finalized manuscript after copy editing
     *
     * @param Request $request
     * @param Manuscript $manuscript
     * @return \Illuminate\Http\Response
     */
    public function uploadFinalizedManuscript(Request $request, Manuscript $manuscript)
    {
        try {
            // Validate the request
            $request->validate([
                'manuscript_file' => 'required|file|mimes:pdf|max:20480', // 20MB max
            ]);

            // Check if the manuscript is in the correct state - use the IN_COPYEDITING status constant
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

            // Save the previous status for notification
            $previousStatus = $manuscript->status;

            // Handle the file upload
            if ($request->hasFile('manuscript_file')) {
                $file = $request->file('manuscript_file');

                // Generate a unique filename with safer naming - for DO Spaces
                $safeTitle = preg_replace('/[^a-z0-9]+/', '-', strtolower($manuscript->title));
                $timestamp = now()->format('YmdHis');
                $filename = "final_{$manuscript->id}_{$timestamp}.pdf";

                // Define the path for Digital Ocean Spaces - using folders to organize content
                $storagePath = "manuscripts/finalized/{$manuscript->id}/{$filename}";

                // Store the file directly in DO Spaces using the configured disk
                Storage::disk('spaces')->put($storagePath, file_get_contents($file), [
                    'visibility' => 'private',
                    'ContentType' => 'application/pdf',
                    'ContentDisposition' => 'inline; filename="' . $filename . '"'
                ]);

                // Update the manuscript with the new file path
                // Use the correct status constant AWAITING_APPROVAL instead of AWAITING_AUTHOR_APPROVAL
                $manuscript->final_pdf_path = $storagePath;
                $manuscript->final_manuscript_uploaded_at = now();
                $manuscript->status = Manuscript::STATUSES['AWAITING_APPROVAL'];
                $manuscript->save();

                // Force refresh the model to verify the change
                $manuscript->refresh();

                // Log the successful upload with details about storage
                Log::info('Finalized manuscript uploaded to DO Spaces', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status,
                    'storage_path' => $storagePath,
                    'file_size' => $file->getSize(),
                    'storage_disk' => 'spaces',
                    'uploaded_by' => Auth::id()
                ]);

                // Notify the author that the finalized manuscript needs approval
                try {
                    $manuscript->author->notify(new AuthorApprovalRequired($manuscript));

                    // Also notify about status change
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
                    // Continue even if notification fails
                }

                // Generate a temporary URL for verification
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

                // Return response based on request type
                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Finalized manuscript uploaded successfully. Author has been notified for approval.',
                        'file_path' => $storagePath,
                        'temporary_url' => $temporaryUrl,
                        'redirect' => route('editor.indexManuscripts') // Add redirect URL for Inertia
                    ]);
                }

                // For regular form submissions, redirect directly
                return redirect()->route('editor.indexManuscripts')
                    ->with('success', 'Finalized manuscript uploaded successfully. Author has been notified for approval.');
            }

            // If we get here, something went wrong with the file
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file was uploaded or the file was invalid.'
                ], 422);
            }

            return redirect()->back()->with('error', 'No file was uploaded or the file was invalid.');

        } catch (Exception $e) {
            // Log detailed error information
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

    /**
     * Show form for preparing a manuscript for publication
     *
     * @param Manuscript $manuscript
     * @return \Inertia\Response
     */
    public function showPublicationForm(Manuscript $manuscript)
    {
        // This method matches the GET route name: editor.manuscripts.prepare_publication_form
        // Check if manuscript is in appropriate state for publication
        if ($manuscript->status !== Manuscript::STATUSES['READY_TO_PUBLISH']) {
            return redirect()->route('editor.indexManuscripts')
                ->with('error', 'Only approved manuscripts can be prepared for publication.');
        }

        // Get current publication details if any
        $currentVolumes = Manuscript::select('volume')->distinct()->whereNotNull('volume')->orderBy('volume', 'desc')->pluck('volume');
        $currentIssues = Manuscript::select('issue')->distinct()->whereNotNull('issue')->orderBy('issue', 'desc')->pluck('issue');

        return Inertia::render('Editor/PreparePublication', [
            'manuscript' => $manuscript,
            'currentVolumes' => $currentVolumes,
            'currentIssues' => $currentIssues
        ]);
    }

    /**
     * Process the publication form and publish the manuscript
     *
     * @param Request $request
     * @param Manuscript $manuscript
     * @return \Illuminate\Http\RedirectResponse
     */
    public function prepareForPublication(Request $request, Manuscript $manuscript)
    {
        // This method matches the POST route name: editor.manuscripts.prepare_publication
        try {
            // Validate the publication details
            $validated = $request->validate([
                'doi' => 'required|string|max:255|unique:manuscripts,doi,' . $manuscript->id,
                'volume' => 'required|integer|min:1',
                'issue' => 'required|integer|min:1',
                'page_range' => 'required|string|max:50',
                'publication_date' => 'required|date',
            ]);

            // Save the previous status before changing it
            $previousStatus = $manuscript->status;

            // Update manuscript with publication details
            DB::beginTransaction();

            $manuscript->doi = $validated['doi'];
            $manuscript->volume = $validated['volume'];
            $manuscript->issue = $validated['issue'];
            $manuscript->page_range = $validated['page_range'];
            $manuscript->publication_date = $validated['publication_date'];
            $manuscript->status = Manuscript::STATUSES['PUBLISHED'];
            $manuscript->published_at = now();
            $manuscript->save();

            // Log the successful publication
            Log::info('Manuscript published', [
                'manuscript_id' => $manuscript->id,
                'previous_status' => $previousStatus,
                'doi' => $validated['doi'],
                'volume' => $validated['volume'],
                'issue' => $validated['issue']
            ]);

            // Notify the author that their manuscript has been published
            try {
                $manuscript->author->notify(new ManuscriptPublished($manuscript));

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
