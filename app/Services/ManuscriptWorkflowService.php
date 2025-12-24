<?php

namespace App\Services;

use App\DecisionType;
use App\ManuscriptStatus;
use App\Models\CopyrightAgreement;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\ManuscriptIndexing;
use App\Models\ProofCorrection;
use App\Models\Review;
use App\Models\User;
use App\Notifications\LanguageEditorAssigned;
use App\Notifications\ManuscriptReadyForReview;
use App\Notifications\ManuscriptSubmitted;
use App\Notifications\ProductionAssigned;
use App\ReviewStatus;
use App\Services\PublicationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ManuscriptWorkflowService
{
    public function __construct(
        protected PublicationService $publicationService
    ) {}

    /**
     * Submit a new manuscript for review.
     */
    public function submitManuscript(Manuscript $manuscript): bool
    {
        try {
            DB::beginTransaction();

            $manuscript->status = ManuscriptStatus::SUBMITTED;
            $manuscript->save();

            // Send notification to managing editors and editor-in-chief
            $managingEditors = User::role(['managing_editor', 'editor_in_chief'])->get();
            Notification::send($managingEditors, new ManuscriptSubmitted($manuscript));

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to submit manuscript: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Perform desk screening on a manuscript.
     */
    public function screenManuscript(Manuscript $manuscript, bool $passesScreening, ?string $comments = null): bool
    {
        try {
            DB::beginTransaction();

            if ($passesScreening) {
                $manuscript->status = ManuscriptStatus::AWAITING_REVIEWER_SELECTION;
                
                // Notify editors that manuscript is ready for review
                $editors = User::role(['managing_editor', 'editor_in_chief', 'associate_editor'])->get();
                Notification::send($editors, new ManuscriptReadyForReview($manuscript));
            } else {
                $manuscript->status = ManuscriptStatus::DESK_REJECTED;

                // Create desk rejection decision
                EditorialDecision::create([
                    'manuscript_id' => $manuscript->id,
                    'editor_id' => auth()->id(),
                    'decision_type' => DecisionType::DESK_REJECT,
                    'comments_to_author' => $comments ?? 'Manuscript does not meet journal scope or quality standards.',
                    'decision_date' => now(),
                    'status' => EditorialDecision::STATUS_FINALIZED,
                ]);
            }

            $manuscript->save();

            // TODO: Send notification to author

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to screen manuscript: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Assign reviewers to a manuscript.
     */
    public function assignReviewers(Manuscript $manuscript, array $reviewerIds, int $reviewRound = 1, ?\DateTime $dueDate = null): bool
    {
        try {
            DB::beginTransaction();

            // Set default due date (2-4 weeks)
            if (! $dueDate) {
                $dueDate = now()->addWeeks(3);
            }

            foreach ($reviewerIds as $reviewerId) {
                Review::create([
                    'manuscript_id' => $manuscript->id,
                    'reviewer_id' => $reviewerId,
                    'review_round' => $reviewRound,
                    'invitation_sent_at' => now(),
                    'due_date' => $dueDate,
                    'status' => ReviewStatus::INVITED,
                ]);
            }

            // Update manuscript status
            $manuscript->status = ManuscriptStatus::IN_REVIEW;
            $manuscript->save();

            // TODO: Send review invitations to reviewers

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to assign reviewers: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Make an editorial decision on a manuscript.
     */
    public function makeEditorialDecision(
        Manuscript $manuscript,
        DecisionType $decisionType,
        string $commentsToAuthor,
        ?int $editorId = null,
        ?\DateTime $revisionDeadline = null
    ): ?EditorialDecision {
        try {
            DB::beginTransaction();

            $editorId = $editorId ?? auth()->id();

            // Create editorial decision
            $decision = EditorialDecision::create([
                'manuscript_id' => $manuscript->id,
                'editor_id' => $editorId,
                'decision_type' => $decisionType,
                'comments_to_author' => $commentsToAuthor,
                'decision_date' => now(),
                'revision_deadline' => $revisionDeadline,
                'status' => EditorialDecision::STATUS_FINALIZED,
            ]);

            // Update manuscript status based on decision
            $manuscript->status = $decisionType->resultingStatus();
            $manuscript->decision_date = now();
            $manuscript->save();

            // TODO: Send notification to author with decision

            DB::commit();

            return $decision;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to make editorial decision: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Submit a manuscript revision.
     */
    public function submitRevision(Manuscript $manuscript, string $responseToReviewers): bool
    {
        try {
            DB::beginTransaction();

            $manuscript->status = ManuscriptStatus::REVISION_SUBMITTED;
            $manuscript->revision_comments = $responseToReviewers;
            $manuscript->revised_at = now();

            // Increment revision count
            $revisionHistory = $manuscript->revision_history ?? [];
            $revisionHistory[] = [
                'date' => now()->toDateTimeString(),
                'comments' => $responseToReviewers,
            ];
            $manuscript->revision_history = $revisionHistory;

            $manuscript->save();

            // TODO: Send notification to editor

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to submit revision: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Move manuscript to copyediting stage.
     */
    public function startCopyediting(Manuscript $manuscript, ?int $languageEditorId = null): bool
    {
        try {
            DB::beginTransaction();

            $manuscript->status = ManuscriptStatus::IN_COPYEDITING;

            if ($languageEditorId) {
                $manuscript->editor_id = $languageEditorId;
                
                // Send notification to language editor
                $languageEditor = User::find($languageEditorId);
                if ($languageEditor) {
                    $languageEditor->notify(new LanguageEditorAssigned($manuscript));
                }
            }

            $manuscript->save();

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to start copyediting: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Move manuscript to typesetting stage.
     */
    public function startTypesetting(Manuscript $manuscript): bool
    {
        try {
            DB::beginTransaction();

            $manuscript->status = ManuscriptStatus::IN_TYPESETTING;
            $manuscript->save();

            // Send notification to production team
            $productionTeam = User::role(['production_editor', 'managing_editor'])->get();
            Notification::send($productionTeam, new ProductionAssigned($manuscript, 'typesetting'));

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to start typesetting: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Request author approval of final manuscript.
     */
    public function requestAuthorApproval(Manuscript $manuscript): bool
    {
        try {
            DB::beginTransaction();

            $manuscript->status = ManuscriptStatus::AWAITING_AUTHOR_APPROVAL;
            $manuscript->save();

            // TODO: Send notification to author for approval

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to request author approval: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Process author approval and prepare for publication.
     */
    public function processAuthorApproval(Manuscript $manuscript, bool $approved, ?string $comments = null): bool
    {
        try {
            DB::beginTransaction();

            if ($approved) {
                $manuscript->status = ManuscriptStatus::READY_FOR_PUBLICATION;
                $manuscript->author_approval_date = now();
            } else {
                // Send back to copyediting for corrections
                $manuscript->status = ManuscriptStatus::IN_COPYEDITING;
            }

            $manuscript->save();

            // TODO: Send notification

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to process author approval: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Publish manuscript.
     */
    public function publishManuscript(
        Manuscript $manuscript,
        string $doi,
        ?int $issueId = null,
        bool $onlineFirst = false
    ): bool {
        try {
            DB::beginTransaction();

            $manuscript->status = $onlineFirst
                ? ManuscriptStatus::PUBLISHED_ONLINE_FIRST
                : ManuscriptStatus::PUBLISHED;

            $manuscript->doi = $doi;
            $manuscript->published_at = now();
            $manuscript->publication_date = now();

            if ($issueId) {
                $manuscript->issue_id = $issueId;
            }

            $manuscript->save();

            // Send publication notification to author
            $manuscript->author->notify(new \App\Notifications\ManuscriptPublished($manuscript));

            // Submit metadata to indexing services
            $this->publicationService->submitToIndexingDatabases($manuscript);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to publish manuscript: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Withdraw manuscript.
     */
    public function withdrawManuscript(Manuscript $manuscript, string $reason): bool
    {
        try {
            DB::beginTransaction();

            // Only allow withdrawal before publication
            if ($manuscript->isPublished()) {
                return false;
            }

            $manuscript->status = ManuscriptStatus::WITHDRAWN;
            $manuscript->save();

            // TODO: Send notification to editor and reviewers

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to withdraw manuscript: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get manuscript workflow statistics.
     */
    public function getWorkflowStatistics(?int $editorId = null): array
    {
        $query = Manuscript::query();

        if ($editorId) {
            $query->where('editor_id', $editorId);
        }

        return [
            'total_submissions' => $query->count(),
            'under_screening' => (clone $query)->where('status', ManuscriptStatus::UNDER_SCREENING)->count(),
            'in_review' => (clone $query)->where('status', ManuscriptStatus::IN_REVIEW)->count(),
            'awaiting_revision' => (clone $query)->whereIn('status', [
                ManuscriptStatus::MINOR_REVISION_REQUIRED,
                ManuscriptStatus::MAJOR_REVISION_REQUIRED,
            ])->count(),
            'in_production' => (clone $query)->whereIn('status', [
                ManuscriptStatus::IN_PRODUCTION,
                ManuscriptStatus::IN_COPYEDITING,
                ManuscriptStatus::IN_TYPESETTING,
            ])->count(),
            'published' => (clone $query)->where('status', ManuscriptStatus::PUBLISHED)->count(),
            'rejected' => (clone $query)->whereIn('status', [
                ManuscriptStatus::REJECTED,
                ManuscriptStatus::DESK_REJECTED,
            ])->count(),
        ];
    }
}
