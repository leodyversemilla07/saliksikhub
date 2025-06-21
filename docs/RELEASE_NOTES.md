# SaliksikHub Release Notes

**Release Version:** 1.0.0 (May 31, 2025)
**Release Date:** May 31, 2025

---

## 1. Key Features & Enhancements

### Manuscript Management

-   Complete submission workflow with metadata, abstracts, and secure file uploads (supports DOCX).
-   Advanced status tracking through all stages: Submitted, Under Review, Minor/Major Revision, Accepted, Copyediting, Awaiting Approval, Ready to Publish, Rejected, Published.
-   PDF parsing and text extraction via Smalot/PDFParser for content analysis.
-   File management backed by DigitalOcean Spaces (S3-compatible) for secure, scalable storage.

### Editorial System

-   Dedicated editorial dashboard for managing submissions and decisions.
-   Structured decision management with revision deadlines and detailed feedback.
-   Journal issue management with volume/issue numbering, titles, descriptions, publication dates, DOI support, themed issues, and editorial notes.
-   Manuscript assignment and unassignment workflows for issue planning.

### User Management & Roles

-   Role-based access control (Author, Editor, Admin, Reviewer).
-   User profiles with academic affiliations, contact information, and optional avatar uploads.
-   Secure authentication and session management.

### Communication & Notifications

-   Real-time in-app notifications and email integration for status changes and editorial decisions.
-   Activity logs and audit trail for manuscript and issue actions.
-   Bulk and individual notification APIs for marking as read and fetching the latest notifications.

### Modern Interface & User Experience

-   Single-page application (SPA) built with Inertia.js, React 19, and TypeScript.
-   Utility-first styling using Tailwind CSS 4.1.3.
-   Responsive design optimized for desktop and mobile devices.
-   Enhanced filtering and search in issue listing, including client-side search, status and volume filters, and active filter badges.
-   Cover image upload and preview in issue edit and show pages with file type and size validation.
-   Updated iconography using Lucide icons.

### Infrastructure & Tooling

-   Backend: Laravel 12, PHP 8.2+ with support for SQLite, MySQL, and PostgreSQL.
-   Frontend: Node.js 18+, Vite build tool, React with TypeScript.
-   Storage: DigitalOcean Spaces integrated via Laravel Filesystem.
-   Notifications: Laravel Notifications with custom notification channels.
-   Database schema migrations consolidated for manuscripts, issues, issue_comments, and screening workflow fields.
-   CI/CD: Composer scripts, npm tasks, and GitHub workflow guidance for continuous integration and deployment.

### Bug Fixes & Code Cleanup

-   Removed legacy AI pre-review migrations and controllers.
-   Renamed `comment` field to `content` in `issue_comments` for clarity.
-   Consolidated redundant migrations adding `issue_id` and screening columns into a single migration.
-   Fixed user interface layout issues on issue pages, including grid responsiveness and form spacing.
-   Corrected validation rules for cover image size and type, and DOI format.

---

## 2. Known Issues & Limitations

-   Debug overlays are displayed in the issue edit page and should be removed before production deployment.
-   Some events may generate duplicate notifications; a deduplication fix is pending.
-   No built-in system-wide bug tracker; all issues are managed via GitHub Issues.
-   Certain server-side validation messages are generic and require user-friendly messaging improvements.
-   Initial plagiarism screening collects scores but does not integrate automated plagiarism detection APIs.

---

## 3. Future Enhancement Roadmap

### Short-term (1–3 months)

-   Remove debug overlays and polish form interactions, including adding tooltips.
-   Implement in-app notification center with pagination and filters.
-   Enhance error handling with descriptive validation messages and summaries.

### Medium-term (3–6 months)

-   Integrate plagiarism detection service and grammar analysis API for advanced manuscript screening.
-   Develop automated publication scheduling with calendar view and scheduled publishing workflows.
-   Add version comparison to track field-level changes in manuscript metadata and editorial notes.
-   Automate DOI minting and integration with CrossRef or DataCite.

### Long-term (6–12 months)

-   Optimize database queries and implement Redis caching for dashboard performance.
-   Enable real-time collaborative editing for editorial notes and review comments.
-   Provide exportable reporting and analytics for submissions, decisions, and reviewer performance.
-   Implement multilingual support for user interface localization.

---

Thank you for using SaliksikHub!

For feedback, bug reports, or contributions, please open an issue on the project GitHub repository or contact the development team.
