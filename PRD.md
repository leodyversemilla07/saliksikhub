# Product Requirements Document: Research Journal Management System

## 1. Executive Summary

### 1.1 Product Overview
The Research Journal Management System (RJMS) is a comprehensive digital platform designed to streamline the entire lifecycle of academic journal publishing, from manuscript submission through peer review, editorial management, production, and publication. The system will serve researchers, editors, reviewers, and publishers in managing scholarly content efficiently.

### 1.2 Business Objectives
- Reduce manuscript processing time by 40%
- Increase reviewer engagement and response rates by 30%
- Provide real-time visibility into manuscript status for all stakeholders
- Ensure compliance with academic publishing standards and ethical guidelines
- Enable data-driven decision making through analytics and reporting

### 1.3 Success Metrics
- Average time from submission to first decision: < 45 days
- Reviewer acceptance rate: > 60%
- System uptime: 99.9%
- User satisfaction score: > 4.5/5
- Monthly active users growth: 20% year-over-year

## 2. Stakeholders

### 2.1 Primary Users
- **Authors**: Submit and track manuscripts, respond to reviews, manage revisions
- **Editors-in-Chief**: Oversee journal operations, make final publication decisions
- **Associate Editors**: Manage assigned manuscripts, coordinate reviews
- **Reviewers**: Evaluate manuscripts, provide feedback and recommendations
- **Editorial Assistants**: Perform administrative tasks, communicate with stakeholders
- **Publishers**: Monitor journal performance, manage subscriptions and access

### 2.2 Secondary Users
- **Readers/Subscribers**: Access published content
- **Institutional Administrators**: Manage institutional subscriptions
- **System Administrators**: Configure and maintain the platform

## 3. Functional Requirements

### 3.1 User Management

#### 3.1.1 Registration and Authentication
- Users can create accounts with email verification (Laravel Fortify)
- Support for ORCID integration for author identification
- Multi-factor authentication (MFA) via Laravel Fortify (TOTP, SMS, email)
- Single Sign-On (SSO) integration with institutional credentials
- Role-based access control (RBAC) system (Spatie Permission package)
- Password recovery and reset functionality (Laravel Fortify)
- Profile management with CV upload capability
- Two-factor authentication recovery codes
- Password confirmation for sensitive actions

#### 3.1.2 User Roles and Permissions
- Define granular permissions for each role type
- Support for multiple roles per user across different journals
- Role delegation and temporary assignment capabilities
- Activity logging for audit trails

### 3.2 Manuscript Submission

#### 3.2.1 Submission Workflow
- Multi-step submission wizard with progress indication
- Support for multiple file formats (PDF, Word, LaTeX, images)
- File size limit: up to 100MB per submission
- Drag-and-drop file upload interface
- Automatic metadata extraction from uploaded files
- Co-author management with contribution roles
- Conflict of interest declaration
- Suggested and opposed reviewer nominations
- Cover letter and abstract entry (up to 500 words)
- Keyword and subject area classification
- Supplementary materials upload
- Compliance checklist (ethics approval, data availability, funding disclosure)
- Save draft functionality with auto-save every 2 minutes
- Submission confirmation email with manuscript ID

#### 3.2.2 Manuscript Types
- Original research articles
- Review articles
- Short communications
- Case studies
- Letters to the editor
- Editorials
- Corrections and retractions

#### 3.2.3 Pre-submission Checks
- Plagiarism detection integration (Turnitin, iThenticate)
- Reference formatting validation
- File integrity verification
- Minimum word count validation
- Required section verification

### 3.3 Editorial Workflow

#### 3.3.1 Manuscript Assignment
- Automatic assignment based on subject area matching
- Manual assignment by Editor-in-Chief
- Editor workload balancing algorithm
- Assignment notification system
- Decline assignment option with reason
- Reassignment capability

#### 3.3.2 Editorial Decision Making
- Pre-screening for scope and quality
- Decision options: Accept, Minor Revision, Major Revision, Reject, Desk Reject
- Decision templates with customizable text
- Decision history tracking
- Appeal process workflow
- Automated notification to authors upon decision
- Deadline tracking for editorial actions

#### 3.3.3 Reviewer Selection
- Searchable reviewer database with expertise tags
- Reviewer suggestion algorithm based on manuscript keywords
- Conflict of interest checking (institution, co-authorship)
- Reviewer performance metrics display
- Batch invitation capability
- Invitation templates with customization options
- Reminder system for non-responsive invitations

