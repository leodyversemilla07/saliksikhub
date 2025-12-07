# User Roles - Saliksikhub Research Journal Management System

This document outlines the user roles, access levels, and key functions in the Saliksikhub system.

---

## Role Hierarchy

1. **Managing Editor** - Full system access and administration
2. **Editor-in-Chief (EIC)** - Full editorial access and oversight
3. **Associate Editor** - Limited editorial access for assigned manuscripts
4. **Language Editor** - Specialized production role for copyediting
5. **Reviewer** - Task-specific access for manuscript review
6. **Author** - Limited access for submission and revision

---

## **Managing Editor**

**Access Level**: Full access/permissions (highest level)

**Primary Responsibilities**:
- Overall system administration and configuration
- Journal-wide workflow oversight and optimization
- User management and role assignments
- Reviewer database management
- Performance analytics and reporting

**Key Functions**:
- Access comprehensive dashboard with all statistics/metrics
- View all manuscript submissions across all statuses and workflow stages
- Perform initial manuscript screening (desk review)
- Assign manuscripts to Editors-in-Chief or Associate Editors
- Monitor editor and reviewer performance
- Manage editorial board composition
- Configure journal settings, email templates, and workflows
- Generate and export reports (editorial activity, submission trends, financial)
- Handle system-wide communications and announcements
- Manage special cases (appeals, ethical issues, retractions)

**Access Permissions**:
- Full CRUD operations on all manuscripts
- Full access to reviewer database
- System configuration and settings management
- All analytics and reporting tools
- User role management

**Typical Workflow**: See USER_WORKFLOWS.md - Managing Editor section

---

## **Editor-in-Chief (EIC)**

**Access Level**: Full editorial access (highest editorial authority)

**Primary Responsibilities**:
- Final editorial decision authority on all manuscripts
- Strategic journal direction and policy development
- Editorial board management and oversight
- Quality control and standards enforcement
- Ethical oversight and appeals management

**Key Functions**:
- Access editorial dashboard with high-level metrics and priority items
- View all manuscript submissions and their complete history
- Review and approve/override Associate Editor recommendations
- Make final publication decisions (accept, reject, revise)
- Handle manuscript appeals and disputes
- Assign manuscripts to Associate Editors
- Review high-profile or complex submissions
- Manage special issues and invited submissions
- Oversee production process for accepted manuscripts
- Conduct ethical investigations (plagiarism, data integrity)
- Approve retractions and corrections
- Manage Associate Editor performance and mentoring
- Develop and update editorial policies and author guidelines

**Access Permissions**:
- Full read access to all manuscripts
- Editorial decision authority (can override any decision)
- Access to all reviews and decision history
- Editorial board management
- Appeals and ethics workflow access
- Production oversight access

**Decision Authority**:
- Accept (proceed to production)
- Conditional Accept (minor corrections before production)
- Minor Revision (30-day deadline)
- Major Revision (60-90 day deadline)
- Reject (after peer review)
- Desk Reject (without peer review)

**Typical Workflow**: See USER_WORKFLOWS.md - Editor-in-Chief section

---

## **Associate Editor**

**Access Level**: Limited editorial access (assigned manuscripts only)

**Primary Responsibilities**:
- Manage assigned manuscripts through peer review process
- Select and invite peer reviewers
- Coordinate review process and track progress
- Make editorial recommendations based on reviews
- Communicate with authors regarding decisions and revisions

**Key Functions**:
- Access dashboard showing assigned manuscripts by status
- Accept or decline manuscript assignments
- Search and select appropriate reviewers from database
- Send reviewer invitations and manage responses
- Monitor review progress and send reminders
- Read and evaluate reviewer reports
- Make editorial recommendations (accept, revise, reject)
- Compose decision letters incorporating reviewer feedback
- Track manuscript revisions through multiple rounds (typically 3-4 max)
- Verify author responses to reviewer comments
- Decide on re-review strategy for revisions
- Log all editorial communications
- Rate reviewer performance and quality

**Access Permissions**:
- Full read/write access to assigned manuscripts only
- Access to reviewer database (search and invite)
- Can create and send decision letters
- Can track revisions and re-reviews
- Performance metrics for assigned manuscripts

