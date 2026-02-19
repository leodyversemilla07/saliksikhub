<?php

use App\DecisionType;
use App\ManuscriptStatus;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\User;
use App\Services\ManuscriptWorkflowService;
use App\Services\PublicationService;

beforeEach(function () {
    $this->workflowService = app(ManuscriptWorkflowService::class);
    $this->publicationService = app(PublicationService::class);
    $this->author = User::factory()->create();
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
        'status' => ManuscriptStatus::SUBMITTED,
    ]);
    $this->editor = User::factory()->create();
    $this->editor->assignRole('managing_editor');
});

describe('submitManuscript', function () {
    it('can submit a new manuscript', function () {
        $manuscript = Manuscript::factory()->create([
            'user_id' => $this->author->id,
            'status' => ManuscriptStatus::DRAFT,
        ]);

        $result = $this->workflowService->submitManuscript($manuscript);

        expect($result)->toBeTrue();
        expect($manuscript->fresh()->status)->toBe(ManuscriptStatus::SUBMITTED);
    });
});

describe('screenManuscript', function () {
    it('can pass screening and update status', function () {
        $this->actingAs($this->editor);

        $result = $this->workflowService->screenManuscript($this->manuscript, true);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::AWAITING_REVIEWER_SELECTION);
    });

    it('can fail screening and update status to desk rejected', function () {
        $this->actingAs($this->editor);

        $result = $this->workflowService->screenManuscript($this->manuscript, false, 'Does not meet scope');

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::DESK_REJECTED);
    });

    it('creates desk rejection decision when failing screening', function () {
        $this->actingAs($this->editor);

        $this->workflowService->screenManuscript($this->manuscript, false, 'Quality issues');

        $decision = EditorialDecision::where('manuscript_id', $this->manuscript->id)->first();

        expect($decision)->not->toBeNull();
        expect($decision->decision_type)->toBe(DecisionType::DESK_REJECT);
        expect($decision->comments_to_author)->toBe('Quality issues');
    });
});

describe('assignReviewers', function () {
    it('can assign reviewers to a manuscript', function () {
        $reviewer1 = User::factory()->create();
        $reviewer1->assignRole('reviewer');
        $reviewer2 = User::factory()->create();
        $reviewer2->assignRole('reviewer');

        $result = $this->workflowService->assignReviewers($this->manuscript, [$reviewer1->id, $reviewer2->id]);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::IN_REVIEW);
        expect($this->manuscript->reviews()->count())->toBe(2);
    });

    it('sets default due date when none provided', function () {
        $reviewer = User::factory()->create();
        $reviewer->assignRole('reviewer');

        $this->workflowService->assignReviewers($this->manuscript, [$reviewer->id]);

        $review = Review::where('manuscript_id', $this->manuscript->id)->first();
        expect($review->due_date)->not->toBeNull();
    });
});

describe('makeEditorialDecision', function () {
    it('can accept a manuscript', function () {
        $decision = $this->workflowService->makeEditorialDecision(
            $this->manuscript,
            DecisionType::ACCEPT,
            'Congratulations, your paper has been accepted.',
            $this->editor->id
        );

        expect($decision)->not->toBeNull();
        expect($decision)->toBeInstanceOf(EditorialDecision::class);
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::ACCEPTED);
    });

    it('can reject a manuscript', function () {
        $decision = $this->workflowService->makeEditorialDecision(
            $this->manuscript,
            DecisionType::REJECT,
            'Unfortunately, your paper does not meet our standards.',
            $this->editor->id
        );

        expect($decision)->not->toBeNull();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::REJECTED);
    });

    it('can request minor revision', function () {
        $deadline = now()->addDays(14);

        $decision = $this->workflowService->makeEditorialDecision(
            $this->manuscript,
            DecisionType::MINOR_REVISION,
            'Please address the minor comments.',
            $this->editor->id,
            $deadline
        );

        expect($decision)->not->toBeNull();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::MINOR_REVISION_REQUIRED);
        expect($decision->revision_deadline->toDateString())->toBe($deadline->toDateString());
    });

    it('can request major revision', function () {
        $decision = $this->workflowService->makeEditorialDecision(
            $this->manuscript,
            DecisionType::MAJOR_REVISION,
            'Major revisions are needed.',
            $this->editor->id,
            now()->addDays(30)
        );

        expect($decision)->not->toBeNull();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::MAJOR_REVISION_REQUIRED);
    });
});

