# notifications Specification

## Purpose
TBD - created by archiving change add-rjms-core-specs. Update Purpose after archive.
## Requirements
### Requirement: Status Change Notification
Users SHALL receive email notifications for manuscript status changes summarizing manuscript title and old→new status. Email SHALL include manuscript details and direct link to view the manuscript.

#### Scenario: Email sent on status change
- WHEN a manuscript status changes
- THEN an email is sent to the author with subject "Manuscript Status Updated: [Title]"
- AND the email contains old status, new status, manuscript details, and view link

#### Scenario: Email includes manuscript context
- WHEN a status change email is sent
- THEN the email includes manuscript title, authors, and submission date
- AND includes a direct link to view the manuscript in the system

### Requirement: Decision Notification
Authors SHALL receive email notifications for editorial decisions with decision-specific subject lines and detailed messages. Email SHALL include decision rationale when provided.

#### Scenario: Accept decision email
- WHEN an editor records `decision=accept`
- THEN author receives email with subject "Manuscript Accepted: [Title]"
- AND email congratulates author and provides next steps information

#### Scenario: Revision required email
- WHEN an editor records `decision=minor_revision` or `decision=major_revision`
- THEN author receives email with subject "Revisions Required: [Title]"
- AND email includes revision requirements and resubmission instructions

#### Scenario: Reject decision email
- WHEN an editor records `decision=reject`
- THEN author receives email with subject "Manuscript Decision: [Title]"
- AND email provides constructive feedback and resubmission guidance

### Requirement: Email Notification Preferences
Users SHALL be able to opt-in or opt-out of email notifications through their profile settings. Preferences SHALL be stored per user and respected for all email notifications.

#### Scenario: User can disable email notifications
- WHEN a user updates their profile
- THEN they can toggle email notification preferences
- AND their preference is saved and applied to future notifications

#### Scenario: Default email preference
- WHEN a new user registers
- THEN email notifications are enabled by default
- AND user can change this preference in their profile

### Requirement: Email Template Customization
The system SHALL use customizable email templates for different notification types. Templates SHALL support dynamic content insertion and consistent branding.

#### Scenario: Template variables populated
- WHEN an email is sent
- THEN template variables (manuscript title, user name, etc.) are properly populated
- AND the email maintains consistent journal branding

### Requirement: Email Queue Processing
Email notifications SHALL be queued for processing to prevent delays in the user interface. Failed email deliveries SHALL be logged and retried.

#### Scenario: Emails queued for sending
- WHEN a notification triggers an email
- THEN the email is queued rather than sent synchronously
- AND the user interface responds immediately

#### Scenario: Failed email handling
- WHEN an email fails to send
- THEN the failure is logged
- AND the system attempts retry according to queue configuration

