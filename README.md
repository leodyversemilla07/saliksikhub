# SalikSikHub

**SalikSikHub** (from the Filipino word _"saliksik"_, meaning _research_) is an open-source, self-hosted academic journal management platform. Designed as a modern alternative to OJS, it supports multiple journals within a single installation with a full plugin system, theme system, and guided setup wizard.

## Features

- **Multi-journal** – Manage unlimited journals under one or more institutions from a single install
- **Full workflow** – Submission → Peer Review → Editorial Decision → Copyediting → Publication
- **Plugin system** – Extend functionality with installable plugins; enable per-journal
- **Theme system** – Per-journal color, typography, and branding via the admin UI
- **Installation wizard** – Guided first-run setup for admin account, institution, and journal
- **Role-based access** – Super Admin, Managing Editor, Editor-in-Chief, Associate Editor, Language Editor, Reviewer, Author
- **CMS** – Per-journal pages, sections, and navigation menus
- **Announcements** – Journal-scoped announcements with public display
- **Platform settings** – Centralized site-wide configuration for super admins
- **Open source** – MIT licensed, self-hosted, no vendor lock-in

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.4 |
| Frontend | React 19, TypeScript, Inertia.js v2 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | Laravel Fortify, Spatie Permission |
| Storage | S3-compatible (DigitalOcean Spaces, AWS S3, MinIO) |
| Testing | Pest v4 |

## Quick Start

### Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+ (or PostgreSQL / SQLite)

### Installation

```bash
# 1. Clone
git clone https://github.com/leodyversemilla07/saliksikhub.git
cd saliksikhub

# 2. Install dependencies
composer install
npm install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# Edit .env — set DB_*, MAIL_*, and storage credentials

# 4. Run migrations
php artisan migrate

# 5. Build frontend
npm run build

# 6. Start server
php artisan serve
```

Visit `http://localhost:8000` — the installation wizard will guide you through first-time setup.

### Development

```bash
composer run dev   # starts PHP server, queue worker, and Vite in parallel
```

## Architecture

```
Institution
└── Journal (multiple per institution)
    ├── Manuscripts (submission → publication workflow)
    ├── Issues
    ├── CMS (pages, sections, menus)
    ├── Announcements
    ├── Plugins (per-journal enable/disable)
    └── Theme settings
```

**Middleware chain:** `EnsureInstalled` → `SetCurrentJournal` → `HandleInertiaRequests`

**Role hierarchy:**
- `super_admin` – platform-wide, manages all institutions/journals
- `managing_editor` / `editor_in_chief` – journal-level editorial oversight
- `associate_editor` / `language_editor` – workflow roles
- `reviewer` / `author` – submission roles

## Plugin System

Plugins live in `app/Plugins/` and implement `PluginInterface`. They register hooks via the `Hook` class:

```php
Hook::addAction('manuscript.submitted', function ($manuscript) { ... });
Hook::addFilter('submission.form.fields', function ($fields) { ... });
```

See [`docs/PLUGIN_ARCHITECTURE.md`](docs/PLUGIN_ARCHITECTURE.md) for full documentation.

## Testing

```bash
php artisan test --compact          # all tests
php artisan test --filter=FeatureName   # single file/group
```

253 tests, 937 assertions (1 known pre-existing failure in `PluginAdminRoutesTest`).

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Write tests for your changes
4. Run `php vendor/bin/pint --dirty` to fix formatting
5. Submit a pull request

## Documentation

| Document | Description |
|---|---|
| [`docs/PLUGIN_ARCHITECTURE.md`](docs/PLUGIN_ARCHITECTURE.md) | Plugin system design and API reference |

## License

MIT — see [LICENSE](LICENSE).

---

_From the Filipino word "saliksik" — research._