describe('submitRevision', function () {
    it('can submit a revision', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::MINOR_REVISION_REQUIRED]);

        $result = $this->workflowService->submitRevision(
            $this->manuscript,
            'I have addressed all the reviewer comments.'
        );

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::REVISION_SUBMITTED);
        expect($this->manuscript->fresh()->revised_at)->not->toBeNull();
        expect($this->manuscript->fresh()->revision_history)->not->toBeEmpty();
    });

    it('tracks revision history correctly', function () {
        $this->manuscript->update([
            'status' => ManuscriptStatus::MAJOR_REVISION_REQUIRED,
            'revision_history' => null,
        ]);

        $this->workflowService->submitRevision($this->manuscript, 'Major revisions done.');

        $history = $this->manuscript->fresh()->revision_history;
        expect(count($history))->toBe(1);
        expect($history[0]['comments'])->toBe('Major revisions done.');
    });
});

describe('startCopyediting', function () {
    it('can start copyediting', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::ACCEPTED]);

        $result = $this->workflowService->startCopyediting($this->manuscript, $this->editor->id);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::IN_COPYEDITING);
        expect($this->manuscript->fresh()->editor_id)->toBe($this->editor->id);
    });
});

describe('startTypesetting', function () {
    it('can start typesetting', function () {
        $this->actingAs($this->editor);
        $this->manuscript->update(['status' => ManuscriptStatus::IN_COPYEDITING]);

        $result = $this->workflowService->startTypesetting($this->manuscript);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::IN_TYPESETTING);
    });
});

describe('requestAuthorApproval', function () {
    it('can request author approval', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::IN_TYPESETTING]);

        $result = $this->workflowService->requestAuthorApproval($this->manuscript);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::AWAITING_AUTHOR_APPROVAL);
    });
});

describe('processAuthorApproval', function () {
    it('can process approval and ready for publication', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::AWAITING_AUTHOR_APPROVAL]);

        $result = $this->workflowService->processAuthorApproval($this->manuscript, true, 'Approved');

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::READY_FOR_PUBLICATION);
        expect($this->manuscript->fresh()->author_approval_date)->not->toBeNull();
    });

    it('can process rejection and return to copyediting', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::AWAITING_AUTHOR_APPROVAL]);

        $result = $this->workflowService->processAuthorApproval($this->manuscript, false, 'Needs corrections');

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::IN_COPYEDITING);
    });
});

describe('publishManuscript', function () {
    it('can publish a manuscript', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::READY_FOR_PUBLICATION]);

        $result = $this->workflowService->publishManuscript($this->manuscript, '10.1234/test.2025.001');

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::PUBLISHED);
        expect($this->manuscript->fresh()->doi)->toBe('10.1234/test.2025.001');
        expect($this->manuscript->fresh()->published_at)->not->toBeNull();
    });

    it('can publish online first', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::READY_FOR_PUBLICATION]);

        $result = $this->workflowService->publishManuscript($this->manuscript, '10.1234/test.2025.002', null, true);

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::PUBLISHED_ONLINE_FIRST);
    });
});

describe('withdrawManuscript', function () {
    it('can withdraw a manuscript', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::UNDER_REVIEW]);

        $result = $this->workflowService->withdrawManuscript($this->manuscript, 'Conflict of interest');

        expect($result)->toBeTrue();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::WITHDRAWN);
    });

    it('cannot withdraw a published manuscript', function () {
        $this->manuscript->update(['status' => ManuscriptStatus::PUBLISHED]);

        $result = $this->workflowService->withdrawManuscript($this->manuscript, 'Testing');

        expect($result)->toBeFalse();
        expect($this->manuscript->fresh()->status)->toBe(ManuscriptStatus::PUBLISHED);
    });
});

describe('getWorkflowStatistics', function () {
    it('returns correct workflow statistics', function () {
        // Note: beforeEach creates 1 manuscript with SUBMITTED status
        Manuscript::factory()->count(5)->create(['status' => ManuscriptStatus::UNDER_SCREENING]);
        Manuscript::factory()->count(3)->create(['status' => ManuscriptStatus::IN_REVIEW]);
        Manuscript::factory()->count(2)->create(['status' => ManuscriptStatus::PUBLISHED]);
        Manuscript::factory()->count(1)->create(['status' => ManuscriptStatus::REJECTED]);

        $stats = $this->workflowService->getWorkflowStatistics();

        expect($stats['total_submissions'])->toBe(12); // 11 + 1 from beforeEach
        expect($stats['under_screening'])->toBe(5);
        expect($stats['in_review'])->toBe(3);
        expect($stats['published'])->toBe(2);
        expect($stats['rejected'])->toBe(1);
    });

    it('can filter by editor', function () {
        $editorManuscript = Manuscript::factory()->create([
            'user_id' => $this->author->id,
            'editor_id' => $this->editor->id,
            'status' => ManuscriptStatus::IN_REVIEW,
        ]);

        $stats = $this->workflowService->getWorkflowStatistics($this->editor->id);

        expect($stats['in_review'])->toBe(1);
    });
});