**Decision Options**:
- Accept (recommend to EIC)
- Conditional Accept (minor corrections, no re-review)
- Minor Revision (30-day deadline, may not require re-review)
- Major Revision (60-90 day deadline, typically requires re-review)
- Reject (recommend to EIC)

**Workload**: Typically manages 10-20 active manuscripts concurrently

**Typical Workflow**: See USER_WORKFLOWS.md - Associate Editor section

---

## **Language Editor**

**Access Level**: Limited production access (specialized copyediting role)

**Primary Responsibilities**:
- Perform copyediting on accepted manuscripts
- Ensure language clarity, grammar, and style consistency
- Apply journal style guidelines and formatting standards
- Manage author queries and corrections
- Prepare manuscripts for typesetting

**Key Functions**:
- Access manuscripts assigned for copyediting (status: in_copyediting)
- Download and review accepted manuscripts
- Edit for grammar, spelling, clarity, and style
- Ensure consistency in terminology, abbreviations, and formatting
- Verify and format citations and references
- Check figures, tables, equations, and captions
- Create author queries for unclear or inconsistent content
- Use track changes to document all edits
- Submit edited manuscripts with query list to authors
- Review author responses to queries
- Finalize manuscripts for typesetting stage
- Provide support during proofing if requested

**Access Permissions**:
- Read/write access to manuscripts in copyediting stage
- Can create and manage author queries
- Can upload edited versions and track changes
- Access to journal style guides and templates
- Limited to production workflow only

**Deliverables**:
- Tracked-changes manuscript version
- Clean final manuscript version
- Author query list with responses
- Style sheet for complex manuscripts

**Typical Timeline**: 7-14 days per manuscript assignment

**Typical Workflow**: See USER_WORKFLOWS.md - Language Editor section

---

## **Reviewer**

**Access Level**: Task-specific access (assigned reviews only)

**Primary Responsibilities**:
- Evaluate manuscript quality, originality, and methodological rigor
- Provide constructive feedback to authors
- Make recommendation to editors
- Maintain confidentiality and ethical standards

**Key Functions**:
- Receive and respond to review invitations
- Access assigned manuscripts anonymously (blind review)
- Download manuscript files and supplementary materials
- Complete structured review forms with ratings:
  - Originality rating (1-10)
  - Methodological rigor rating (1-10)
  - Significance of findings rating (1-10)
  - Quality of writing rating (1-10)
  - Interest to readership rating (1-10)
- Provide confidential comments to editor
- Provide constructive comments to authors
- Upload annotated manuscript (optional)
- Make recommendation: Accept, Minor Revision, Major Revision, or Reject
- Conduct re-review of revised manuscripts if invited
- Track personal review history and performance metrics

**Access Permissions**:
- Read-only access to assigned manuscripts (anonymized)
- Can submit review reports and recommendations
- Access to personal review history and statistics
- Can update profile and expertise keywords
- Can set availability and review capacity

**Review Timeline**: Typically 2-4 weeks per review assignment

**Performance Metrics**:
- Review completion rate
- Average review time
- Review quality ratings (from editors)
- Invitation acceptance rate
- Number of completed reviews

**Recognition & Benefits**:
- Annual reviewer certificates
- Thank-you letters from EIC
- Fee waivers for own submissions (varies by journal)
- Potential invitation to join editorial board
- Professional development opportunities

**Typical Workflow**: See USER_WORKFLOWS.md - Reviewer section

---

## **Author**

**Access Level**: Limited access (own submissions only)

**Primary Responsibilities**:
- Submit manuscripts for publication consideration
- Respond to peer review feedback
- Submit revisions within deadlines
- Approve final manuscript versions for publication

**Key Functions**:
- Register and create profile with ORCID integration
- Submit new manuscripts through multi-step wizard:
  - Select manuscript type (original research, review article, short communication, case study, letter to editor, editorial)
  - Upload main manuscript file (PDF, Word, LaTeX - max 100MB)
  - Upload required documents:
    - Cover Letter
    - Unidentifiable Manuscript (for double-blind review)
    - Figures and tables
    - Questionnaire and attachments
    - Ethics Clearance
    - Supplementary materials
  - Enter metadata (title, abstract up to 500 words, keywords)
  - Add co-authors with ORCID IDs and contribution roles
  - Complete compliance checklist (ethics, data availability, funding, conflicts)
  - Suggest preferred reviewers and list opposed reviewers