### 3.4 Peer Review Process

#### 3.4.1 Reviewer Interface
- Anonymous manuscript access (single-blind or double-blind)
- Downloadable manuscript files
- Structured review form with rating scales
- Free-text feedback sections (confidential and author-facing)
- Recommendation options: Accept, Minor Revision, Major Revision, Reject
- File upload for annotated manuscripts
- Review deadline display with extension request option
- Review history access
- Continuing Medical Education (CME) credit tracking

#### 3.4.2 Review Management
- Configurable review rounds (typically 2-3 rounds)
- Minimum reviewer requirement (default: 2 per manuscript)
- Review quality assessment by editors
- Reviewer performance tracking (timeliness, quality)
- Automated reminder system (3, 7, and 14 days before deadline)
- Late review flagging and escalation
- Review withdrawal capability with notification

#### 3.4.3 Revision Process
- Author revision submission with point-by-point response
- Track changes support
- Version comparison tool
- Revision deadline enforcement (typically 30-90 days)
- Re-review to same or new reviewers
- Revision history documentation

### 3.5 Communication System

#### 3.5.1 Messaging Features
- In-system messaging between all stakeholders
- Email notifications with configurable preferences
- Message templates for common communications
- Automated status update notifications
- Bulk messaging capability for editors
- Message history and search functionality
- File attachment support in messages

#### 3.5.2 Notification Types
- Submission confirmation
- Assignment notifications
- Review invitations
- Deadline reminders
- Decision notifications
- Revision requests
- Publication alerts
- System announcements

### 3.6 Production and Publication

#### 3.6.1 Copyediting
- Manuscript transfer to production queue
- Copyeditor assignment
- Style and format checking
- Author query management
- Proof generation and approval workflow
- Correction round tracking

#### 3.6.2 Typesetting and Layout
- Template-based formatting
- Multi-format output (PDF, HTML, XML, ePub)
- Figure and table optimization
- Reference linking (DOI, PubMed)
- Accessibility compliance (WCAG 2.1 AA)

#### 3.6.3 Publication
- DOI assignment integration
- Publication date scheduling
- Early online publication option
- Issue compilation and organization
- Indexing metadata generation (CrossRef, PubMed, Scopus)
- Social media sharing integration
- Usage statistics tracking

### 3.7 Content Management

#### 3.7.1 Article Organization
- Volume and issue management
- Special issue creation and management
- Article categorization by type and subject
- Table of contents generation
- Archive browsing by date, topic, and author

#### 3.7.2 Search and Discovery
- Full-text search capability
- Advanced search with filters (date, author, keywords, type)
- Boolean search operators
- Citation export in multiple formats (BibTeX, RIS, EndNote)
- "Most cited" and "Most downloaded" lists
- Related articles recommendation algorithm

### 3.8 Access Control and Distribution

#### 3.8.1 Access Models
- Open access with Creative Commons licensing
- Subscription-based access
- Hybrid model support
- Pay-per-view option
- Institutional access via IP authentication
- Embargo period configuration

#### 3.8.2 Rights Management
- Copyright transfer agreement workflow
- Licensing agreement templates
- Author rights retention options
- Reprint and permission requests
- Usage rights documentation

### 3.9 Analytics and Reporting

#### 3.9.1 Dashboard Views
- Submission trends over time
- Acceptance/rejection rates
- Average processing time by stage
- Reviewer performance metrics
- Editor workload distribution
- Geographic submission distribution
- Subject area distribution

#### 3.9.2 Reports
- Editorial board activity reports
- Financial reports (for paid submissions)
- Impact metrics (citations, downloads, Altmetrics)
- Reviewer database statistics
- Custom report builder
- Exportable reports (PDF, Excel, CSV)
- Scheduled automated reports

#### 3.9.3 Article-Level Metrics
- Download statistics
- Citation tracking
- Altmetric scores
- Social media mentions
- Geographic reach analysis

### 3.10 Administrative Functions

#### 3.10.1 Journal Configuration
- Journal profile management (title, ISSN, scope, guidelines)
- Editorial board composition
- Author guidelines and instructions
- Review criteria customization
- Email template management
- Workflow customization
- Fee structure configuration

