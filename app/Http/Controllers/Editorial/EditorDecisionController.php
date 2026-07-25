<?php

namespace App\Http\Controllers\Editorial;

use App\Enums\ManuscriptStatus;
use App\Http\Controllers\Controller;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\User;
use App\Notifications\Submission\ManuscriptDecision as ManuscriptDecisionNotification;
use App\Notifications\Submission\ManuscriptStatusChanged;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EditorDecisionController extends Controller
{
    /**
     * Record an editorial decision for a manuscript.
     */
    public function store(Request $request, Manuscript $manuscript)
    {
        try {
            Log::info('Decision submission received', [
                'manuscript_id' => $manuscript->id,
                'decision_type' => $request->input('decision'),
                'has_deadline' => $request->has('revision_deadline'),
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

            $statusMap = [
                'accept' => ManuscriptStatus::ACCEPTED,
                'reject' => ManuscriptStatus::REJECTED,
                'minor_revision' => ManuscriptStatus::MINOR_REVISION_REQUIRED,
                'major_revision' => ManuscriptStatus::MAJOR_REVISION_REQUIRED,
            ];

            $newStatus = $statusMap[$decisionType] ?? ManuscriptStatus::SUBMITTED;

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
                        $author->notify(new ManuscriptStatusChanged($manuscript, $previousStatus->value, $manuscript->status->value));
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
                    'redirect' => route('editor.manuscripts.index'),
                ]);
            }

            return redirect()->route('editor.manuscripts.index')
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
                    'message' => 'Failed to record editorial decision: '.$e->getMessage(),
                    'errors' => ['general' => 'Failed to record editorial decision.'],
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to record editorial decision: '.$e->getMessage());
        }
    }
}
