## Why
Currently, the system only stores notifications in the database but doesn't send actual email notifications to users. This creates a poor user experience as authors, reviewers, and editors miss important updates about manuscript status changes, review invitations, and editorial decisions. Implementing email notifications will improve communication and keep all stakeholders informed about manuscript progress.

## What Changes
- Add email notification capability for manuscript status changes
- Add email notification capability for review invitations and updates
- Add email notification capability for editorial decisions
- Add email notification capability for author approval requests
- Add email templates for different notification types
- Add email configuration and queue support
- Add user email preferences (opt-in/opt-out)

## Impact
- Affected specs: notifications (modified), manuscripts (modified), reviews (modified), editorial (modified)
- Affected code: NotificationController, notification models, mail configuration, queue setup
- New dependencies: Laravel Mail, queue driver configuration
- Database changes: Add email preference fields to users table
- Breaking changes: None - this is additive functionality