#### 3.10.2 System Configuration
- User role definitions
- Notification settings
- Integration configurations
- Backup and recovery procedures
- Data retention policies
- Security settings

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time: < 3 seconds for 95% of requests
- Search results: < 2 seconds
- Support for 1,000 concurrent users
- File upload speed: minimum 1 MB/s
- Database query optimization for reports
- Scalability to handle 10,000+ manuscripts annually

### 4.2 Security
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)
- Regular security audits and penetration testing
- GDPR compliance for user data
- Secure API endpoints with authentication tokens
- Regular automated backups (daily incremental, weekly full)
- Disaster recovery plan with 4-hour RTO
- SQL injection and XSS attack prevention
- Session timeout after 30 minutes of inactivity

### 4.3 Reliability
- System availability: 99.9% uptime
- Automated failover capabilities
- Regular system health monitoring
- Error logging and alerting system
- Graceful degradation for non-critical features

### 4.4 Usability
- Intuitive interface requiring minimal training
- Responsive design for desktop, tablet, and mobile devices
- Accessibility compliance (WCAG 2.1 AA standards)
- Multi-language support (initially English, expandable)
- Contextual help and tooltips
- Comprehensive user documentation
- Video tutorials for key workflows
- Maximum 3 clicks to reach any major function

### 4.5 Compatibility
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile OS: iOS 13+, Android 9+
- Screen reader compatibility
- API for third-party integrations

### 4.6 Maintainability
- Modular architecture for easy updates
- Comprehensive API documentation
- Code documentation and commenting standards
- Automated testing suite (unit, integration, end-to-end)
- Version control and deployment procedures
- System monitoring and logging

## 5. Technical Requirements

### 5.1 Technology Stack

#### Backend
- **PHP**: 8.2.29
- **Laravel Framework**: 12.33.0 (latest features including streamlined structure)
- **Inertia.js (Server)**: 2.0.10 for seamless SPA integration
- **Ziggy**: 2.6.0 for Laravel route usage in JavaScript
- **Laravel Fortify**: Backend authentication without UI scaffolding
- **Laravel MCP**: 0.2.1 for Model Context Protocol integration
- **Laravel Sail**: 1.46.0 for Docker development environment
- **Laravel Pint**: 1.25.1 for PHP code style formatting

#### Frontend
- **React**: 19.2.0
- **Inertia.js (Client)**: 2.2.8 (@inertiajs/react)
- **Tailwind CSS**: 4.1.14 (latest version with modern CSS approach)
- **ESLint**: 9.37.0 for JavaScript linting
- **Vite**: For fast frontend bundling and development

#### Testing
- **Pest**: 3.8.4 for elegant testing syntax
- **PHPUnit**: 11.5.33 as the underlying test framework
- **Laravel Prompts**: 0.3.7 for interactive CLI prompts

#### Database & Caching
- **MySQL**: 8.0+ (primary relational database)
- **Redis**: For caching and queue management
- **Laravel Scout**: For full-text search (using database driver with MySQL)

#### Development Tools
- **Docker**: Via Laravel Sail for consistent development environment
- **Composer**: For PHP dependency management
- **NPM/Node.js**: For JavaScript dependency management

### 5.2 System Architecture
- Cloud-based infrastructure (AWS, Azure, or Google Cloud)
- Microservices architecture
- RESTful API design
- Containerized deployment (Docker/Kubernetes)
- Load balancing and auto-scaling

### 5.3 Database
- Primary database: MySQL 8.0+ for all structured data
- JSON column types for flexible metadata storage (replacing need for separate document store)
- Full-text search using MySQL full-text indexes or Laravel Scout with database driver
- Database replication for redundancy (primary-replica setup)
- Regular automated backup schedule (daily incremental, weekly full)

### 5.4 Integrations
- ORCID authentication API
- CrossRef DOI registration
- Plagiarism detection services (iThenticate, Turnitin)
- Reference management tools (EndNote, Mendeley, Zotero)
- Indexing services (PubMed, Scopus, Web of Science)
- Email service provider (SendGrid, AWS SES)
- Cloud storage (AWS S3, Azure Blob Storage)
- Payment gateway (Stripe, PayPal) for article processing charges
- Identity providers for SSO (SAML 2.0, OAuth 2.0)

### 5.5 File Storage
- Secure cloud-based file storage
- CDN integration for fast content delivery
- File versioning and audit trail
- Virus scanning for uploaded files
- Automatic file format conversion

