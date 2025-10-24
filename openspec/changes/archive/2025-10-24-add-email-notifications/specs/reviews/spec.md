## MODIFIED Requirements
### Requirement: Review Invitation Lifecycle
Review assignments SHALL track status through `invited`, `accepted|in_progress`, `completed`, or `declined` with due dates. Reviewers SHALL receive email invitations when assigned to review a manuscript.

#### Scenario: Email invitation sent
- WHEN a reviewer is assigned to review a manuscript
- THEN an email invitation is sent with subject "Review Invitation: [Manuscript Title]"
- AND the email includes manuscript details, review deadline, and acceptance instructions

#### Scenario: Invitation email content
- WHEN a review invitation email is sent
- THEN it includes manuscript title, abstract preview, word count, and submission date
- AND provides clear instructions for accepting or declining the invitation
- AND includes a direct link to the review assignment in the system

### Requirement: Submit Review
Reviewers SHALL submit recommendation, ratings, and comments. On submission, status MUST be `completed`. Reviewers SHALL receive confirmation emails when reviews are submitted.

#### Scenario: Review submission confirmation
- WHEN a reviewer submits a completed review
- THEN they receive a confirmation email with subject "Review Submitted: [Manuscript Title]"
- AND the email summarizes their recommendation and provides next steps information