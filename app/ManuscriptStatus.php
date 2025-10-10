<?php

namespace App;

enum ManuscriptStatus: string
{
    // Initial submission states
    case SUBMITTED = 'submitted';
    case UNDER_SCREENING = 'under_screening';
    case DESK_REJECTED = 'desk_rejected';

    // Review process states
    case UNDER_REVIEW = 'under_review';
    case AWAITING_REVIEWER_SELECTION = 'awaiting_reviewer_selection';
    case AWAITING_REVIEWER_ASSIGNMENT = 'awaiting_reviewer_assignment';
    case IN_REVIEW = 'in_review';

    // Revision states
    case MINOR_REVISION_REQUIRED = 'minor_revision_required';
    case MAJOR_REVISION_REQUIRED = 'major_revision_required';
    case REVISION_SUBMITTED = 'revision_submitted';
    case AWAITING_REVISION = 'awaiting_revision';

    // Decision states
    case ACCEPTED = 'accepted';
    case CONDITIONALLY_ACCEPTED = 'conditionally_accepted';
    case REJECTED = 'rejected';

    // Production states
    case IN_PRODUCTION = 'in_production';
    case IN_COPYEDITING = 'in_copyediting';
    case IN_TYPESETTING = 'in_typesetting';
    case AWAITING_AUTHOR_APPROVAL = 'awaiting_author_approval';
    case READY_FOR_PUBLICATION = 'ready_for_publication';

    // Publication states
    case PUBLISHED = 'published';
    case PUBLISHED_ONLINE_FIRST = 'published_online_first';

    // Special states
    case WITHDRAWN = 'withdrawn';
    case ON_HOLD = 'on_hold';

    /**
     * Get human-readable label for the status
     */
    public function label(): string
    {
        return match ($this) {
            self::SUBMITTED => 'Submitted',
            self::UNDER_SCREENING => 'Under Screening',
            self::DESK_REJECTED => 'Desk Rejected',
            self::UNDER_REVIEW => 'Under Review',
            self::AWAITING_REVIEWER_SELECTION => 'Awaiting Reviewer Selection',
            self::AWAITING_REVIEWER_ASSIGNMENT => 'Awaiting Reviewer Assignment',
            self::IN_REVIEW => 'In Review',
            self::MINOR_REVISION_REQUIRED => 'Minor Revision Required',
            self::MAJOR_REVISION_REQUIRED => 'Major Revision Required',
            self::REVISION_SUBMITTED => 'Revision Submitted',
            self::AWAITING_REVISION => 'Awaiting Revision',
            self::ACCEPTED => 'Accepted',
            self::CONDITIONALLY_ACCEPTED => 'Conditionally Accepted',
            self::REJECTED => 'Rejected',
            self::IN_PRODUCTION => 'In Production',
            self::IN_COPYEDITING => 'In Copyediting',
            self::IN_TYPESETTING => 'In Typesetting',
            self::AWAITING_AUTHOR_APPROVAL => 'Awaiting Author Approval',
            self::READY_FOR_PUBLICATION => 'Ready for Publication',
            self::PUBLISHED => 'Published',
            self::PUBLISHED_ONLINE_FIRST => 'Published (Online First)',
            self::WITHDRAWN => 'Withdrawn',
            self::ON_HOLD => 'On Hold',
        };
    }

    /**
     * Get color for UI display
     */
    public function color(): string
    {
        return match ($this) {
            self::SUBMITTED => 'blue',
            self::UNDER_SCREENING => 'indigo',
            self::DESK_REJECTED => 'red',
            self::UNDER_REVIEW, self::AWAITING_REVIEWER_SELECTION, self::AWAITING_REVIEWER_ASSIGNMENT, self::IN_REVIEW => 'purple',
            self::MINOR_REVISION_REQUIRED, self::MAJOR_REVISION_REQUIRED => 'yellow',
            self::REVISION_SUBMITTED, self::AWAITING_REVISION => 'orange',
            self::ACCEPTED, self::CONDITIONALLY_ACCEPTED => 'green',
            self::REJECTED => 'red',
            self::IN_PRODUCTION, self::IN_COPYEDITING, self::IN_TYPESETTING => 'cyan',
            self::AWAITING_AUTHOR_APPROVAL => 'amber',
            self::READY_FOR_PUBLICATION => 'emerald',
            self::PUBLISHED, self::PUBLISHED_ONLINE_FIRST => 'green',
            self::WITHDRAWN => 'gray',
            self::ON_HOLD => 'slate',
        };
    }