## 6. User Experience Requirements

### 6.1 Design Principles
- Clean, professional aesthetic appropriate for academic context
- Consistent navigation across all sections
- Clear visual hierarchy and information architecture
- Minimal cognitive load with progressive disclosure
- Accessible color scheme with sufficient contrast

### 6.2 Key User Flows
- Author submission (target: < 15 minutes for complete submission)
- Editor manuscript assignment (< 5 minutes)
- Reviewer evaluation (streamlined review form)
- Decision communication (automated with templates)

### 6.3 Mobile Experience
- Responsive design for all screen sizes
- Touch-optimized interface elements
- Simplified navigation for smaller screens
- Offline access to downloaded manuscripts
- Push notifications for critical updates

## 7. Compliance and Standards

### 7.1 Publishing Standards
- COPE (Committee on Publication Ethics) guidelines
- ICMJE (International Committee of Medical Journal Editors) recommendations
- COUNTER metrics for usage statistics
- FAIR data principles
- CONSORT, PRISMA, and other reporting guidelines

### 7.2 Legal and Regulatory
- GDPR compliance for European users
- CCPA compliance for California users
- Copyright and intellectual property management
- Terms of service and privacy policy
- Data processing agreements with institutions

### 7.3 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader optimization
- Alternative text for images
- Captioning for multimedia content

## 8. Data Management

### 8.1 Data Retention
- Active manuscripts: retained indefinitely
- Rejected manuscripts: 2 years post-decision
- User accounts: retained while active, archived after 3 years inactivity
- Published articles: permanent retention
- Review data: 5 years post-publication
- Audit logs: 7 years

### 8.2 Data Export
- User data export upon request
- Manuscript export in multiple formats
- Bulk data export for journal migration
- Compliance with data portability requirements

### 8.3 Backup and Recovery
- Daily incremental backups
- Weekly full backups
- Off-site backup storage
- Quarterly disaster recovery testing
- Point-in-time recovery capability

## 9. Support and Training

### 9.1 User Support
- Email support with 24-hour response time
- Live chat during business hours
- Searchable knowledge base
- FAQ section for common issues
- Community forum for users
- Dedicated support for editors and administrators

### 9.2 Training Materials
- Video tutorials for each user role
- Interactive onboarding wizard for new users
- Downloadable user guides (PDF)
- Webinar series for editors and reviewers
- Regular office hours for Q&A sessions

### 9.3 Release Management
- Quarterly feature releases
- Monthly security and bug fix updates
- Release notes with detailed change logs
- Advance notice for major changes
- User feedback mechanism for feature requests

## 10. Implementation Plan

**Technical Foundation:**
- Laravel 12 with modern streamlined structure (no Kernel files)
- React 19 with Inertia.js 2 for SPA experience
- Tailwind CSS 4 for styling
- MySQL 8.0+ database
- Laravel Sail for local Docker development
- Pest for elegant testing approach

### 10.1 Phase 1: Core Features (Months 1-6)
- User management and authentication (Laravel Fortify with Inertia.js frontend)
- ORCID integration for researcher identification
- Manuscript submission workflow
- Basic editorial assignment
- Simple peer review process
- Email notifications

### 10.2 Phase 2: Advanced Workflow (Months 7-12)
- Advanced reviewer matching
- Production and publication tools
- Analytics dashboard
- Integration with plagiarism detection
- DOI assignment

### 10.3 Phase 3: Optimization (Months 13-18)
- Advanced reporting and analytics
- Mobile optimization
- API for third-party integrations
- Advanced search capabilities
- Performance optimization

### 10.4 Phase 4: Expansion (Months 19-24)
- Multi-language support
- Advanced customization options
- AI-assisted reviewer matching
- Predictive analytics
- Enhanced mobile apps

## 11. Success Criteria

### 11.1 Launch Criteria
- All Phase 1 features complete and tested
- Security audit passed
- Performance benchmarks met
- User acceptance testing completed
- Training materials published
- At least 3 pilot journals successfully migrated

### 11.2 Post-Launch Metrics (6 months)
- User adoption rate > 80% for pilot journals
- System uptime > 99.5%
- Average processing time reduced by 25%
- User satisfaction score > 4.0/5
- Critical bug count < 5

