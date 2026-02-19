# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- MIT `LICENSE` file
- Full rewrite of `README.md` targeting the project as a generic, open-source research journal platform
- Generic defaults in `.env.example` (APP_NAME, DB_DATABASE, CrossRef, SUSHI)
- `CHANGELOG.md` (this file)

### Changed
- `composer.json`: package name → `saliksikhub/saliksikhub`, updated description and keywords
- `package.json`: added `name`, `version`, and `description` fields

---

## [0.5.0] — Installation Wizard & EnsureInstalled Middleware

### Added
- **Installation Wizard** (`/install`): six-step guided setup (requirements check, database, admin account, platform identity, journal setup, confirmation)
- `InstallController` with atomic, transactional install logic
- `EnsureInstalled` middleware: redirects unauthenticated visitors to `/install` when the platform has not yet been set up; uses a static flag + cache + DB fallback for efficiency
- `EnsureInstalled::markInstalled()` and `::resetInstallState()` static helpers for test isolation
- Global `beforeEach` in `tests/Pest.php` calls `EnsureInstalled::markInstalled()` so existing tests are unaffected
- `InstallWizardTest` (18 tests) covering requirements, full install flow, validation, and idempotency

---

## [0.4.0] — Management UIs

### Added
- **Announcement System**: admin CRUD for announcements, public listing and detail pages, 18 tests / 95 assertions
- **Platform Settings**: singleton `PlatformSetting` model, admin settings UI, 31 tests / 88 assertions
- **Journal-User Management UI**: role assignment interface, pivot management, 27 tests / 131 assertions

---

## [0.3.0] — Enhanced Multi-Journal Support

### Added
- Dynamic journal resolution: route param → domain → subdomain → session → first active
- Scoped controllers per journal context
- Journal-aware public pages and navigation

---

## [0.2.0] — Theme System

### Added
- `use-journal-theme` React hook for per-journal CSS variable injection
- `PublicLayout` component consuming merged theme settings
- All 14 public-facing pages migrated to `PublicLayout`
- Admin theme editor aligned with `theme_settings` JSON stored on the `Journal` model

---

## [0.1.0] — Plugin System

### Added
- Plugin DB schema (`plugins` table) with enable/disable per journal
- `PluginInterface`, `PluginManager` service, `Hook` system (actions + filters)
- `AnnouncementBanner` sample plugin
- `PluginController` (14 routes) and admin UI (index + settings pages)
- ~45 hook invocations across 5 core services
- 19 plugin tests
- `docs/PLUGIN_ARCHITECTURE.md`

---

## [0.0.1] — Initial Platform Foundation

### Added
- Laravel 12 + React 19 + Inertia.js v2 + Tailwind CSS v4 + TypeScript stack
- Multi-journal architecture with soft tenancy (`journal_id` FK, shared tables)
- Role system: `users.role` column + Spatie team-scoped roles + `journal_user` pivot roles
- Full OJS-style manuscript workflow (submission → review → decision → publication)
- shadcn/ui component library (50+ components)
- Fortify-backed authentication
- Eloquent sluggable models
- RolesAndPermissionsSeeder, UserSeeder, and supporting seeders