    /**
     * Get description of what happens in this status
     */
    public function description(): string
    {
        return match ($this) {
            self::SUBMITTED => 'Manuscript has been submitted and is awaiting initial screening',
            self::UNDER_SCREENING => 'Editor is reviewing manuscript for scope and quality',
            self::DESK_REJECTED => 'Manuscript rejected without peer review',
            self::UNDER_REVIEW => 'Manuscript is in the peer review process',
            self::AWAITING_REVIEWER_SELECTION => 'Editor is selecting reviewers',
            self::AWAITING_REVIEWER_ASSIGNMENT => 'Reviewers are being invited',
            self::IN_REVIEW => 'Reviewers are evaluating the manuscript',
            self::MINOR_REVISION_REQUIRED => 'Authors need to make minor revisions',
            self::MAJOR_REVISION_REQUIRED => 'Authors need to make substantial revisions',
            self::REVISION_SUBMITTED => 'Authors have submitted their revision',
            self::AWAITING_REVISION => 'Waiting for authors to submit revision',
            self::ACCEPTED => 'Manuscript has been accepted for publication',
            self::CONDITIONALLY_ACCEPTED => 'Manuscript accepted pending minor changes',
            self::REJECTED => 'Manuscript has been rejected',
            self::IN_PRODUCTION => 'Manuscript is in the production process',
            self::IN_COPYEDITING => 'Manuscript is being copyedited',
            self::IN_TYPESETTING => 'Manuscript is being typeset',
            self::AWAITING_AUTHOR_APPROVAL => 'Awaiting author approval of final version',
            self::READY_FOR_PUBLICATION => 'Manuscript is ready to be published',
            self::PUBLISHED => 'Manuscript has been published',
            self::PUBLISHED_ONLINE_FIRST => 'Manuscript published online ahead of print',
            self::WITHDRAWN => 'Manuscript has been withdrawn by the author',
            self::ON_HOLD => 'Manuscript processing is temporarily on hold',
        };
    }

    /**
     * Check if manuscript is in active review
     */
    public function isInReview(): bool
    {
        return in_array($this, [
            self::UNDER_REVIEW,
            self::AWAITING_REVIEWER_SELECTION,
            self::AWAITING_REVIEWER_ASSIGNMENT,
            self::IN_REVIEW,
        ]);
    }

    /**
     * Check if manuscript requires revision
     */
    public function requiresRevision(): bool
    {
        return in_array($this, [
            self::MINOR_REVISION_REQUIRED,
            self::MAJOR_REVISION_REQUIRED,
            self::AWAITING_REVISION,
        ]);
    }

    /**
     * Check if manuscript is in production
     */
    public function isInProduction(): bool
    {
        return in_array($this, [
            self::IN_PRODUCTION,
            self::IN_COPYEDITING,
            self::IN_TYPESETTING,
            self::AWAITING_AUTHOR_APPROVAL,
        ]);
    }

    /**
     * Check if manuscript has reached a final state
     */
    public function isFinal(): bool
    {
        return in_array($this, [
            self::PUBLISHED,
            self::PUBLISHED_ONLINE_FIRST,
            self::REJECTED,
            self::DESK_REJECTED,
            self::WITHDRAWN,
        ]);
    }

    /**
     * Check if status can be edited by author
     */
    public function canBeEditedByAuthor(): bool
    {
        return in_array($this, [
            self::MINOR_REVISION_REQUIRED,
            self::MAJOR_REVISION_REQUIRED,
            self::AWAITING_REVISION,
            self::AWAITING_AUTHOR_APPROVAL,
        ]);
    }

