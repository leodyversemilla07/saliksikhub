## ADDED Requirements

### Requirement: Status Change Notification
Users SHALL receive status change notifications summarizing manuscript title and old→new status.

#### Scenario: Status change
- WHEN a manuscript status changes
- THEN the author receives a notification with title "Manuscript Status Changed" and a message describing the change

### Requirement: Decision Notification
Authors SHALL receive decision notifications with a decision-specific title and message.

#### Scenario: Decision made
- WHEN an editor records a decision
- THEN the author receives a notification whose type and title reflect the decision
