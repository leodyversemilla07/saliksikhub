<?php

namespace App\Http\Controllers\Editorial;

use App\Enums\ManuscriptStatus;
use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Notifications\Submission\AuthorApprovalRequired;
use App\Notifications\Submission\ManuscriptPublished;
use App\Notifications\Submission\ManuscriptStatusChanged;
use App\Services\StorageService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EditorProductionController extends Controller
{
    /**
     * Set the status of a manuscript to Under Review.
     */
    public function setUnderReview(Manuscript $manuscript)
    {
        try {
            $previousStatus = $manuscript->status;
            $newStatus = ManuscriptStatus::UNDER_REVIEW;

            if ($previousStatus !== $newStatus) {
                $manuscript->status = $newStatus;
                $manuscript->save();

                $author = $manuscript->author;
                $author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    $previousStatus->value,
                    $newStatus->value
                ));
            }

            return redirect()->back()->with('success', 'Manuscript is now under review.');
        } catch (Exception $e) {
            Log::error('Error setting manuscript under review', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            return redirect()->back()->with('error', 'Failed to update manuscript status.');
        }
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
                'expected_status' => ManuscriptStatus::ACCEPTED,
            ]);

            $normalizedCurrentStatus = trim(strtoupper($manuscript->status->value));
            $normalizedExpectedStatus = trim(strtoupper(ManuscriptStatus::ACCEPTED->value));

            if ($normalizedCurrentStatus !== $normalizedExpectedStatus) {
                Log::warning('Cannot start copy editing - status mismatch', [
                    'manuscript_id' => $manuscript->id,
                    'current_status' => $manuscript->status,
                    'expected_status' => ManuscriptStatus::ACCEPTED,
                ]);

                if (request()->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Only accepted manuscripts can be sent for copy editing.',
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
            ]);

            try {
                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    $previousStatus->value,
                    $manuscript->status->value
                ));
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

            return redirect()->route('editor.manuscripts.index')
                ->with('success', 'Manuscript is now in the copy editing phase.');
        } catch (Exception $e) {
            Log::error('Exception in startCopyEditing', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to start the copy editing process: '.$e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to start the copy editing process: '.$e->getMessage());
        }
    }

    /**
     * Upload the finalized manuscript PDF after copy editing.
     */
    public function uploadFinalized(Request $request, Manuscript $manuscript, StorageService $storageService)
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

                $timestamp = now()->format('YmdHis');
                $filename = "final_{$manuscript->id}_{$timestamp}.pdf";

                $storagePath = $storageService->storeFile(
                    $file,
                    "manuscripts/finalized/{$manuscript->id}",
                    $filename
                );

                $manuscript->final_pdf_path = $storagePath;
                $manuscript->final_manuscript_uploaded_at = now();
                $manuscript->status = ManuscriptStatus::AWAITING_AUTHOR_APPROVAL;
                $manuscript->save();
                $manuscript->refresh();

                Log::info('Finalized manuscript uploaded', [
                    'manuscript_id' => $manuscript->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $manuscript->status,
                    'storage_path' => $storagePath,
                ]);

                try {
                    $manuscript->author->notify(new AuthorApprovalRequired($manuscript));
                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        $previousStatus->value,
                        $manuscript->status->value
                    ));
                } catch (Exception $e) {
                    Log::error('Failed to send notification for finalized manuscript', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id,
                    ]);
                }

                $temporaryUrl = null;
                try {
                    $temporaryUrl = $storageService->generateTemporaryUrl($storagePath, 5);
                } catch (Exception $e) {
                    Log::warning('Could not generate temporary URL', ['path' => $storagePath]);
                }

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Finalized manuscript uploaded successfully. Author has been notified.',
                        'file_path' => $storagePath,
                        'temporary_url' => $temporaryUrl,
                        'redirect' => route('editor.manuscripts.index'),
                    ]);
                }

                return redirect()->route('editor.manuscripts.index')
                    ->with('success', 'Finalized manuscript uploaded successfully. Author has been notified.');
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file was uploaded or the file was invalid.',
                ], 422);
            }

            return redirect()->back()->with('error', 'No file was uploaded or the file was invalid.');
        } catch (Exception $e) {
            Log::error('Error uploading finalized manuscript', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload finalized manuscript: '.$e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to upload finalized manuscript: '.$e->getMessage());
        }
    }

    /**
     * Show the form for preparing a manuscript for publication.
     */
    public function showPublicationForm(Manuscript $manuscript)
    {
        if ($manuscript->status !== ManuscriptStatus::READY_FOR_PUBLICATION) {
            return redirect()->route('editor.manuscripts.index')
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
     * Finalize and publish a manuscript.
     */
    public function prepareForPublication(Request $request, Manuscript $manuscript)
    {
        try {
            $validated = $request->validate([
                'doi' => 'required|string|max:255|unique:manuscripts,doi,'.$manuscript->id,
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
                    $previousStatus->value,
                    $manuscript->status->value
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
                    'redirect' => route('editor.manuscripts.index'),
                ]);
            }

            return redirect()->route('editor.manuscripts.index')
                ->with('success', 'Manuscript has been published successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error publishing manuscript', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to publish manuscript: '.$e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to publish manuscript: '.$e->getMessage());
        }
    }
}