    /**
     * Get next possible statuses from current status
     */
    public function possibleNextStatuses(): array
    {
        return match ($this) {
            self::SUBMITTED => [
                self::UNDER_SCREENING,
                self::WITHDRAWN,
            ],
            self::UNDER_SCREENING => [
                self::DESK_REJECTED,
                self::AWAITING_REVIEWER_SELECTION,
                self::UNDER_REVIEW,
                self::ON_HOLD,
            ],
            self::AWAITING_REVIEWER_SELECTION => [
                self::AWAITING_REVIEWER_ASSIGNMENT,
                self::UNDER_REVIEW,
            ],
            self::AWAITING_REVIEWER_ASSIGNMENT => [
                self::IN_REVIEW,
                self::UNDER_REVIEW,
            ],
            self::IN_REVIEW, self::UNDER_REVIEW => [
                self::MINOR_REVISION_REQUIRED,
                self::MAJOR_REVISION_REQUIRED,
                self::ACCEPTED,
                self::CONDITIONALLY_ACCEPTED,
                self::REJECTED,
            ],
            self::MINOR_REVISION_REQUIRED, self::MAJOR_REVISION_REQUIRED, self::AWAITING_REVISION => [
                self::REVISION_SUBMITTED,
                self::WITHDRAWN,
            ],
            self::REVISION_SUBMITTED => [
                self::IN_REVIEW,
                self::UNDER_REVIEW,
            ],
            self::ACCEPTED, self::CONDITIONALLY_ACCEPTED => [
                self::IN_PRODUCTION,
                self::IN_COPYEDITING,
            ],
            self::IN_PRODUCTION, self::IN_COPYEDITING => [
                self::IN_TYPESETTING,
                self::AWAITING_AUTHOR_APPROVAL,
            ],
            self::IN_TYPESETTING => [
                self::AWAITING_AUTHOR_APPROVAL,
                self::READY_FOR_PUBLICATION,
            ],
            self::AWAITING_AUTHOR_APPROVAL => [
                self::READY_FOR_PUBLICATION,
                self::IN_COPYEDITING,
            ],
            self::READY_FOR_PUBLICATION => [
                self::PUBLISHED,
                self::PUBLISHED_ONLINE_FIRST,
            ],
            default => [],
        };
    }

    /**
     * Get workflow stage (for progress tracking)
     */
    public function workflowStage(): string
    {
        return match ($this) {
            self::SUBMITTED, self::UNDER_SCREENING => 'submission',
            self::DESK_REJECTED => 'rejected',
            self::UNDER_REVIEW, self::AWAITING_REVIEWER_SELECTION, self::AWAITING_REVIEWER_ASSIGNMENT, self::IN_REVIEW => 'review',
            self::MINOR_REVISION_REQUIRED, self::MAJOR_REVISION_REQUIRED, self::REVISION_SUBMITTED, self::AWAITING_REVISION => 'revision',
            self::ACCEPTED, self::CONDITIONALLY_ACCEPTED => 'accepted',
            self::REJECTED => 'rejected',
            self::IN_PRODUCTION, self::IN_COPYEDITING, self::IN_TYPESETTING, self::AWAITING_AUTHOR_APPROVAL, self::READY_FOR_PUBLICATION => 'production',
            self::PUBLISHED, self::PUBLISHED_ONLINE_FIRST => 'published',
            self::WITHDRAWN => 'withdrawn',
            self::ON_HOLD => 'on_hold',
        };
    }

    /**
     * Get progress percentage (0-100)
     */
    public function progressPercentage(): int
    {
        return match ($this) {
            self::SUBMITTED => 10,
            self::UNDER_SCREENING => 15,
            self::AWAITING_REVIEWER_SELECTION, self::AWAITING_REVIEWER_ASSIGNMENT => 20,
            self::IN_REVIEW, self::UNDER_REVIEW => 40,
            self::MINOR_REVISION_REQUIRED, self::MAJOR_REVISION_REQUIRED, self::AWAITING_REVISION => 50,
            self::REVISION_SUBMITTED => 55,
            self::ACCEPTED, self::CONDITIONALLY_ACCEPTED => 70,
            self::IN_PRODUCTION, self::IN_COPYEDITING => 80,
            self::IN_TYPESETTING => 85,
            self::AWAITING_AUTHOR_APPROVAL => 90,
            self::READY_FOR_PUBLICATION => 95,
            self::PUBLISHED, self::PUBLISHED_ONLINE_FIRST => 100,
            self::DESK_REJECTED, self::REJECTED => 0,
            self::WITHDRAWN => 0,
            self::ON_HOLD => 0,
        };
    }
}
