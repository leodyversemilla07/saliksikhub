<?php

namespace App\Services;

use App\DecisionType;
use App\ManuscriptStatus;
use App\ReviewStatus;
use App\Models\CopyrightAgreement;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\ManuscriptIndexing;
use App\Models\ProofCorrection;
use App\Models\Review;
use App\Models\User;
use App\Notifications\LanguageEditorAssigned;
use App\Notifications\ManuscriptDecision;
use App\Notifications\ManuscriptReadyForReview;
use App\Notifications\ManuscriptRevisionSubmitted;
use App\Notifications\ManuscriptStatusChanged;
use App\Notifications\ManuscriptSubmitted;
use App\Notifications\ManuscriptWithdrawn;
use App\Notifications\ProductionAssigned;
use App\Notifications\AuthorApprovalRequired;
use App\Notifications\ManuscriptApproved;
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
            return DB::transaction(function () use ($manuscript) {
                $manuscript->status = ManuscriptStatus::SUBMITTED;
                $manuscript->save();

                // Send notification to managing editors and editor-in-chief
                $managingEditors = User::role(['managing_editor', 'editor_in_chief'])->get();
                Notification::send($managingEditors, new ManuscriptSubmitted($manuscript));

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $passesScreening, $comments) {
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

                // Send notification to author about screening result
                $previousStatus = ManuscriptStatus::SUBMITTED->value;
                $newStatus = $manuscript->status->value;
                if ($manuscript->author) {
                    $manuscript->author->notify(new ManuscriptStatusChanged($manuscript, $previousStatus, $newStatus));
                }

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $reviewerIds, $reviewRound, $dueDate) {
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

                // Send review invitations to reviewers
                $reviewers = User::whereIn('id', $reviewerIds)->get();
                foreach ($reviewers as $reviewer) {
                    $review = Review::where('manuscript_id', $manuscript->id)
                        ->where('reviewer_id', $reviewer->id)
                        ->first();
                    if ($review) {
                        $reviewer->notify(new \App\Notifications\ReviewInvitation($manuscript, $review));
                    }
                }

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $decisionType, $commentsToAuthor, $editorId, $revisionDeadline) {
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

                // Send notification to author with decision
                if ($manuscript->author) {
                    $manuscript->author->notify(new ManuscriptDecision($manuscript, $decision));
                }

                return $decision;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $responseToReviewers) {
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

                // Send notification to editor about revision
                $editor = $manuscript->getEditor();
                if ($editor) {
                    $editor->notify(new ManuscriptRevisionSubmitted($manuscript));
                }

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $languageEditorId) {
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

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript) {
                $manuscript->status = ManuscriptStatus::IN_TYPESETTING;
                $manuscript->save();

                // Send notification to production team
                $productionTeam = User::role(['production_editor', 'managing_editor'])->get();
                Notification::send($productionTeam, new ProductionAssigned($manuscript, 'typesetting'));

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript) {
                $manuscript->status = ManuscriptStatus::AWAITING_AUTHOR_APPROVAL;
                $manuscript->save();

                // Send notification to author for approval
                if ($manuscript->author) {
                    $manuscript->author->notify(new AuthorApprovalRequired($manuscript));
                }

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $approved, $comments) {
                if ($approved) {
                    $manuscript->status = ManuscriptStatus::READY_FOR_PUBLICATION;
                    $manuscript->author_approval_date = now();

                    // Notify managing editors that manuscript is ready for publication
                    $managingEditors = User::role(['managing_editor', 'editor_in_chief'])->get();
                    foreach ($managingEditors as $editor) {
                        $editor->notify(new ManuscriptApproved($manuscript, $comments));
                    }
                } else {
                    // Send back to copyediting for corrections
                    $manuscript->status = ManuscriptStatus::IN_COPYEDITING;

                    // Notify language editor about corrections needed
                    if ($manuscript->editor_id) {
                        $languageEditor = User::find($manuscript->editor_id);
                        if ($languageEditor) {
                            $languageEditor->notify(new ManuscriptStatusChanged(
                                $manuscript,
                                ManuscriptStatus::AWAITING_AUTHOR_APPROVAL->value,
                                ManuscriptStatus::IN_COPYEDITING->value
                            ));
                        }
                    }
                }

                $manuscript->save();

                // Send notification to author about their decision
                if ($manuscript->author) {
                    $authorStatus = $approved ? 'approved' : 'requested revisions';
                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        ManuscriptStatus::AWAITING_AUTHOR_APPROVAL->value,
                        $manuscript->status->value
                    ));
                }

                return true;
            });
        } catch (\Exception $e) {
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
            return DB::transaction(function () use ($manuscript, $doi, $issueId, $onlineFirst) {
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

                return true;
            });
        } catch (\Exception $e) {
            \Log::error('Failed to publish manuscript: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Withdraw manuscript.
     */
    public function withdrawManuscript(Manuscript $manuscript, string $reason): bool
    {
        // Only allow withdrawal before publication
        if ($manuscript->isPublished()) {
            return false;
        }

        try {
            return DB::transaction(function () use ($manuscript, $reason) {
                $manuscript->status = ManuscriptStatus::WITHDRAWN;
                $manuscript->save();

                // Send notification to editor and reviewers
                $editor = $manuscript->getEditor();
                if ($editor) {
                    $editor->notify(new ManuscriptWithdrawn($manuscript, $reason, auth()->user?->name ?? 'Author'));
                }

                // Notify reviewers
                $reviewers = $manuscript->reviews()->whereNotIn('status', ['completed', 'declined'])->get();
                foreach ($reviewers as $review) {
                    $review->reviewer->notify(new ManuscriptWithdrawn($manuscript, $reason, 'Author'));
                }

                return true;
            });
        } catch (\Exception $e) {
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
