# SaliksikHub: Modern Research Journal Management System

**SaliksikHub** (from the Filipino word _"saliksik"_, meaning _research_) is a comprehensive web-based manuscript management system designed to streamline the academic journal publication process. It provides an easy-to-use interface for authors, editors, and reviewers to collaborate throughout the manuscript lifecycle—from submission to publication.

---

## Key Features

### Manuscript Management

-   **Complete Submission Workflow** – Submit manuscripts with metadata, abstracts, and file uploads (max 100MB)
-   **Lifecycle Tracking** – 20+ statuses from Submitted → Under Review → Revisions → Accepted → Copyediting → Typesetting → Published
-   **File Storage** – Secure cloud storage using DigitalOcean Spaces (S3-compatible)
-   **PDF Processing** – Automated PDF parsing and text extraction
-   **Version Control** – Track manuscript revisions through multiple rounds (typically 3-4)

### Editorial System

-   **Editorial Dashboard** – Comprehensive interface for managing submissions and decisions
-   **Decision Management** – Six decision types: Accept, Conditional Accept, Minor Revision, Major Revision, Reject, Desk Reject
-   **Issue Management** – Create and organize journal issues by volume/number with publication scheduling
-   **Pre-Review Checks** – Automated screening for format issues, scope fit, and plagiarism detection integration
-   **Workflow Automation** – Automated assignment based on subject area and workload balancing

### Peer Review

-   **Double-Blind Review** – Anonymous author-reviewer interaction to ensure fairness
-   **Reviewer Management** – Assign reviewers and track progress
-   **Analytics** – Reviewer performance and submission metrics

### User Management

-   **Role-Based Access** – Six distinct roles: Managing Editor, Editor-in-Chief, Associate Editor, Language Editor, Reviewer, Author
-   **Authentication** – Laravel Fortify with two-factor authentication (TOTP) support
-   **ORCID Integration** – Link researcher profiles with ORCID IDs
-   **User Profiles** – Academic affiliations, expertise keywords, CV upload, and performance metrics
-   **Granular Permissions** – Spatie Permission package for fine-grained access control

### Communication & Notifications

-   **Real-Time Notifications** – For workflow status updates
-   **Email Integration** – Automated alerts for key events
-   **Activity Tracking** – Logs of key actions across the system

### Modern Interface

-   **SPA Experience** – Built with Inertia.js and React
-   **Responsive Design** – Tailwind CSS for mobile-optimized UI
-   **TypeScript Integration** – For improved safety and development efficiency

---

## Technology Stack

### Backend

-   **Laravel 12 (PHP 8.2+)** – Modern MVC framework with streamlined structure
-   **Inertia.js Server** – Seamless SPA integration without REST API complexity
-   **Laravel Fortify** – Authentication with two-factor support
-   **Spatie Permission** – Role-based access control (RBAC)
-   **Eloquent ORM** – Database abstraction and relationships
-   **Database** – MySQL 8.0+ (primary), PostgreSQL, SQLite compatible

### Frontend

-   **React 19** – Modern UI library with TypeScript support
-   **Inertia.js Client** – SPA framework for Laravel
-   **Tailwind CSS 4.1** – Utility-first CSS framework
-   **Radix UI** – Accessible component primitives
-   **shadcn/ui** – Pre-built component library
-   **React Hook Form + Zod** – Form handling and validation
-   **TypeScript** – Type safety and developer experience

### Infrastructure

-   **DigitalOcean Spaces** – Cloud file storage (S3-compatible)
-   **Vite 7** – Fast frontend build tooling
-   **PDF Parser** – Manuscript text extraction
-   **Email System** – SMTP-based notifications
-   **Laravel Queue** – Background job processing
-   **Redis** – Optional caching and session storage

### Development Tools

-   **Laravel Sail** – Docker development environment
-   **Pest** – Modern PHP testing framework
-   **ESLint** – JavaScript/TypeScript linting
-   **Laravel Pint** – PHP code style fixer

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

## Usage

### For Authors

1. Register or log in
2. Submit a manuscript with metadata
3. Track status and respond to review feedback

### For Editors

1. Access dashboard
2. Assign reviewers and make editorial decisions
3. Organize issues and publish content

---

## Contributing

We welcome community contributions:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Submit a pull request

---

## Support

For help or inquiries:

-   Open an issue in the repository
-   Email: \[email protected]

---

## License

MIT License – see the [LICENSE](LICENSE) file.

---

## Documentation

-   **[PRD.md](PRD.md)** - Complete Product Requirements Document
-   **[USER_WORKFLOWS.md](USER_WORKFLOWS.md)** - Detailed workflows for each user role
-   **[MANUSCRIPT_STATUSES.md](MANUSCRIPT_STATUSES.md)** - Complete status definitions and transitions
-   **[roles.md](roles.md)** - User roles, permissions, and access levels

---

## Acknowledgments

-   Thanks to Laravel, React, Inertia, and Tailwind communities
-   Built in response to the need for a modern, accessible academic publishing platform

---

**Version**: 1.1  
**Last Updated**: January 11, 2025  
**System Name**: SaliksikHub (from Filipino _"saliksik"_ meaning _research_)
