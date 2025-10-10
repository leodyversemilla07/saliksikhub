# Manuscript Workflow Statuses

This document outlines all possible statuses a manuscript can have throughout its lifecycle in the Research Journal Management System, based on the PRD requirements.

## Status Categories

### 1. Initial Submission (10-15%)
**`submitted`** - Manuscript has been submitted and is awaiting initial screening
- Author can withdraw
- Next: Under Screening

**`under_screening`** - Editor is reviewing manuscript for scope and quality (Pre-screening)
- Editor performs desk review
- Checks: scope fit, quality, formatting
- Next: Desk Rejected, Awaiting Reviewer Selection, Under Review, or On Hold

**`desk_rejected`** - Manuscript rejected without peer review
- Final status
- Reason: Out of scope, poor quality, formatting issues

---

### 2. Reviewer Selection & Assignment (20%)
**`awaiting_reviewer_selection`** - Editor is selecting appropriate reviewers
- Based on subject area, expertise
- Conflict of interest checking
- Next: Awaiting Reviewer Assignment

**`awaiting_reviewer_assignment`** - Reviewers are being invited
- Invitations sent
- Waiting for acceptance
- Next: In Review

---

### 3. Peer Review Process (40%)
**`under_review`** - Manuscript is in the peer review process
- General review state
- Next: Revision Required, Accepted, or Rejected

**`in_review`** - Reviewers are actively evaluating the manuscript
- Reviews in progress
- Typical: 2-3 reviewers, 2-4 weeks
- Next: Revision Required, Accepted, Conditionally Accepted, or Rejected

---

### 4. Revision States (50-55%)
**`minor_revision_required`** - Authors need to make minor revisions
- Small changes requested
- Author can edit
- Deadline: typically 30 days
- Next: Revision Submitted or Withdrawn

**`major_revision_required`** - Authors need to make substantial revisions
- Significant changes requested
- May require additional data/analysis
- Author can edit
- Deadline: typically 60-90 days
- Next: Revision Submitted or Withdrawn

**`awaiting_revision`** - Waiting for authors to submit revision
- Deadline active
- Reminders sent
- Next: Revision Submitted or Withdrawn

**`revision_submitted`** - Authors have submitted their revision
- Includes point-by-point response
- Track changes supported
- Next: In Review (re-review)

---

### 5. Decision States (70%)
**`accepted`** - Manuscript has been accepted for publication
- Final editorial approval
- No more revisions needed
- Next: In Production

**`conditionally_accepted`** - Manuscript accepted pending minor changes
- Very minor corrections needed
- No re-review required
- Next: In Production

**`rejected`** - Manuscript has been rejected
- Final status
- Can appeal (separate workflow)

---

### 6. Production Process (80-95%)
**`in_production`** - Manuscript is in the production process
- General production state
- Next: In Copyediting

**`in_copyediting`** - Manuscript is being copyedited (Section 3.6.1 PRD)
- Style and format checking
- Author queries managed
- Copyeditor assigned
- Next: In Typesetting

**`in_typesetting`** - Manuscript is being typeset (Section 3.6.2 PRD)
- Template-based formatting
- Multi-format output (PDF, HTML, XML, ePub)
- Figure and table optimization
- Reference linking (DOI, PubMed)
- Next: Awaiting Author Approval

**`awaiting_author_approval`** - Awaiting author approval of final version
- Proof sent to author
- Author can request corrections
- Author can edit (approve/request changes)
- Next: Ready for Publication or back to Copyediting

**`ready_for_publication`** - Manuscript is ready to be published
- All approvals received
- DOI assigned
- Publication scheduled
- Next: Published or Published Online First

---

### 7. Publication States (100%)
**`published`** - Manuscript has been published (Section 3.6.3 PRD)
- Final status
- DOI active
- Metadata sent to indexing services
- Usage statistics tracking begins

**`published_online_first`** - Manuscript published online ahead of print
- Early online publication (Section 3.6.3 PRD)
- Will be assigned to issue later
- Final status

---

### 8. Special States
**`withdrawn`** - Manuscript has been withdrawn by the author
- Final status
- Can occur at any pre-publication stage
- Reason recorded

