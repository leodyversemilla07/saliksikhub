## Why
Establish a baseline specification for the Research Journal Management System (RJMS) that reflects the current, working behavior. This enables spec-first changes, guards against regressions, and clarifies domain workflows for submissions, peer review, editorial decisions, production, and publication.

## What Changes
- ADDED core capability specs with concrete requirements and scenarios covering:
  - Manuscript submission, status transitions, and author flows
  - Review assignment, invitation lifecycle, and review submission
  - Editorial decisions and status mapping
  - Issue management and public publication (manuscripts and issues)
  - Notifications formatting and actions
  - File management and PDF serving
- Non-breaking: documents existing behavior to align future changes.

## Impact
- Affected specs: `manuscripts`, `reviews`, `editorial`, `publication`, `notifications`, `storage-files`.
- Affected code (reference paths):
  - Controllers: `app/Http/Controllers/{ManuscriptController,EditorController,ReviewController,IssueController,NotificationController}.php`
  - Models: `app/Models/{Manuscript,Review,Issue,EditorialDecision,ManuscriptFile,ManuscriptRevision}.php`
  - Enums: `app/{ManuscriptStatus,ReviewStatus,ReviewRecommendation,DecisionType,FileType}.php`
  - Services: `app/Services/{StorageService,ReviewService,ManuscriptWorkflowService}.php`
  - Routes: `routes/web.php`, `routes/auth.php`, `routes/console.php`
