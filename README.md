# SaliksikHub: Modern Research Journal Management System

**SaliksikHub** (from the Filipino word _"saliksik"_, meaning _research_) is a comprehensive web-based manuscript management system designed to streamline the academic journal publication process. It provides an easy-to-use interface for authors, editors, and reviewers to collaborate throughout the manuscript lifecycle—from submission to publication.

---

## Key Features

### Manuscript Management

-   **Complete Submission Workflow** – Submit manuscripts with metadata, abstracts, and file uploads
-   **Lifecycle Tracking** – Statuses: Submitted → Under Review → Revisions → Accepted → Copyediting → Ready to Publish → Published
-   **File Storage** – Secure file management using DigitalOcean Spaces
-   **PDF Processing** – Automated PDF parsing and text extraction

### Editorial System

-   **Editorial Dashboard** – Interface for managing submissions and decisions
-   **Decision Management** – Accept, reject, or request revisions with detailed feedback
-   **Issue Management** – Create and organize journal issues by volume/number
-   **Pre-Review Checks** – Detect format issues, keyword mismatch, or possible plagiarism

### Peer Review

-   **Double-Blind Review** – Anonymous author-reviewer interaction to ensure fairness
-   **Reviewer Management** – Assign reviewers and track progress
-   **Analytics** – Reviewer performance and submission metrics

### User Management

-   **Role-Based Access** – Distinct roles for Authors, Reviewers, and Editors
-   **Authentication** – Secure login and session management
-   **User Profiles** – With academic affiliations and contact info

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

-   **Laravel 12 (PHP 8.2+)** – MVC framework with modern features
-   **Database** – Compatible with MySQL, PostgreSQL, SQLite

### Frontend

-   **React 19** – With TypeScript support
-   **Inertia.js** – SPA framework without REST complexity
-   **Tailwind CSS 4.1.3** – Utility-first design

### Infrastructure

-   **DigitalOcean Spaces** – File storage
-   **Vite** – For modern frontend tooling
-   **PDF Parser** – For file content extraction
-   **Email System** – SMTP-based notifications

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

## Acknowledgments

-   Thanks to Laravel, React, Inertia, and Tailwind communities
-   Built in response to the need for a modern, accessible academic publishing platform
