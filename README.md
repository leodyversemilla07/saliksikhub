# Saliksikhub: Open-Source Research Journal Management System

**Saliksikhub** (from the Filipino word _"saliksik"_, meaning _research_) is a comprehensive, open-source web-based manuscript management system designed to streamline the academic journal publication process. Built for universities, colleges, and research institutions, it provides a complete solution for managing the entire publication workflow—from manuscript submission to peer review, editorial decisions, and final publication.

## 🎯 Who Is This For?

Saliksikhub is designed for:

- **Universities & Colleges** managing institutional research journals
- **Academic Departments** publishing discipline-specific publications
- **Research Institutions** requiring manuscript management workflows
- **Conference Organizers** handling proceedings and publications
- **Open Access Journals** seeking an affordable, customizable platform

## 🚀 Complete Publication Workflow

Saliksikhub supports the entire manuscript lifecycle:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  SUBMIT     │───▶│  REVIEW     │───▶│  DECISION   │───▶│  PUBLISH    │
│             │    │             │    │             │    │             │
│ • Metadata  │    │ • Assign    │    │ • Accept    │    │ • Copyedit  │
│ • Files     │    │ • Evaluate  │    │ • Revise    │    │ • Typeset   │
│ • Authors   │    │ • Feedback  │    │ • Reject    │    │ • Issue     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## ✨ Key Features

### 📝 Manuscript Management

- **Complete Submission Workflow** – Multi-step wizard with metadata, abstracts, and file uploads (max 100MB)
- **20+ Manuscript Statuses** – From Submitted → Under Review → Revisions → Accepted → Copyediting → Typesetting → Published
- **Version Control** – Track manuscript revisions through multiple review rounds
- **File Storage** – Secure cloud storage using S3-compatible services (DigitalOcean Spaces, AWS S3, MinIO)
- **PDF Processing** – Automated PDF parsing and text extraction
- **Public Search** – Search published manuscripts by title, authors, keywords, and abstract

### ✏️ Editorial System

- **Editorial Dashboard** – Comprehensive interface for managing submissions and decisions
- **Decision Types** – Accept, Conditional Accept, Minor Revision, Major Revision, Reject, Desk Reject
- **Issue Management** – Create and organize journal issues by volume/number with publication scheduling
- **Pre-Review Screening** – Automated checks for format, scope, and plagiarism detection integration
- **Workload Balancing** – Automated assignment based on subject area and editor availability

### 👥 Peer Review

- **Double-Blind Review** – Anonymous author-reviewer interaction ensuring fairness
- **Reviewer Management** – Invite, assign, and track reviewer progress
- **Review Forms** – Customizable evaluation criteria and recommendation options
- **Analytics** – Reviewer performance metrics and response time tracking

### 🔐 User Management

- **6 User Roles** – Managing Editor, Editor-in-Chief, Associate Editor, Language Editor, Reviewer, Author
- **Two-Factor Authentication** – TOTP-based 2FA via Laravel Fortify
- **ORCID Integration** – Link researcher profiles with ORCID identifiers
- **User Profiles** – Academic affiliations, expertise keywords, CV upload
- **Granular Permissions** – Fine-grained access control via Spatie Permission

### 📧 Communication & Notifications

- **Real-Time Notifications** – Instant updates on workflow changes
- **Email Integration** – Automated alerts for submissions, reviews, and decisions
- **Activity Logging** – Complete audit trail of all actions

### 🎨 Modern Interface

- **Single Page Application** – Fast, responsive experience with Inertia.js + React
- **Dark Mode** – Light and dark theme support
- **Mobile Responsive** – Optimized for all device sizes
- **Accessible** – Built with accessibility best practices

---

## 🛠️ Customization Guide

Saliksikhub is designed to be easily customized for your institution:

### Branding & Identity

| File | What to Customize |
|------|-------------------|
| `resources/js/components/site-header.tsx` | Institution name, ISSN, logo, navigation |
| `resources/js/components/site-footer.tsx` | Contact info, social links, journal metrics |
| `resources/views/app.blade.php` | Favicon, meta tags, fonts |
| `resources/css/app.css` | Primary colors, typography |

### Key Configuration Points

1. **Institution Name** - Update in site-header.tsx top bar
2. **ISSN Number** - Display your journal's ISSN
3. **Logo** - Replace the logo image URL
4. **Contact Details** - Address, email, phone in footer
5. **Social Media** - Update links in site-footer.tsx
6. **Colors** - Modify Tailwind theme in app.css

### Environment Variables

```env
APP_NAME="Your Journal Name"
MAIL_FROM_ADDRESS=journal@yourinstitution.edu
MAIL_FROM_NAME="Your Journal Name"
```

---

## Technology Stack

### Backend

