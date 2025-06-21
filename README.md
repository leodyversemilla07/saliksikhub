# SaliksikHub: Modern Research Journal Management System

**SaliksikHub** (Saliksik means "research" in Filipino) is a comprehensive web-based manuscript management system built with modern technologies. It provides a streamlined platform for authors and editors to manage the complete journal publication workflow from submission to publication.

## Key Features

### Manuscript Management
* **Complete Submission Workflow:** Authors can submit manuscripts with comprehensive metadata, abstracts, and file uploads
* **Advanced Status Tracking:** Full manuscript lifecycle tracking through statuses: Submitted, Under Review, Minor/Major Revision, Accepted, Copyediting, Awaiting Approval, Ready to Publish, Rejected, Published
* **File Management:** Secure file storage and management using DigitalOcean Spaces with support for multiple file formats
* **PDF Processing:** Automatic PDF parsing and text extraction for manuscript content analysis

### Editorial System
* **Editorial Dashboard:** Comprehensive editor interface for managing submissions and making editorial decisions
* **Decision Management:** Structured editorial decision-making with detailed feedback and revision tracking
* **Issue Management:** Create and manage journal issues with volume and number organization
* **Manuscript Assignment:** Assign manuscripts to specific journal issues for publication planning

### User Management
* **Role-Based Access:** Distinct author and editor roles with appropriate permissions
* **User Profiles:** Comprehensive user profiles with academic affiliations and contact information
* **Authentication System:** Secure user authentication and session management

### Communication & Notifications
* **Real-time Notifications:** Comprehensive notification system for status updates and communications
* **Email Integration:** Automated email notifications for important workflow events
* **Activity Tracking:** Detailed activity logs for manuscript and editorial actions

### Modern Interface
* **Responsive Design:** Mobile-friendly interface built with Tailwind CSS
* **Single Page Application:** Smooth user experience with Inertia.js and React
* **TypeScript Support:** Type-safe frontend development with full TypeScript integration
* **Modern UI Components:** Clean, professional interface optimized for academic publishing workflows

## Technology Stack

### Backend
* **Laravel 12.0** - Modern PHP framework with advanced features
* **PHP 8.2+** - Latest PHP version with performance improvements
* **Database Support** - SQLite, MySQL, PostgreSQL compatibility

### Frontend
* **React 19.0** - Latest React with concurrent features
* **TypeScript** - Full type safety and enhanced developer experience
* **Inertia.js** - SPA functionality without API complexity
* **Tailwind CSS 4.1.3** - Utility-first CSS framework with modern design

### Infrastructure
* **DigitalOcean Spaces** - Scalable file storage solution
* **PDF Parser** - Advanced PDF processing capabilities
* **Email System** - Integrated email notification system

## Prerequisites

* PHP 8.2 or higher
* Composer (PHP package manager)
* Node.js 18+ and npm
* Database (MySQL, PostgreSQL, or SQLite)
* DigitalOcean Spaces account (for file storage)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/leodyversemilla07/saliksikhub.git
cd saliksikhub
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables
Edit `.env` file with your settings:
```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saliksikhub
DB_USERNAME=your_username
DB_PASSWORD=your_password

# DigitalOcean Spaces Configuration
DO_SPACES_KEY=your_spaces_key
DO_SPACES_SECRET=your_spaces_secret
DO_SPACES_ENDPOINT=your_spaces_endpoint
DO_SPACES_REGION=your_region
DO_SPACES_BUCKET=your_bucket_name

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

### 6. Database Setup
```bash
# Run database migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

### 7. Build Frontend Assets
```bash
# Development build
npm run dev

# Production build
npm run build
```

### 8. Start the Application
```bash
# Start Laravel development server
php artisan serve

# Start Vite development server (in another terminal)
npm run dev
```

The application will be available at `http://localhost:8000`

## Development

### Frontend Development
The frontend uses React with TypeScript and is built with Vite. Key directories:
* `resources/js/` - React components and TypeScript files
* `resources/js/types/` - TypeScript type definitions
* `resources/css/` - Tailwind CSS styles

### Backend Development
The backend follows Laravel conventions:
* `app/Models/` - Eloquent models for database entities
* `app/Http/Controllers/` - Request handling and business logic
* `app/Notifications/` - Email and system notifications
* `database/migrations/` - Database schema definitions

### Running Tests
```bash
# Run PHP tests
php artisan test

# Run frontend tests (if configured)
npm run test
```

## Usage

### For Authors
1. **Register/Login** - Create an account or log in to the system
2. **Submit Manuscript** - Upload your research paper with required metadata
3. **Track Progress** - Monitor your submission status through the dashboard
4. **Respond to Reviews** - Handle revision requests and resubmit when required

### For Editors
1. **Access Editorial Dashboard** - Review submitted manuscripts
2. **Make Editorial Decisions** - Accept, reject, or request revisions
3. **Manage Issues** - Create and organize journal issues
4. **Assign Manuscripts** - Organize accepted papers into publication issues

## Contributing

We welcome contributions to SaliksikHub! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions, issues, or support requests, please:
* Open an issue on the project repository
* Contact the development team at [email protected]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* Built with Laravel and React communities' excellent documentation
* Inspired by the need for modern, efficient academic publishing tools
* Special thanks to all contributors and beta testers
