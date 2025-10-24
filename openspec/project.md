# Project Context

## Purpose
SaliksikHub is a scholarly journal management and publishing platform. It supports full editorial workflows end-to-end: author submissions, initial screening, peer review assignments, editorial decisions, production (copyediting/typesetting), author approval, issue assignment, and public publication of articles. Public visitors can browse current and archived issues and read/download published articles.

## Tech Stack
- Backend
	- PHP 8.2.29
	- Laravel Framework 12.33
	- Authentication: Laravel Fortify
	- Authorization: spatie/laravel-permission (role/permission middleware aliases registered)
	- ORM: Eloquent, with cviebrock/eloquent-sluggable for URL slugs
	- Scheduling: Laravel Scheduler (review reminder commands)
	- Notifications: Laravel Notifications (database channel)
	- Formatting: Laravel Pint
	- Testing: Pest v3, PHPUnit 11
	- Dev tooling: Laravel MCP (Boost), Laravel Wayfinder for type-safe route generation
	- Database: MySQL

- Frontend
	- Inertia.js v2 (inertia-laravel + @inertiajs/react)
	- React 19 with TypeScript (.tsx pages)
	- Tailwind CSS v4 (utility-first styling)
	- ESLint v9
	- Vite bundling

- Storage
	- DigitalOcean Spaces (S3-compatible) via a configured `spaces` disk for private assets
	- A `manuscripts` disk for manuscript-related file storage and downloads

## Project Conventions

### Code Style
- PHP
	- Use Laravel Pint for formatting. Explicit type hints and return types are preferred. Constructor property promotion is used where applicable.
	- Enums encapsulate domain states (e.g., `App\ManuscriptStatus`, `App\ReviewStatus`, `App\ReviewRecommendation`, `App\DecisionType`, `App\FileType`).
	- Enum case names are UPPER_SNAKE_CASE, with string values in lower_snake_case. Assign enum cases directly to casted attributes (avoid string casts).
	- Relationships are declared with explicit return types (BelongsTo, HasMany, etc.). Prefer scopes for common filters.
	- Form Request classes encapsulate validation (see `app/Http/Requests/*`). Avoid inline validation in controllers.

- JavaScript/TypeScript
	- TypeScript is used for pages/components (`.tsx`). ESLint v9 enforces code quality.
	- Tailwind CSS v4 utilities for styling. Keep classes concise and leverage layout wrappers/components when patterns repeat.

- General
	- Favor enums and model methods for business rules over magic strings.
	- Use named routes; import type-safe routes from Wayfinder-generated files (e.g., `import * as routes from '@/routes/manuscripts'`).

### Architecture Patterns
- Inertia SPA: Server-driven pages via `Inertia::render()` with React front-end. Pages live under `resources/js/pages`.
- Layered domain:
	- Models: `app/Models/*` with rich domain helpers and scopes.
	- Services: `app/Services/*` for cross-cutting logic (e.g., `StorageService`, `ReviewService`, `ManuscriptWorkflowService`).
	- Notifications: Domain events use Laravel Notifications to inform authors/editors.
	- Observers: `AppServiceProvider` registers `ManuscriptObserver` for side-effects on model events.
- Routing: In `routes/web.php` using `Route::inertia()` and controller routes; role-based middleware via Spatie aliases (`role`, `permission`). Auth pages are in `routes/auth.php`.
- Slugs: Generated with `cviebrock/eloquent-sluggable`. Slugs are immutable after creation to preserve URLs.

### Testing Strategy
- Test Framework: Pest v3 (with PHPUnit 11 under the hood).
- Scope: Prefer feature tests for HTTP flows (submission, decisions, state transitions), plus unit tests for model helpers and services.
- Factories: Use model factories for Eloquent setup; avoid manual DB seeding in tests.
- Assertions: Prefer semantic HTTP assertions (e.g., `assertSuccessful`, `assertForbidden`) over numeric codes.
- Minimal fast cycles: Run the smallest relevant subset during development; run the full suite in CI.

### Git Workflow
- Branching: Trunk-based with short-lived feature branches off `main` recommended. Use PRs for review.
- Commits: Conventional Commits style is encouraged (feat, fix, refactor, test, docs, chore), referencing issue IDs when applicable.
- Spec-first changes: For new capabilities or behavior changes, use the OpenSpec workflow (see `openspec/AGENTS.md`) to create a proposal and spec deltas before implementation.

## Domain Context
Primary entities and relationships:
- User: Authors, Reviewers, and Editors (roles: author, reviewer, managing_editor, editor_in_chief, associate_editor, language_editor) via Spatie roles.
- Manuscript: Belongs to an author (`user_id`), may be assigned to an editor (`editor_id`) and an Issue (`issue_id`); has many Files, Reviews, Revisions, and EditorialDecisions. Slugged by title.
- Review: Belongs to a Manuscript and a Reviewer (`reviewer_id`). Tracks invitation/response/submission, recommendation, ratings, and an `App\ReviewStatus`.
- Issue: Journal issue (volume/issue number), sluggable, with cover image and status (draft/in_review/published/archived). Has many Manuscripts and IssueComments.
- EditorialDecision: Linked to a Manuscript and Editor; uses `App\DecisionType` and maps to a resulting `App\ManuscriptStatus`.
- ManuscriptFile: File metadata with `App\FileType` (main_document, cover_letter, figure, table, supplementary). Soft-deleted; download via controller route.
- ManuscriptRevision: Historical revisions of a Manuscript (separate table) alongside a JSON `revision_history` array on Manuscript records.

Workflow highlights:
- Submission → Screening → Review Assignment → Reviews → Editorial Decision → Production (Copyediting/Typesetting) → Author Approval → Ready for Publication → Published.
- Public access is limited to published Manuscripts and Issues. PDF serve endpoint streams published article PDFs inline.

Frontend:
- Inertia React pages in `resources/js/pages` (e.g., `editor/*`, `manuscripts/*`, `issues/*`, `reviewer/*`, `author/*`, public pages like `current.tsx`).

## Important Constraints
- Access Control: Role-gated routes (authors, reviewers, editors). Email verification required for authenticated areas.
- Public Access: Only published manuscripts and issues are publicly viewable; manuscript PDFs are served only when status is `PUBLISHED`.
- Storage: Files stored privately in DigitalOcean Spaces; downloads are mediated (temporary URLs or streamed responses). Avoid exposing raw object storage URLs publicly.
- Slugs: Do not mutate slugs after creation (URLs are stable and may be indexed/cited).
- Enums: Use `App\ManuscriptStatus` and related enums consistently. Assign enum cases to casted attributes; do not compare/set plain strings where enum casts are defined.
- Performance: Prevent N+1 with eager loading for list/detail pages (e.g., manuscripts with author/editor, reviews with reviewer).

## External Dependencies
- DigitalOcean Spaces (S3-compatible object storage) — `spaces` disk for private files and cover images.
- Laravel Wayfinder — type-safe, TypeScript-based client-side route generation for Inertia/React.
- cviebrock/eloquent-sluggable — slug generation for Manuscripts and Issues.
- Laravel Fortify — authentication flows (login/register/password reset/2FA challenge routes).
- Inertia.js — server-driven SPA layer.
- Tailwind CSS v4 — design system utilities.
- MySQL — primary relational database.