- **Laravel 12 (PHP 8.2+)** – Modern MVC framework with streamlined structure
- **Inertia.js Server** – Seamless SPA integration without REST API complexity
- **Laravel Fortify** – Authentication with two-factor support
- **Spatie Permission** – Role-based access control (RBAC)
- **Eloquent ORM** – Database abstraction and relationships
- **Database** – MySQL 8.0+ (primary), PostgreSQL, SQLite compatible

### Frontend

- **React 19** – Modern UI library with TypeScript support
- **Inertia.js Client** – SPA framework for Laravel
- **Tailwind CSS 4** – Utility-first CSS framework
- **Radix UI** – Accessible component primitives
- **shadcn/ui** – Pre-built component library
- **React Hook Form + Zod** – Form handling and validation
- **TypeScript** – Type safety and developer experience

### Infrastructure

- **S3-Compatible Storage** – DigitalOcean Spaces, AWS S3, or MinIO
- **Vite 7** – Fast frontend build tooling
- **PDF Parser** – Manuscript text extraction
- **Email System** – SMTP-based notifications
- **Laravel Queue** – Background job processing
- **Redis** – Optional caching and session storage

### Development Tools

- **Laravel Sail** – Docker development environment
- **Pest** – Modern PHP testing framework
- **ESLint** – JavaScript/TypeScript linting
- **Laravel Pint** – PHP code style fixer

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/leodyversemilla07/saliksikhub.git
cd saliksikhub
```

### 2. Install Backend Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saliksikhub
DB_USERNAME=your_username
DB_PASSWORD=your_password

DO_SPACES_KEY=your_spaces_key
DO_SPACES_SECRET=your_spaces_secret
DO_SPACES_ENDPOINT=your_endpoint
DO_SPACES_REGION=your_region
DO_SPACES_BUCKET=your_bucket

MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

### 5. Run Database Setup

```bash
php artisan migrate
php artisan db:seed  # Optional
```

### 6. Build Frontend Assets

```bash
npm run dev       # For development
npm run build     # For production
```

### 7. Start the Application

```bash
php artisan serve
```

Visit: [http://localhost:8000](http://localhost:8000)

---

## Development

-   `resources/js/` – React + TS frontend
-   `app/Http/Controllers/` – Laravel controllers
-   `app/Models/` – Eloquent ORM models
-   `database/migrations/` – Schema definitions

### Running Tests

```bash
php artisan test
npm run test   # If frontend tests configured
```

---

## 📖 Usage

### For Authors

1. **Register** – Create an account with email verification
2. **Submit Manuscript** – Use the multi-step submission wizard
3. **Track Progress** – Monitor status through the author dashboard
4. **Respond to Reviews** – Submit revisions based on reviewer feedback
5. **Publication** – Receive notification when article is published

### For Reviewers

1. **Accept Invitations** – Respond to review requests from editors
2. **Download Manuscripts** – Access anonymized submissions
3. **Submit Reviews** – Provide structured feedback and recommendations
4. **Track Assignments** – View pending and completed reviews

### For Editors

1. **Manage Submissions** – Access the editorial dashboard
2. **Pre-Screen Manuscripts** – Check scope fit and formatting
3. **Assign Reviewers** – Select and invite appropriate reviewers
4. **Make Decisions** – Accept, revise, or reject based on reviews
5. **Prepare Publication** – Copyediting, typesetting, and scheduling
6. **Publish Issues** – Create and release journal issues

---

## 🤝 Contributing

We welcome community contributions:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines

- Follow existing code conventions
- Write tests for new features
- Run `vendor/bin/pint` for PHP formatting
- Run `npm run build` to verify frontend builds

---

## 📞 Support

For help or inquiries:

- Open an issue in the repository
- Email: support@saliksikhub.org

---

## 📄 License

MIT License – see the [LICENSE](LICENSE) file.

This means you can:
- ✅ Use commercially
- ✅ Modify for your institution
- ✅ Distribute
- ✅ Use privately

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](PRD.md) | Complete Product Requirements Document |
| [USER_WORKFLOWS.md](USER_WORKFLOWS.md) | Detailed workflows for each user role |
| [MANUSCRIPT_STATUSES.md](MANUSCRIPT_STATUSES.md) | Complete status definitions and transitions |
| [roles.md](roles.md) | User roles, permissions, and access levels |

---

## 🙏 Acknowledgments

- Laravel, React, Inertia.js, and Tailwind CSS communities
- Open Journal Systems (OJS) for inspiration
- All contributors and testers

---

## 📊 Project Status

| Metric | Status |
|--------|--------|
| Version | 1.1 |
| Last Updated | December 2025 |
| PHP Version | 8.2+ |
| Laravel Version | 12.x |
| License | MIT |

---

**Saliksikhub** – _Empowering academic publishing for institutions worldwide._

_From the Filipino word "saliksik" meaning "research"_
