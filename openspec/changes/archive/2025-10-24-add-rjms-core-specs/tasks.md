## 1. Specification
- [x] 1.1 Add capability spec files under `openspec/changes/add-rjms-core-specs/specs/` for manuscripts, reviews, editorial, publication, notifications, storage-files
- [x] 1.2 Validate deltas with `openspec validate add-rjms-core-specs --strict`
- [x] 1.3 Iterate to resolve validation issues

## 2. Alignment Fixes (Non-breaking)
- [x] 2.1 Normalize enum usage in controllers to match `App\\ManuscriptStatus` case names
- [x] 2.2 Fix `Manuscript::revisions()` relation foreign key to `manuscript_id`
- [x] 2.3 Replace `$user->role === 'editor'` checks with Spatie role helpers in `NotificationController`

## 3. Tests (Pest)
- [x] 3.1 Add feature tests for editorial decision → status mapping
- [x] 3.2 Add feature test for copyediting transition guard (ACCEPTED → IN_COPYEDITING)
- [x] 3.3 Add feature test for finalized upload → AWAITING_AUTHOR_APPROVAL
- [x] 3.4 Add feature test for author approval → READY_FOR_PUBLICATION

## 4. Review & Merge
- [x] 4.1 Run `vendor/bin/pint --dirty`
- [x] 4.2 Run targeted tests `php artisan test --filter=EditorialDecision` (and others)
- [x] 4.3 Share proposal for review and approval