**`on_hold`** - Manuscript processing is temporarily on hold
- Temporary status
- Reason: awaiting information, ethics review, etc.
- Can return to previous status

---

## Workflow Stages (for Progress Bar)

1. **Submission** (0-20%): submitted, under_screening
2. **Review** (20-60%): awaiting_reviewer_selection, awaiting_reviewer_assignment, under_review, in_review
3. **Revision** (50-60%): minor_revision_required, major_revision_required, revision_submitted, awaiting_revision
4. **Accepted** (70%): accepted, conditionally_accepted
5. **Production** (80-95%): in_production, in_copyediting, in_typesetting, awaiting_author_approval, ready_for_publication
6. **Published** (100%): published, published_online_first
7. **Final** (0%): rejected, desk_rejected, withdrawn

---

## Status Transitions (Allowed Next States)

### From Initial States:
- `submitted` → under_screening, withdrawn
- `under_screening` → desk_rejected, awaiting_reviewer_selection, under_review, on_hold

### From Review States:
- `awaiting_reviewer_selection` → awaiting_reviewer_assignment, under_review
- `awaiting_reviewer_assignment` → in_review, under_review
- `in_review` / `under_review` → minor_revision_required, major_revision_required, accepted, conditionally_accepted, rejected

### From Revision States:
- `minor_revision_required` / `major_revision_required` / `awaiting_revision` → revision_submitted, withdrawn
- `revision_submitted` → in_review, under_review

### From Accepted States:
- `accepted` / `conditionally_accepted` → in_production, in_copyediting

### From Production States:
- `in_production` / `in_copyediting` → in_typesetting, awaiting_author_approval
- `in_typesetting` → awaiting_author_approval, ready_for_publication
- `awaiting_author_approval` → ready_for_publication, in_copyediting
- `ready_for_publication` → published, published_online_first

---

## User Actions by Status

### Author Can Edit:
- `minor_revision_required`
- `major_revision_required`
- `awaiting_revision`
- `awaiting_author_approval`

### Author Can Withdraw:
- Any pre-publication status except `ready_for_publication`

### Editor Required:
- `under_screening` - Desk decision
- `awaiting_reviewer_selection` - Select reviewers
- After reviews received - Make decision

### Reviewer Required:
- `in_review` - Submit review

---

## Notifications Triggered by Status Change

Based on PRD Section 3.5.2:

- `submitted` → Submission confirmation to author
- `under_screening` → Assignment notification to editor
- `awaiting_reviewer_assignment` → Review invitations to reviewers
- `in_review` → Deadline reminders (3, 7, 14 days before due)
- `minor_revision_required` / `major_revision_required` → Decision notification to author
- `rejected` / `desk_rejected` → Decision notification to author
- `accepted` → Decision notification to author
- `awaiting_author_approval` → Approval request to author
- `published` → Publication alert to author and stakeholders

---

## PRD References

- **Section 3.2**: Manuscript Submission workflow
- **Section 3.3.2**: Editorial Decision Making (Accept, Minor Revision, Major Revision, Reject, Desk Reject)
- **Section 3.4**: Peer Review Process (review rounds, reviewer management)
- **Section 3.4.3**: Revision Process (author revision submission, deadlines, re-review)
- **Section 3.6.1**: Copyediting process
- **Section 3.6.2**: Typesetting and Layout
- **Section 3.6.3**: Publication (DOI assignment, scheduling, early online publication)

---

## Implementation Notes

All these statuses are implemented in the `App\ManuscriptStatus` enum with helper methods:
- `label()` - Human-readable label
- `color()` - Tailwind color for UI
- `description()` - What happens in this status
- `isInReview()` - Check if in review process
- `requiresRevision()` - Check if revision needed
- `isInProduction()` - Check if in production
- `isFinal()` - Check if final state
- `canBeEditedByAuthor()` - Check if author can edit
- `possibleNextStatuses()` - Get allowed transitions
- `workflowStage()` - Get current workflow stage
- `progressPercentage()` - Get progress (0-100%)
