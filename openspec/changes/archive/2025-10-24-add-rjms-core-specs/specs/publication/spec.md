## ADDED Requirements

### Requirement: Copyediting Transition
Only `accepted` manuscripts SHALL transition to `in_copyediting`.

#### Scenario: Start copyediting
- WHEN the editor starts copyediting for an accepted manuscript
- THEN the manuscript status becomes `in_copyediting`

### Requirement: Finalized Upload → Author Approval
Uploading a finalized PDF SHALL set status to `awaiting_author_approval` and notify the author.

#### Scenario: Upload finalized PDF
- WHEN a PDF is uploaded for a manuscript in `in_copyediting`
- THEN the manuscript status becomes `awaiting_author_approval`
- AND the author receives an approval notification

### Requirement: Ready for Publication → Published
A ready-for-publication manuscript SHALL accept DOI, volume/issue/page metadata and transition to `published`.

#### Scenario: Publish manuscript
- WHEN an editor submits DOI, volume, issue, page_range, and publication_date
- THEN the manuscript status becomes `published` and `published_at` is set
