## ADDED Requirements

### Requirement: Review Invitation Lifecycle
Review assignments SHALL track status through `invited`, `accepted|in_progress`, `completed`, or `declined` with due dates.

#### Scenario: Accept invitation
- WHEN an invited reviewer accepts
- THEN the review status becomes `accepted`

#### Scenario: Decline invitation
- WHEN an invited reviewer declines with an optional reason
- THEN the review status becomes `declined`

#### Scenario: Save draft
- WHEN an accepted reviewer saves partial ratings/comments
- THEN the review status becomes `in_progress`

### Requirement: Submit Review
Reviewers SHALL submit recommendation, ratings, and comments. On submission, status MUST be `completed`.

#### Scenario: Submit completed review
- WHEN the reviewer submits required fields (recommendation, ratings, author comments)
- THEN the system saves values and sets `status=completed`
