## ADDED Requirements

### Requirement: Manuscript Submission
Authors SHALL submit manuscripts with required metadata and file upload. New submissions SHALL be saved with status `submitted`.

#### Scenario: Create manuscript
- WHEN an authenticated author posts valid data and a file
- THEN the system persists the manuscript with `status=submitted`
- AND associates it to the submitting user

### Requirement: Manuscript Owner Access
Only the owner (author) SHALL view their manuscript detail page.

#### Scenario: Owner views manuscript
- WHEN the submitting author requests the manuscript page
- THEN the system returns details with temporary URLs to private files if present

#### Scenario: Non-owner blocked
- WHEN another authenticated user requests the manuscript page
- THEN the system denies access and redirects with an error

### Requirement: Revision Submission
Authors SHALL submit revisions when status requires revision; revisions MUST append to `revision_history` and update file.

#### Scenario: Submit revision
- WHEN the owner uploads a revised manuscript and comments
- THEN the system appends a new entry to `revision_history`
- AND sets `status=submitted` and `revised_at` to now

### Requirement: Author Approval
Authors SHALL approve finalized PDFs to move manuscripts to ready-for-publication.

#### Scenario: Approve finalized manuscript
- WHEN the author approves a finalized PDF
- THEN the system sets `author_approval_date` and `status=ready_for_publication`

### Requirement: Public Manuscript Access
Only `published` manuscripts SHALL be visible publicly and PDFs SHALL be served inline.

#### Scenario: View published manuscript
- WHEN a visitor opens a published manuscript URL
- THEN the system renders details with a PDF URL

#### Scenario: Block unpublished
- WHEN a visitor or user opens an unpublished manuscript URL
- THEN the system responds 404