### 11.3 Long-Term Success (24 months)
- 50+ journals using the platform
- Processing time targets met
- Reviewer engagement targets met
- Revenue targets achieved (if applicable)
- Market share growth in academic publishing sector

## 12. Risks and Mitigation

### 12.1 Technical Risks
- **Risk**: System performance degradation under load
  - **Mitigation**: Load testing, scalable architecture, performance monitoring
- **Risk**: Data loss or corruption
  - **Mitigation**: Robust backup strategy, redundancy, regular recovery testing
- **Risk**: Security breaches
  - **Mitigation**: Regular security audits, penetration testing, encryption

### 12.2 Business Risks
- **Risk**: Low user adoption
  - **Mitigation**: User-centered design, comprehensive training, pilot program
- **Risk**: Resistance from existing users
  - **Mitigation**: Change management strategy, gradual rollout, support resources
- **Risk**: Competition from established platforms
  - **Mitigation**: Differentiated features, competitive pricing, superior UX

### 12.3 Operational Risks
- **Risk**: Insufficient support capacity
  - **Mitigation**: Scalable support model, comprehensive documentation, community forums
- **Risk**: Integration failures
  - **Mitigation**: Thorough testing, fallback mechanisms, vendor relationships

## 13. Budget and Resources

### 13.1 Development Team
- Project Manager (1 FTE)
- Product Designer (1 FTE) - expertise in React/Tailwind CSS
- Frontend Developers (3 FTE) - React 19, Inertia.js 2, Tailwind CSS 4
- Backend Developers (3 FTE) - Laravel 12, PHP 8.2, MySQL 8.0+
- QA Engineers (2 FTE) - Pest testing framework experience
- DevOps Engineer (1 FTE) - Docker, Laravel Sail, cloud infrastructure
- Technical Writer (0.5 FTE)

### 13.2 Infrastructure Costs
- Cloud hosting: $5,000-10,000/month
- Third-party services: $2,000-5,000/month
- Storage and bandwidth: $1,000-3,000/month
- Security and compliance tools: $1,000-2,000/month

### 13.3 Ongoing Costs
- Customer support team (2-3 FTE)
- Maintenance and updates (2-3 developers)
- Infrastructure scaling
- Third-party service fees

## 14. Glossary

- **Manuscript**: A research document submitted for peer review and potential publication
- **DOI**: Digital Object Identifier, a unique persistent identifier for academic content
- **ORCID**: Open Researcher and Contributor ID, a unique identifier for researchers
- **Peer Review**: Evaluation of research by experts in the same field
- **Impact Factor**: Metric measuring the average number of citations to articles in a journal
- **Embargo Period**: Time period before open access content becomes freely available
- **Altmetrics**: Alternative metrics measuring online attention to research
- **Preprint**: Version of manuscript before peer review
- **Retraction**: Formal withdrawal of published article due to errors or misconduct
- **COPE**: Committee on Publication Ethics
- **ICMJE**: International Committee of Medical Journal Editors

## 15. Appendices

### 15.1 User Stories

**Author User Stories:**
- As an author, I want to submit my manuscript easily so that I can focus on my research
- As an author, I want to track my manuscript status so that I know where it is in the review process
- As an author, I want to respond to reviewer comments systematically so that I can address all feedback

**Editor User Stories:**
- As an editor, I want to quickly assess manuscript fit so that I can make efficient desk decisions
- As an editor, I want to find appropriate reviewers so that I get quality feedback
- As an editor, I want to monitor editorial workflow so that I can meet publication deadlines

**Reviewer User Stories:**
- As a reviewer, I want a structured review form so that I provide consistent feedback
- As a reviewer, I want to manage my review commitments so that I can balance my workload
- As a reviewer, I want to access manuscripts securely so that confidentiality is maintained

### 15.2 Wireframes and Mockups

#### Dashboard Views
**Author Dashboard:**
- Manuscript status cards with visual progress indicators
- Quick submission button prominently displayed
- Recent activity timeline
- Notification center with badge counters
- Action items requiring attention highlighted

**Editor Dashboard:**
- Assigned manuscripts list with sorting/filtering
- Workload distribution chart
- Pending actions queue with priority indicators
- Quick decision buttons for common actions
- Reviewer pool status overview

**Reviewer Dashboard:**
- Active review invitations with accept/decline buttons
- Current assignments with deadline countdown
- Completed reviews history
- Performance metrics (completed reviews, average turnaround time)
- Available CME credits tracker

