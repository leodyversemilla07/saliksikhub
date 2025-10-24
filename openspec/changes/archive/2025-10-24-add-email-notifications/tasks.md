## 1. Database Changes
- [ ] 1.1 Create migration to add email preferences to users table
- [ ] 1.2 Add email_notification_enabled boolean field with default true

## 2. Email Configuration
- [ ] 2.1 Configure Laravel Mail with SMTP settings
- [ ] 2.2 Set up queue driver for email processing
- [ ] 2.3 Create mail configuration file if needed

## 3. Email Templates (Mailable Classes)
- [ ] 3.1 Create ManuscriptStatusChanged mailable class
- [ ] 3.2 Create EditorialDecision mailable class
- [ ] 3.3 Create ReviewInvitation mailable class
- [ ] 3.4 Create ReviewSubmitted mailable class
- [ ] 3.5 Create AuthorApprovalRequest mailable class
- [ ] 3.6 Create AuthorApprovalConfirmation mailable class

## 4. Notification Service Updates
- [ ] 4.1 Update NotificationService to send emails when creating notifications
- [ ] 4.2 Add email preference checking logic
- [ ] 4.3 Add queue dispatching for email jobs

## 5. User Profile Updates
- [ ] 5.1 Add email preferences to user profile form
- [ ] 5.2 Update ProfileController to handle email preference updates
- [ ] 5.3 Add email preferences validation rules

## 6. Frontend Updates
- [ ] 6.1 Update profile edit page to include email preferences
- [ ] 6.2 Add email preference toggle component

## 7. Queue Job Classes
- [ ] 7.1 Create SendManuscriptStatusEmail job
- [ ] 7.2 Create SendEditorialDecisionEmail job
- [ ] 7.3 Create SendReviewInvitationEmail job
- [ ] 7.4 Create SendAuthorApprovalEmail job

## 8. Testing
- [ ] 8.1 Write tests for email preference functionality
- [ ] 8.2 Write tests for email sending on status changes
- [ ] 8.3 Write tests for email sending on editorial decisions
- [ ] 8.4 Write tests for email sending on review invitations
- [ ] 8.5 Write tests for email sending on author approvals
- [ ] 8.6 Test email queue processing

## 9. Documentation
- [ ] 9.1 Update README with email configuration instructions
- [ ] 9.2 Document email template customization
- [ ] 9.3 Add troubleshooting guide for email delivery issues