- Track manuscript status in real-time through dashboard
- Receive automated email notifications for status changes
- View and download reviewer comments and decision letters
- Submit revisions with point-by-point response letter
- Upload tracked-changes version for revisions
- Respond to copyeditor queries during production
- Review and approve formatted proofs
- Monitor article metrics post-publication (downloads, citations, Altmetrics)

**Access Permissions**:
- Full read/write access to own manuscripts (draft and submitted)
- Can submit new manuscripts
- Can submit revisions (typically 3-4 rounds maximum)
- Can withdraw manuscripts before publication
- Read-only access to published articles
- Access to own submission history and statistics

**Required Documents**:
1. Main manuscript file
2. Cover letter
3. Unidentifiable manuscript (for blind review)
4. Ethics clearance (if applicable)
5. Figures and tables
6. Supplementary materials (optional)

**Submission Checklist**:
- Ethics approval (if human/animal subjects)
- Data availability statement
- Funding disclosure
- Conflict of interest declaration
- Copyright/licensing agreement

**Typical Timelines**:
- Submission process: ~15 minutes
- Minor revision deadline: 30 days
- Major revision deadline: 60-90 days
- Copyedit review: 7-10 days
- Proof approval: 3-7 days

**Typical Workflow**: See USER_WORKFLOWS.md - Author section

---

## Role-Based Dashboard Features

### Managing Editor Dashboard
- Comprehensive analytics (submission trends, processing times, acceptance rates)
- All submissions queue with advanced filtering
- Editor workload distribution visualization
- Reviewer pool database with performance metrics
- System health monitoring
- Quick actions for common tasks
- Custom report builder

### Editor-in-Chief Dashboard
- Strategic metrics (journal performance, impact statistics)
- Priority queue (manuscripts requiring EIC attention)
- Editorial team performance overview
- Appeals and ethics case management
- Production pipeline status
- Impact metrics (citations, downloads, Altmetrics)
- Editorial board management tools

### Associate Editor Dashboard
- My manuscripts by status
- Action required items (pending decisions, overdue reviews)
- Reviewer search and management
- Personal performance metrics
- Decision letter templates
- Timeline view for manuscript progression
- Communication hub

### Language Editor Dashboard
- Active copyediting assignments
- Assignment queue with deadlines
- Completed work history
- Style resources and guides
- Query templates library
- Personal performance statistics
- Deadline calendar

### Reviewer Dashboard
- Active review assignments with deadlines
- Review history and completed reviews
- Personal performance metrics
- Availability settings and vacation periods
- Expertise profile management
- Downloadable reviewer certificates
- Pending review invitations

### Author Dashboard
- Active submissions with status tracking
- Published articles list
- Real-time notifications
- Message inbox for editorial communications
- Profile and preferences management
- Article-level metrics and statistics

---

## Permission Matrix

| Function | Managing Editor | EIC | Associate Editor | Language Editor | Reviewer | Author |
|----------|----------------|-----|------------------|----------------|----------|--------|
| Submit manuscript | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View all manuscripts | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Desk review/screening | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Assign to editors | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Select reviewers | ✓ | ✓ | ✓* | ✗ | ✗ | ✗ |
| Make editorial decision | ✓ | ✓ | ✓** | ✗ | ✗ | ✗ |
| Copyedit manuscripts | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Review manuscripts | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Submit revisions | ✗ | ✗ | ✗ | ✗ | ✗ | ✓*** |
| System administration | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Manage reviewer database | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Generate reports | ✓ | ✓ | ✓**** | ✗ | ✗ | ✗ |

\* For assigned manuscripts only  
\*\* Recommendations subject to EIC approval  
\*\*\* For own manuscripts only  
\*\*\*\* Limited to assigned manuscripts

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Related Documents**: 
- USER_WORKFLOWS.md - Detailed workflow for each role
- PRD.md - Product Requirements Document

**System**: Saliksikhub Research Journal Management System  
**License**: MIT License - Open Source