#### Key Page Layouts
**Manuscript Submission Flow:**
1. Landing page with progress stepper (5 steps)
2. Manuscript details (title, abstract, keywords)
3. Author information and co-author management
4. File upload with drag-and-drop zone
5. Declarations and compliance checkboxes
6. Review and submit confirmation

**Review Interface:**
- Split-screen layout: manuscript viewer (left), review form (right)
- Collapsible sections for each review criterion
- Rating scales with visual indicators (1-5 stars or 1-10 numeric)
- Rich text editor for comments
- Annotation toolbar for PDF markup
- Save draft and submit buttons with confirmation

**Editorial Decision Page:**
- Manuscript summary card at top
- Review summaries in expandable cards
- Decision selection dropdown with conditional fields
- Template selector for decision letters
- Preview pane for decision communication
- Submit decision with email notification toggle

### 15.3 Technical Architecture Diagrams

#### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼─────────┐           ┌────────▼─────────┐
│   Web Server 1   │           │   Web Server 2   │
│   (Laravel App)  │           │   (Laravel App)  │
└────────┬─────────┘           └────────┬─────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼────────┐ ┌───▼──────────┐ ┌─▼────────────────┐
│   MySQL 8.0+    │ │    Redis     │ │   Laravel Scout  │
│  (Primary DB)   │ │   (Cache &   │ │   (Search with   │
│                 │ │    Queue)    │ │   MySQL driver)  │
└─────────────────┘ └──────────────┘ └──────────────────┘
         │
┌────────▼─────────┐
│   MySQL 8.0+     │
│  (Read Replica)  │
└──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────┬───────────────┬───────────────────────────┤
│  AWS S3         │   SendGrid    │   ORCID API               │
│  (File Storage) │   (Email)     │   (Authentication)        │
├─────────────────┼───────────────┼───────────────────────────┤
│  iThenticate    │   CrossRef    │   PubMed                  │
│  (Plagiarism)   │   (DOI)       │   (Indexing)              │
└─────────────────┴───────────────┴───────────────────────────┘
```

#### Application Layer Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  React 19.2 + Inertia.js 2.2 + Tailwind CSS 4.1            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API Gateway Layer                          │
│  Laravel 12 Routes, Middleware, Fortify Auth, Rate Limiting │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────────┐
         │               │                   │
┌────────▼────────┐ ┌───▼──────────┐ ┌─────▼─────────────┐
│  Manuscript     │ │   Editorial   │ │   Publication     │
│  Service        │ │   Service     │ │   Service         │
│  - Submission   │ │  - Assignment │ │  - Copyediting    │
│  - Revision     │ │  - Decision   │ │  - Typesetting    │
│  - Files        │ │  - Reviewer   │ │  - DOI            │
└─────────────────┘ └───────────────┘ └───────────────────┘
         │               │                   │
┌────────▼───────────────▼───────────────────▼───────────────┐
│                    Data Access Layer                        │
│  Eloquent ORM, Query Builder, Repositories                  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Database Layer                            │
│  Models, Migrations, Factories, Seeders                     │
└─────────────────────────────────────────────────────────────┘
```

#### Data Flow - Manuscript Submission
```
Author → React Form → Inertia → Laravel Controller
                                      ↓
                              Form Request Validation
                                      ↓
                              Manuscript Service
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    │                                   │
            Save to Database                    Upload to S3
            (Manuscript Model)                  (File Storage)
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ↓
                          Queue Notification Job
                                      ↓
                          Send Email to Editor
                                      ↓
                          Return Success Response
```

### 15.4 Data Model

#### Core Entities and Relationships

**Users Table:**
```
users
├── id (primary key)
├── name
├── email (unique)
├── password
├── orcid_id (unique, nullable)
├── affiliation
├── country
├── bio
├── cv_path
├── email_verified_at
├── mfa_enabled
├── last_login_at
├── timestamps
└── soft_deletes
```

**Manuscripts Table:**
```
manuscripts
├── id (primary key)
├── manuscript_number (unique, auto-generated)
├── title
├── abstract
├── keywords (JSON)
├── manuscript_type (enum)
├── subject_area
├── word_count
├── status (enum: submitted, under_review, revision, accepted, rejected, published)
├── submitted_by (foreign key → users)
├── assigned_editor_id (foreign key → users, nullable)
├── submission_date
├── decision_date (nullable)
├── publication_date (nullable)
├── doi (nullable)
├── version
├── parent_manuscript_id (foreign key → manuscripts, nullable for revisions)
├── timestamps
└── soft_deletes
```

**Manuscript Authors Table (Pivot):**
```
manuscript_authors
├── id (primary key)
├── manuscript_id (foreign key → manuscripts)
├── user_id (foreign key → users)
├── author_order
├── is_corresponding
├── contribution_role (JSON)
├── timestamps
```

**Manuscript Files Table:**
```
manuscript_files
├── id (primary key)
├── manuscript_id (foreign key → manuscripts)
├── file_type (enum: main_document, cover_letter, figure, table, supplementary)
├── filename
├── storage_path
├── file_size
├── mime_type
├── uploaded_by (foreign key → users)
├── version
├── timestamps
└── soft_deletes
```

**Reviews Table:**
```
reviews
├── id (primary key)
├── manuscript_id (foreign key → manuscripts)
├── reviewer_id (foreign key → users)
├── review_round
├── invitation_sent_at
├── invitation_response (enum: accepted, declined, null)
├── response_date
├── review_submitted_at
├── due_date
├── recommendation (enum: accept, minor_revision, major_revision, reject)
├── confidential_comments (text)
├── author_comments (text)
├── quality_rating (1-10)
├── originality_rating (1-10)
├── methodology_rating (1-10)
├── significance_rating (1-10)
├── annotated_file_path (nullable)
├── status (enum: invited, accepted, in_progress, completed, declined)
├── timestamps
└── soft_deletes
```

**Editorial Decisions Table:**
```
editorial_decisions
├── id (primary key)
├── manuscript_id (foreign key → manuscripts)
├── editor_id (foreign key → users)
├── decision_type (enum: accept, minor_revision, major_revision, reject, desk_reject)
├── decision_date
├── decision_letter (text)
├── revision_due_date (nullable)
├── round_number
├── timestamps
```

**Roles and Permissions:**
```
roles
├── id (primary key)
├── name (unique)
├── guard_name
├── timestamps

permissions
├── id (primary key)
├── name (unique)
├── guard_name
├── timestamps

model_has_roles (pivot)
├── role_id
├── model_type
├── model_id

role_has_permissions (pivot)
├── permission_id
└── role_id
```

**Issues Table:**
```
issues
├── id (primary key)
├── volume_number
├── issue_number
├── title
├── publication_date
├── is_special_issue
├── guest_editor_id (foreign key → users, nullable)
├── status (enum: planning, open, in_production, published)
├── cover_image_path (nullable)
├── timestamps
└── soft_deletes
```

**Manuscript Revisions Table:**
```
manuscript_revisions
├── id (primary key)
├── original_manuscript_id (foreign key → manuscripts)
├── revision_number
├── submitted_at
├── response_to_reviewers (text)
├── changes_summary (text)
├── resubmitted_by (foreign key → users)
├── timestamps
```

**Notifications Table:**
```
notifications
├── id (primary key, UUID)
├── type
├── notifiable_type
├── notifiable_id
├── data (JSON)
├── read_at (nullable)
├── created_at
```

**Entity Relationship Summary:**
- User has many Manuscripts (as author)
- User has many Manuscripts (as editor, assigned)
- User has many Reviews (as reviewer)
- Manuscript belongs to many Users (authors) through manuscript_authors
- Manuscript has many Reviews
- Manuscript has many Editorial Decisions
- Manuscript has many Manuscript Files
- Manuscript belongs to Issue (nullable)
- Review belongs to Manuscript
- Review belongs to User (reviewer)
- Editorial Decision belongs to Manuscript
- Editorial Decision belongs to User (editor)
- Issue has many Manuscripts
- User has many Roles (through model_has_roles)
- Role has many Permissions (through role_has_permissions)

---

**Document Version**: 1.1  
**Last Updated**: January 11, 2025  
**Document Owner**: Product Management Team  
**Approved By**: Chief Technology Officer & Product Management Team  
**Next Review Date**: April 11, 2025  
**Distribution**: Internal - Development Team, Stakeholders, Executive Leadership  
**Related Documents**: USER_WORKFLOWS.md, MANUSCRIPT_STATUSES.md, roles.md