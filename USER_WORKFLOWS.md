# User Workflows - Research Journal Management System

This document outlines the detailed workflows for each user role in the Research Journal Management System.

---

## Table of Contents
1. [Author Workflow](#author-workflow)
2. [Managing Editor Workflow](#managing-editor-workflow)
3. [Editor-in-Chief (EIC) Workflow](#editor-in-chief-eic-workflow)
4. [Associate Editor Workflow](#associate-editor-workflow)
5. [Reviewer Workflow](#reviewer-workflow)
6. [Language Editor Workflow](#language-editor-workflow)

---

## Author Workflow

### Overview
Authors submit manuscripts, respond to reviews, submit revisions, and track their submission through the publication process.

### Step-by-Step Workflow

#### 1. Initial Manuscript Submission
**Duration:** ~15 minutes

1. **Account Setup**
   - Register with email verification
   - Complete profile with ORCID integration
   - Upload CV
   - Set preferences and notifications

2. **Start New Submission**
   - Access submission wizard
   - Select manuscript type (original research, review article, short communication, case study, letter to editor, editorial)
   - Choose journal (if multi-journal system)

3. **Upload Files** (Max 100MB per submission)
   - Upload main manuscript (PDF, Word, LaTeX)
   - Upload cover letter (required)
   - Upload unidentifiable manuscript for blind review
   - Upload figures and tables
   - Upload questionnaire and attachments
   - Upload ethics clearance
   - Add supplementary materials (optional)
   - System auto-saves every 2 minutes

4. **Enter Metadata**
   - Title (automatic extraction from file)
   - Abstract (max 500 words)
   - Keywords and subject area classification
   - Add co-authors with:
     - Names, emails, affiliations
     - ORCID IDs
     - Contribution roles
     - Corresponding author designation

5. **Compliance & Declarations**
   - Complete submission checklist:
     - Ethics approval (if applicable)
     - Data availability statement
     - Funding disclosure
     - Conflict of interest declaration
   - Suggest preferred reviewers (with expertise and contact)
   - List opposed reviewers (with reasons)

6. **Review & Submit**
   - Review all entered information
   - Accept terms and conditions
   - Sign copyright/licensing agreements
   - Submit manuscript
   - Receive confirmation email with manuscript ID

**Status:** `submitted` → `under_screening`

---

#### 2. Post-Submission Tracking

1. **Dashboard Monitoring**
   - View manuscript status in real-time
   - Check current workflow stage
   - See assigned editors/reviewers (when applicable)
   - Review timeline and deadlines

2. **Communication**
   - Receive automated email notifications for status changes
   - Respond to editor queries via system messaging
   - View all communication logs

**Possible Outcomes:**
- **Desk Rejected:** `desk_rejected` - Receive rejection letter, option to appeal
- **Proceeding to Review:** `awaiting_reviewer_selection` → `under_review`

---

#### 3. Responding to Review Decision

**Scenario A: Revision Required**

**Status:** `minor_revision_required` or `major_revision_required`

1. **Receive Decision Letter**
   - Access decision letter with reviewer comments
   - Download annotated manuscripts from reviewers
   - Review specific revision requests
   - Note deadline (30 days for minor, 60-90 days for major)

2. **Prepare Revision**
   - Make requested changes to manuscript
   - Prepare point-by-point response letter
   - Create tracked-changes version
   - Update supplementary materials if needed
   - Prepare rebuttal if disagreeing with reviewer comments

3. **Submit Revision**
   - Upload revised manuscript
   - Upload response to reviewers (point-by-point)
   - Upload tracked-changes document
   - Summarize major changes
   - Submit revision before deadline
   - Receive automated reminders if approaching deadline

**Status:** `revision_submitted` → `in_review` (re-review)

**Note:** Authors can typically submit 3-4 rounds of revisions

---

**Scenario B: Conditional Acceptance**

**Status:** `conditionally_accepted`

1. **Review Minor Corrections**
   - Address final minor editorial comments
   - Make formatting adjustments
   - Correct typos or references

2. **Submit Final Version**
   - Upload corrected manuscript
   - Confirm all changes completed

**Status:** `conditionally_accepted` → `in_production`

---

**Scenario C: Acceptance**

**Status:** `accepted`

1. **Receive Acceptance Letter**
   - Celebrate! 🎉
   - Sign publication agreement
   - Complete copyright transfer or licensing
   - Provide any additional required information

**Status:** `accepted` → `in_production`

---

**Scenario D: Rejection**

**Status:** `rejected`

1. **Review Rejection Letter**
   - Understand reasons for rejection
   - Consider appeal option (if available)
   - Consider submission to another journal

2. **Appeal (Optional)**
   - Submit formal appeal with justification
   - Provide additional data/evidence if applicable
   - Wait for appeal decision

---

#### 4. Production Process

**Status:** `in_production` → `in_copyediting` → `in_typesetting` → `in_proofreading`

1. **Copyediting Stage**
   - Review copyedited manuscript
   - Respond to author queries from copyeditor
   - Approve or suggest changes
   - Deadline: typically 7-10 days

2. **Typesetting/Formatting**
   - Review formatted proofs
   - Check figures, tables, equations
   - Verify references and citations
   - Submit corrections

3. **Proofreading**
   - Final review of proofs
   - Approve for publication
   - Verify author names, affiliations, funding

4. **Pre-publication**
   - Receive DOI assignment
   - Review final PDF
   - Approve for online publication

**Status:** `ready_for_publication`

---

#### 5. Publication

**Status:** `published`

1. **Post-Publication**
   - Receive publication notification
   - Share article via social media
   - Monitor article metrics:
     - Download statistics
     - Citation tracking
     - Altmetric scores
     - Social media mentions
   - Respond to reader comments (if enabled)
   - Order reprints (if available)

2. **Post-Publication Corrections**
   - Submit correction requests if errors found
   - Follow correction/erratum process

---

### Author Dashboard Features
- **Active Submissions:** View all manuscripts in progress
- **Published Articles:** Access all published work
- **Notifications:** Receive real-time updates
- **Messages:** Communicate with editorial team
- **Profile:** Update information and preferences
- **Metrics:** View article-level statistics

---

## Managing Editor Workflow

### Overview
Managing editors have full system access and oversee overall journal operations, system administration, and workflow management.

### Step-by-Step Workflow

#### 1. Dashboard & System Monitoring

1. **Daily Dashboard Review**
   - View comprehensive metrics:
     - Total submissions (current month, year-to-date)
     - Manuscripts by status
     - Average processing time by stage
     - Editor workload distribution
     - Reviewer performance metrics
     - Geographic submission distribution
   - Identify bottlenecks in workflow
   - Monitor system performance

2. **Submission Overview**
   - View all submissions across all statuses
   - Filter by:
     - Status
     - Date range
     - Editor assignment
     - Manuscript type
     - Subject area
   - Export lists for reporting

---

#### 2. Initial Manuscript Screening

**Status:** `submitted` → `under_screening`

1. **Review New Submissions**
   - Check submission completeness
   - Verify file integrity
   - Review plagiarism detection results
   - Assess scope fit with journal
   - Check formatting compliance

2. **Make Screening Decision**

   **Option A: Proceed to Review**
   - Assign to Editor-in-Chief or Associate Editor
   - Add internal notes
   - Set priority level
   **Status:** `awaiting_reviewer_selection`

   **Option B: Desk Rejection**
   - Compose rejection letter using templates
   - Specify reason (out of scope, poor quality, formatting)
   - Send decision to author
   **Status:** `desk_rejected`

   **Option C: Request Revisions Before Review**
   - Request formatting corrections
   - Ask for missing documents
   - Request scope clarification
   **Status:** `awaiting_revision`

---

#### 3. Editor Assignment & Workload Management

1. **Assign Manuscripts to Editors**
   - Use automatic assignment based on:
     - Subject area matching
     - Expertise alignment
     - Current workload balancing
   - Or manually assign based on:
     - Editor availability
     - Conflict of interest checks
     - Special expertise required

2. **Monitor Editor Performance**
   - Track assignment acceptance rate
   - Monitor time to decision
   - Review editor workload distribution
   - Identify overloaded editors
   - Reassign manuscripts when needed

3. **Handle Editor Declines**
   - Review decline reasons
   - Reassign to alternative editor
   - Update assignment algorithm if needed

---

#### 4. Workflow Oversight

1. **Monitor Manuscript Progress**
   - Track manuscripts exceeding timeline thresholds
   - Identify delayed reviews
   - Follow up with editors on stalled manuscripts
   - Send automated reminders:
     - To reviewers (approaching deadline)
     - To editors (pending decisions)
     - To authors (revision deadlines)

2. **Quality Assurance**
   - Review decision letters for quality
   - Ensure proper reviewer selection
   - Verify conflict of interest compliance
   - Monitor review quality and feedback

3. **Handle Special Cases**
   - Appeals and disputes
   - Ethical concerns
   - Plagiarism issues
   - Retractions or corrections
   - Fast-track requests

---

#### 5. Reviewer Database Management

1. **Reviewer Recruitment**
   - Identify potential reviewers
   - Send invitations to join reviewer pool
   - Process reviewer applications
   - Assign expertise keywords

2. **Reviewer Performance Tracking**
   - Monitor metrics:
     - Review completion rate
     - Average review time
     - Review quality ratings
     - Acceptance rate of invitations
   - Identify top performers
   - Flag underperforming reviewers
   - Update reviewer database

3. **Reviewer Recognition**
   - Generate reviewer certificates
   - Provide annual thank-you letters
   - Offer reviewer incentives (fee waivers, subscriptions)

---

#### 6. System Administration

1. **Journal Configuration**
   - Update journal profile:
     - Title, ISSN, scope
     - Author guidelines
     - Review criteria
   - Manage editorial board composition
   - Configure email templates
   - Set workflow parameters
   - Configure fee structures (if applicable)

2. **User Role Management**
   - Create and assign user roles
   - Manage permissions
   - Handle role delegation
   - Review activity logs for auditing

3. **Integration Management**
   - Configure ORCID integration
   - Set up plagiarism detection tools
   - Manage DOI assignment
   - Configure archiving services

---

#### 7. Analytics & Reporting

1. **Generate Reports**
   - Editorial board activity reports
   - Submission trends analysis
   - Acceptance/rejection rates
   - Processing time analytics
   - Reviewer database statistics
   - Financial reports (for paid submissions)
   - Impact metrics (citations, downloads)

2. **Schedule Automated Reports**
   - Weekly status reports
   - Monthly performance summaries
   - Quarterly board reports
   - Annual journal statistics

3. **Export Data**
   - Export reports (PDF, Excel, CSV)
   - Generate custom reports
   - Provide data for board meetings

---

#### 8. Communication Management

1. **Template Management**
   - Create and update email templates:
     - Submission confirmations
     - Desk rejection letters
     - Review invitations
     - Decision letters
     - Reminder messages

2. **Bulk Communications**
   - Send announcements to authors
   - Communicate with reviewer pool
   - Update editorial board

3. **Support & Queries**
   - Respond to user inquiries
   - Resolve technical issues
   - Coordinate with system administrators

---

### Managing Editor Dashboard Features
- **Comprehensive Analytics:** Real-time metrics and trends
- **Submission Queue:** All manuscripts by status
- **Editor Workload:** Visual workload distribution
- **Reviewer Pool:** Complete reviewer database
- **System Health:** Performance monitoring
- **Quick Actions:** Fast access to common tasks
- **Reports:** Customizable reporting tools

---

## Editor-in-Chief (EIC) Workflow

### Overview
The Editor-in-Chief provides editorial oversight, makes final publication decisions, and ensures journal quality and standards.

### Step-by-Step Workflow

#### 1. Dashboard & Strategic Oversight

1. **Daily Dashboard Review**
   - View high-level metrics:
     - Submission trends
     - Acceptance/rejection rates
     - Average time to decision
     - Journal impact metrics
   - Review manuscripts requiring EIC attention
   - Monitor editorial team performance

2. **Strategic Planning**
   - Review journal scope and direction
   - Identify emerging research areas
   - Plan special issues
   - Evaluate editorial policies

---

#### 2. Manuscript Review & Assignment

**Status:** `under_screening` → `awaiting_reviewer_selection`

1. **Review Screened Manuscripts**
   - Assess manuscripts flagged by Managing Editor
   - Review high-profile or complex submissions
   - Evaluate scope fit with journal mission

2. **Assign to Associate Editors**
   - Select appropriate Associate Editor based on:
     - Subject matter expertise
     - Current workload
     - Past performance
   - Add priority flags for urgent manuscripts
   - Include special instructions if needed

3. **Handle Special Submissions**
   - Fast-track important manuscripts
   - Manage invited submissions
   - Oversee special issue manuscripts
   - Review manuscripts from editorial board members

---

#### 3. Final Decision Authority

**Status:** Various → `accepted`, `rejected`, or `major_revision_required`

1. **Review Associate Editor Recommendations**
   - Read reviewer reports
   - Review Associate Editor's decision letter
   - Assess recommendation (accept, reject, revise)
   - Consider journal priorities and standards

2. **Make Final Decision**

   **Option A: Agree with Recommendation**
   - Approve decision
   - Add EIC comments if needed
   - Authorize decision letter

   **Option B: Override Recommendation**
   - Provide detailed justification
   - Revise decision letter
   - Communicate with Associate Editor
   - Document rationale in system

   **Option C: Request Additional Review**
   - Seek additional reviewer opinion
   - Request Associate Editor reconsideration
   - Assign to different Associate Editor

3. **Quality Control**
   - Ensure decision letters are well-written
   - Verify reviewer feedback is constructive
   - Confirm ethical standards are met

---

#### 4. Appeals Management

**Status:** `rejected` → Review Appeal

1. **Review Appeal Requests**
   - Read author's appeal letter
   - Review original reviews and decision
   - Assess merit of appeal

2. **Make Appeal Decision**
   - Uphold original decision (most common)
   - Request new review (if justified)
   - Overturn decision (rare)
   - Provide detailed response to author

---

#### 5. Ethical Oversight

1. **Handle Ethical Issues**
   - Investigate plagiarism reports
   - Review data integrity concerns
   - Manage conflict of interest issues
   - Coordinate with ethics committees
   - Follow COPE guidelines

2. **Retractions & Corrections**
   - Evaluate retraction requests
   - Approve corrections and errata
   - Coordinate post-publication changes
   - Ensure proper documentation

---

#### 6. Production Oversight

**Status:** `accepted` → `in_production` → `published`

1. **Review Accepted Manuscripts**
   - Final check before production
   - Ensure all requirements met
   - Approve for copyediting

2. **Monitor Production Process**
   - Oversee copyediting quality
   - Review formatted proofs (selective)
   - Approve final publication

3. **Publication Decisions**
   - Assign to volume/issue
   - Prioritize publication order
   - Approve online-first publication

---

#### 7. Editorial Board Management

1. **Board Composition**
   - Recruit new editorial board members
   - Review board performance
   - Manage term renewals
   - Handle resignations

2. **Associate Editor Management**
   - Monitor performance metrics
   - Provide feedback and mentoring
   - Conduct annual reviews
   - Handle performance issues

3. **Board Communications**
   - Conduct editorial board meetings
   - Share journal updates
   - Solicit input on policies
   - Coordinate special initiatives

---

#### 8. Journal Development

1. **Special Issues**
   - Plan special issue topics
   - Appoint guest editors
   - Oversee special issue process
   - Ensure quality standards

2. **Policy Development**
   - Review and update:
     - Author guidelines
     - Review criteria
     - Ethical policies
     - Open access policies
   - Implement best practices

3. **Impact & Visibility**
   - Monitor journal metrics:
     - Citation counts
     - Impact factor (if applicable)
     - Download statistics
     - Altmetric scores
   - Plan promotion strategies
   - Engage with research community

---

### Editor-in-Chief Dashboard Features
- **Strategic Metrics:** High-level journal performance
- **Priority Queue:** Manuscripts requiring EIC attention
- **Editorial Team:** Associate Editor performance
- **Appeals & Ethics:** Special case management
- **Production Pipeline:** Accepted manuscripts status
- **Impact Metrics:** Journal-level statistics
- **Board Management:** Editorial board overview

---

## Associate Editor Workflow

### Overview
Associate Editors manage assigned manuscripts, coordinate peer review, and make editorial recommendations.

### Step-by-Step Workflow

#### 1. Manuscript Assignment

**Status:** Receives assignment at `awaiting_reviewer_selection`

1. **Receive Assignment Notification**
   - Email notification of new assignment
   - View manuscript details in dashboard
   - Check EIC/Managing Editor notes

2. **Review Assignment**
   - Download and read manuscript
   - Check co-authors for conflicts of interest
   - Assess subject matter fit with expertise
   - Review priority level

3. **Accept or Decline**

   **Option A: Accept Assignment**
   - Confirm acceptance in system
   - Begin reviewer selection
   **Status:** Remains `awaiting_reviewer_selection`

   **Option B: Decline Assignment**
   - Select decline reason:
     - Conflict of interest
     - Outside expertise area
     - Insufficient time
     - Other (specify)
   - Submit decline request
   - Manuscript reassigned by Managing Editor/EIC

---

#### 2. Reviewer Selection

**Status:** `awaiting_reviewer_selection` → `awaiting_reviewer_assignment`

1. **Identify Potential Reviewers**
   - Search reviewer database by:
     - Expertise keywords matching manuscript
     - Geographic diversity
     - Previous review quality
     - Recent review workload
   - Consider author suggestions (but verify independence)
   - Avoid opposed reviewers
   - Target: 2-3 reviewers minimum

2. **Check Reviewer Suitability**
   - Verify expertise match
   - Check for conflicts of interest:
     - Co-authorship history
     - Institutional affiliation
     - Personal relationships
     - Financial interests
   - Review past performance metrics:
     - Average review time
     - Review quality ratings
     - Acceptance rate

3. **Send Reviewer Invitations**
   - Customize invitation message
   - Include manuscript abstract
   - Specify review deadline (typically 2-4 weeks)
   - Attach review criteria/guidelines
   - Send invitation via system

**Status:** `awaiting_reviewer_assignment` → `in_review` (once reviewers accept)

---

#### 3. Managing Peer Review

**Status:** `in_review`

1. **Monitor Reviewer Responses**
   - Track invitation acceptance/decline
   - If declined, invite replacement reviewers
   - Ensure minimum reviewer count (typically 2-3)
   - Send reminder emails as deadline approaches

2. **Track Review Progress**
   - Monitor review submission status
   - View completed reviews as they arrive
   - Check review quality:
     - Substantive feedback
     - Constructive comments
     - Clear recommendation
   - Request additional detail if needed

3. **Handle Review Delays**
   - Send automated reminders (7 days before deadline)
   - Send manual reminders for late reviews
   - Consider deadline extensions (short)
   - Find replacement reviewers if necessary
   - Cancel review requests if unresponsive

4. **Receive and Review Reports**
   - Read all reviewer reports thoroughly
   - Assess review quality
   - Note conflicting opinions
   - Identify key concerns and themes
   - Download annotated manuscripts from reviewers

---

#### 4. Editorial Decision Making

**Status:** `in_review` → Decision

1. **Analyze Review Feedback**
   - Compare reviewer recommendations:
     - Accept: 0-10% of submissions
     - Minor revision: 15-20%
     - Major revision: 30-40%
     - Reject: 40-50%
   - Weigh reviewer expertise and thoroughness
   - Consider manuscript contribution
   - Assess feasibility of requested revisions

2. **Make Decision**

   **Option A: Accept**
   - Manuscript meets publication standards
   - Minor or no revisions needed
   - Compose acceptance letter
   **Status:** `accepted`

   **Option B: Minor Revision Required**
   - Addressable issues with limited changes
   - Revisions can be verified without re-review
   - Deadline: typically 30 days
   **Status:** `minor_revision_required`

   **Option C: Major Revision Required**
   - Substantial changes needed
   - Additional analysis or data required
   - May require re-review
   - Deadline: typically 60-90 days
   **Status:** `major_revision_required`

   **Option D: Reject**
   - Fundamental flaws
   - Out of scope
   - Insufficient contribution
   - Compose rejection letter
   **Status:** `rejected`

   **Option E: Conditional Acceptance**
   - Very minor corrections needed
   - No re-review required
   - Can proceed to production after corrections
   **Status:** `conditionally_accepted`

3. **Compose Decision Letter**
   - Use decision letter template
   - Include sections:
     - Editorial decision summary
     - Synthesis of reviewer comments
     - Specific revision requirements
     - Deadline for resubmission
     - Next steps
   - Incorporate reviewer feedback:
     - Copy relevant reviewer comments
     - Anonymize reviewer identities (Reviewer 1, 2, 3)
     - Remove inappropriate comments
     - Add editorial guidance
   - Review and edit for clarity
   - Proofread before sending

4. **Submit Decision for EIC Approval**
   - Attach decision letter
   - Include recommendation
   - Add internal notes if needed
   - EIC reviews and approves/modifies
   - System sends decision to author

---

#### 5. Managing Revisions

**Status:** `revision_submitted` → Re-review

1. **Receive Revision Submission**
   - Review author's response letter
   - Check tracked-changes document
   - Assess completeness of revisions
   - Read updated manuscript

2. **Decide on Re-review Strategy**

   **Option A: Editor Review Only** (for minor revisions)
   - Verify all changes made
   - Check adequacy of responses
   - Make final decision
   **Status:** `accepted` or `conditionally_accepted`

   **Option B: Send to Original Reviewers** (for major revisions)
   - Request re-review from original reviewers
   - Provide author's response letter
   - Set deadline (typically shorter: 2-3 weeks)
   **Status:** `in_review`

   **Option C: Seek New Reviewers**
   - If original reviewers unavailable
   - Follow reviewer selection process
   **Status:** `in_review`

3. **Track Revision Rounds**
   - Monitor number of revision cycles (typically max 3-4)
   - Assess improvement trajectory
   - Decide when to accept or reject after multiple rounds

---

#### 6. Post-Decision Activities

1. **Communication Logging**
   - Log all author communications in system
   - Record phone calls or email discussions
   - Document decisions and rationale
   - Maintain audit trail

2. **Track Manuscript Through Production**
   - Monitor accepted manuscripts in production
   - Respond to production queries
   - Review final proofs (if requested)
   - Approve for publication

3. **Reviewer Feedback & Recognition**
   - Thank reviewers upon completion
   - Rate review quality in system
   - Provide feedback to reviewers (if appropriate)
   - Nominate excellent reviewers for recognition

---

#### 7. Workload Management

1. **Manage Active Manuscripts**
   - View all assigned manuscripts in dashboard
   - Prioritize based on:
     - Deadlines
     - Manuscript age
     - Priority flags from EIC
   - Balance 10-20 active manuscripts typically

2. **Set Availability**
   - Update availability status
   - Block out vacation/sabbatical periods
   - Adjust assignment preferences
   - Communicate schedule to Managing Editor

---

### Associate Editor Dashboard Features
- **My Manuscripts:** All assigned submissions by status
- **Action Required:** Items needing immediate attention
- **Reviewer Pool:** Search and manage reviewers
- **Performance Metrics:** Personal statistics
- **Decision Templates:** Quick access to letter templates
- **Timeline View:** Manuscript progression tracking
- **Communication Hub:** Author and reviewer messages

---

## Reviewer Workflow

### Overview
Reviewers evaluate manuscripts, provide constructive feedback, and make recommendations to editors.

### Step-by-Step Workflow

#### 1. Reviewer Recruitment & Registration

1. **Join Reviewer Database**

   **Option A: Invited by Editor**
   - Receive invitation email
   - Click registration link
   - Create account

   **Option B: Self-Registration**
   - Navigate to reviewer registration
   - Create account with email verification
   - Complete profile

2. **Complete Reviewer Profile**
   - Enter personal information
   - Add ORCID ID
   - Specify expertise keywords (minimum 5-10)
   - Select subject areas
   - Indicate preferred manuscript types
   - Set availability and workload preferences
   - Upload CV (optional)
   - Specify review language proficiency

3. **Account Verification**
   - Confirm email address
   - Agree to reviewer guidelines
   - Acknowledge confidentiality requirements
   - Set notification preferences

---

#### 2. Receiving Review Invitation

**Status:** Invited to review

1. **Review Invitation Email**
   - Receive automated invitation
   - View manuscript title and abstract
   - See review deadline (typically 2-4 weeks)
   - Note editor and journal information

2. **Assess Suitability**
   - Check expertise match
   - Verify no conflicts of interest:
     - Personal relationships with authors
     - Recent co-authorship
     - Institutional affiliation
     - Financial interests
     - Other competing interests
   - Consider current workload
   - Review deadline feasibility

3. **Respond to Invitation**

   **Option A: Accept Review**
   - Click accept in email or system
   - Confirm availability
   - Acknowledge deadline
   - Gain access to full manuscript
   **Status:** Active reviewer

   **Option B: Decline Review**
   - Select decline reason:
     - Conflict of interest
     - Outside expertise
     - Insufficient time
     - Other (specify)
   - Suggest alternative reviewers (optional)
   - Submit decline response
   - Replacement reviewer invited

---

#### 3. Conducting Manuscript Review

**Status:** Review in progress

1. **Access Manuscript Materials**
   - Download manuscript PDF
   - Download supplementary materials
   - Access figures, tables, datasets
   - Review author guidelines and review criteria
   - Note journal's focus and standards

2. **Preliminary Review** (1-2 hours)
   - Skim entire manuscript
   - Assess overall structure
   - Identify major strengths/weaknesses
   - Check scope fit with journal
   - Verify ethical compliance:
     - Ethics approval (if human/animal subjects)
     - Data availability
     - Proper citations
     - No obvious plagiarism

3. **Detailed Review** (4-8 hours typically)

   **Introduction & Background**
   - Clear research question/hypothesis?
   - Adequate literature review?
   - Proper context and significance?
   - Novelty clearly stated?

   **Methods**
   - Appropriate study design?
   - Sufficient methodological detail?
   - Reproducibility possible?
   - Statistical methods appropriate?
   - Ethical considerations addressed?

   **Results**
   - Data presentation clear?
   - Figures/tables effective?
   - Statistical analysis correct?
   - Results support conclusions?
   - Any missing data or analyses?

   **Discussion**
   - Interpretation appropriate?
   - Limitations acknowledged?
   - Comparison with existing literature?
   - Implications clearly stated?
   - Conclusions justified?

   **Overall Quality**
   - Writing clarity and grammar
   - Logical flow and organization
   - Citation accuracy and completeness
   - Adherence to reporting guidelines
   - Originality and contribution

4. **Take Detailed Notes**
   - Major concerns (deal-breakers)
   - Moderate issues (addressable)
   - Minor comments (suggestions)
   - Positive aspects (strengths)
   - Questions for authors
   - Suggested additional analyses

---

#### 4. Preparing Review Report

1. **Complete Review Form**

   **Section A: Confidential Comments to Editor**
   - Overall assessment
   - Recommendation with justification:
     - **Accept:** Publishable as-is or with minor edits (rare: <5%)
     - **Minor Revision:** Small, addressable issues (~15-20%)
     - **Major Revision:** Substantial changes needed (~30-40%)
     - **Reject:** Fundamental flaws or out of scope (~40-50%)
   - Concerns about ethics, plagiarism, data integrity
   - Priority level recommendation
   - Reviewer confidence level in assessment

   **Section B: Comments to Author**
   - **Summary:** Overall evaluation (2-3 paragraphs)
     - Main contributions
     - Major strengths
     - Key concerns
     - Overall recommendation

   - **Major Comments:** Numbered list
     - Critical issues affecting publication
     - Methodological concerns
     - Interpretation problems
     - Missing information or analyses
     - Each with specific references to line numbers/sections

   - **Minor Comments:** Numbered list
     - Clarity improvements
     - Grammar/writing suggestions
     - Figure/table improvements
     - Citation additions
     - Organizational suggestions

   - **Specific Line-by-Line Comments:** (optional)
     - Format: "Line 45: Clarify the meaning of..."
     - Format: "Table 2: Include confidence intervals"

2. **Upload Annotated Manuscript** (optional but recommended)
   - Mark up PDF with detailed comments
   - Highlight specific passages
   - Add margin notes
   - Upload to system

3. **Quality Check Review**
   - Ensure comments are:
     - Constructive and respectful
     - Specific and actionable
     - Evidence-based
     - Free of personal attacks
   - Remove any identifying information
   - Check tone is professional
   - Verify all major concerns addressed

---

#### 5. Submitting Review

1. **Complete Required Fields**
   - Overall recommendation
   - Originality rating
   - Methodological rigor rating
   - Significance of findings rating
   - Quality of writing rating
   - Interest to readership rating

2. **Final Review**
   - Re-read all comments
   - Check for completeness
   - Ensure consistency between ratings and comments
   - Verify recommendation aligns with comments

3. **Submit Review**
   - Click submit button
   - Confirm submission
   - Receive confirmation email
   - Review recorded in reviewer performance metrics

**Status:** Review completed

---

#### 6. Post-Review Activities

1. **After Editorial Decision**
   - Receive notification of decision (optional setting)
   - View editor's decision and synthesis
   - See how review influenced outcome
   - Learn from editorial process

2. **Revised Manuscript Re-Review**
   - Receive re-review invitation if major revision
   - Review author's response to comments
   - Assess adequacy of revisions
   - Check tracked changes
   - Provide additional feedback
   - Make new recommendation (typically 1-2 weeks)

3. **Performance Tracking**
   - Review completion logged in system
   - Metrics updated:
     - Review completion rate
     - Average review time
     - Review quality ratings (from editors)
     - Acceptance rate of invitations
   - Build reviewer reputation

---

#### 7. Recognition & Incentives

1. **Reviewer Certificates**
   - Receive annual reviewer certificate
   - Download for CV/promotion materials
   - Includes number of reviews and journal name

2. **Reviewer Benefits** (varies by journal)
   - Thank-you letters from EIC
   - Fee waivers for own submissions
   - Complimentary journal subscriptions
   - Recognition in journal's annual report
   - Invitation to join editorial board
   - Professional development opportunities

3. **Updating Profile**
   - Add completed reviews to profile
   - Update expertise keywords
   - Adjust availability
   - Set vacation/sabbatical periods

---

### Reviewer Dashboard Features
- **Active Reviews:** Current review assignments
- **Review History:** Completed reviews
- **Performance Metrics:** Personal statistics
- **Availability Settings:** Manage review capacity
- **Expertise Profile:** Update keywords and areas
- **Certificates:** Download reviewer certificates
- **Invitations:** Pending review requests

---

### Reviewer Best Practices

**Timing:**
- Accept reviews you can complete on time
- Notify editor immediately if unable to meet deadline
- Request extension early if needed (not at deadline)

**Quality:**
- Be thorough but constructive
- Focus on substance, not style (unless critical)
- Suggest solutions, not just problems
- Separate major from minor concerns
- Be specific with references to manuscript sections

**Ethics:**
- Maintain confidentiality
- Declare conflicts of interest
- Avoid bias (personal, geographic, institutional)
- Don't contact authors directly
- Don't use manuscript ideas before publication

**Professionalism:**
- Respectful and courteous tone
- Acknowledge limitations of your expertise
- Avoid dismissive or condescending language
- Recognize authors' effort
- Provide actionable feedback

---

## Language Editor Workflow

### Overview
Language Editors perform copyediting on accepted manuscripts during the production process, ensuring clarity, consistency, and adherence to style guidelines.

### Step-by-Step Workflow

#### 1. Assignment Reception

**Status:** `accepted` → `in_production` → `in_copyediting`

1. **Receive Copyediting Assignment**
   - Email notification of new assignment
   - Access manuscript in production queue
   - View manuscript details:
     - Article type
     - Target journal
     - Priority level
     - Deadline (typically 7-14 days)

2. **Review Assignment**
   - Download accepted manuscript
   - Review editorial decision letter
   - Note any special instructions from editors
   - Check author contact information

3. **Accept Assignment**
   - Confirm acceptance in system
   - Acknowledge deadline
   - Begin copyediting process

---

#### 2. Initial Assessment

1. **Read Manuscript Completely**
   - Skim entire manuscript first
   - Assess overall quality
   - Identify major issues:
     - Structural problems
     - Inconsistencies
     - Unclear sections
   - Estimate time required

2. **Verify Completeness**
   - All required sections present
   - Figures and tables included
   - References complete
   - Supplementary materials accessible
   - Author information complete

3. **Review Style Guidelines**
   - Journal-specific style guide
   - Citation format (APA, MLA, Chicago, etc.)
   - Abbreviation standards
   - Numbering conventions
   - Terminology preferences

---

#### 3. Copyediting Process

1. **Language & Grammar Editing**

   **Sentence Level:**
   - Correct grammar errors
   - Fix spelling mistakes
   - Improve sentence structure
   - Eliminate wordiness
   - Clarify ambiguous phrasing
   - Ensure subject-verb agreement
   - Fix tense consistency

   **Paragraph Level:**
   - Improve flow and transitions
   - Ensure logical progression
   - Enhance clarity
   - Maintain consistent voice
   - Check paragraph coherence

2. **Style & Consistency**

   **Formatting:**
   - Apply journal style consistently
   - Standardize headings/subheadings
   - Format lists uniformly
   - Apply proper capitalization
   - Use consistent spacing
   - Format numbers per style guide

   **Terminology:**
   - Ensure consistent use of terms
   - Create terminology list if needed
   - Standardize abbreviations
   - Define acronyms at first use
   - Check scientific nomenclature

   **Citations & References:**
   - Verify in-text citation format
   - Check reference list formatting
   - Match citations to references
   - Identify missing references
   - Check DOI/URL formatting
   - Verify author names and dates

3. **Technical Editing**

   **Figures & Tables:**
   - Check numbering sequence
   - Verify all figures/tables cited in text
   - Review caption completeness
   - Check internal consistency
   - Ensure high-quality images
   - Verify units and labels

   **Equations & Formulas:**
   - Check formatting
   - Verify symbol definitions
   - Ensure consistent notation
   - Check equation numbering

   **Abbreviations & Acronyms:**
   - Create abbreviation list
   - Verify first use definitions
   - Ensure consistent usage
   - Check against journal standards

4. **Structural Editing**

   **Organization:**
   - Verify section order
   - Check heading hierarchy
   - Ensure logical flow
   - Identify redundancies
   - Note missing information

   **Abstract:**
   - Check word count limit
   - Verify completeness (background, methods, results, conclusions)
   - Ensure standalone clarity
   - Check for abbreviations (avoid if possible)

---

#### 4. Author Queries

1. **Identify Issues Requiring Author Input**
   - Unclear statements
   - Inconsistent data
   - Missing information
   - Conflicting statements
   - Citation discrepancies
   - Figure/table questions

2. **Formulate Clear Queries**
   - Number queries sequentially (AQ1, AQ2, etc.)
   - Insert queries in manuscript margins
   - Be specific and clear:
     ✓ Good: "AQ1: Table 2 shows n=150, but text (line 45) states n=148. Please clarify."
     ✗ Poor: "AQ1: Check numbers."
   - Maintain professional tone
   - Provide context for each query

3. **Create Query List**
   - Compile all author queries
   - Organize by manuscript section
   - Include line/page references
   - Provide clear instructions
   - Set response deadline

---

#### 5. Quality Assurance

1. **Self-Review**
   - Re-read edited manuscript
   - Check all edits for accuracy
   - Ensure changes preserve meaning
   - Verify no over-editing
   - Check query clarity

2. **Consistency Check**
   - Run find-and-replace for common inconsistencies
   - Verify terminology consistency
   - Check abbreviation usage
   - Confirm citation format uniformity
   - Review numbering sequences

3. **Final Checks**
   - Spell check
   - Grammar check
   - Reference cross-check
   - Figure/table verification
   - Page number accuracy

---

#### 6. Submission & Author Communication

**Status:** `in_copyediting` → Author Review

1. **Prepare Edited Manuscript**
   - Use track changes for all edits
   - Insert author queries
   - Create clean version (optional)
   - Prepare style sheet (if significant edits)

2. **Submit to Production System**
   - Upload edited manuscript
   - Upload query list
   - Add internal notes for production team
   - Flag any major concerns
   - Update status in system

3. **Send to Author for Review**
   - System sends automated notification
   - Author receives:
     - Tracked-changes version
     - Query list
     - Review deadline (typically 7-10 days)
   - Instructions for responding

4. **Monitor Author Response**
   - Track author review status
   - Send reminders if deadline approaching
   - Answer author questions
   - Clarify queries if needed

---

#### 7. Incorporating Author Responses

**Status:** Author Review Complete → `in_typesetting`

1. **Review Author's Responses**
   - Check all queries answered
   - Verify author's corrections
   - Assess accept/reject edits
   - Note any new issues

2. **Finalize Manuscript**
   - Accept author's approved changes
   - Reject changes that violate style (with explanation)
   - Resolve remaining queries
   - Make final adjustments
   - Create final clean version

3. **Final Quality Check**
   - Complete read-through
   - Verify all queries resolved
   - Check no track changes remain (in final version)
   - Ensure consistent formatting

4. **Submit Final Version**
   - Upload final copyedited manuscript
   - Add completion notes
   - Flag any remaining concerns for typesetter
   - Mark assignment complete
   - Update production status

**Status:** `in_copyediting` → `in_typesetting`

---

#### 8. Post-Copyediting Support

1. **Respond to Production Queries**
   - Answer questions from typesetters
   - Clarify copyediting decisions
   - Provide additional guidance

2. **Proofing Support** (if requested)
   - Review formatted proofs
   - Check copyediting implementation
   - Verify no new errors introduced
   - Approve for publication

3. **Performance Tracking**
   - Assignment completion logged
   - Quality ratings from production team
   - Turnaround time tracked
   - Build copyeditor reputation

---

### Language Editor Dashboard Features
- **Active Assignments:** Current copyediting projects
- **Assignment Queue:** Upcoming manuscripts
- **Completed Work:** Finished assignments
- **Style Resources:** Quick access to style guides
- **Query Templates:** Common author query templates
- **Performance Metrics:** Personal statistics
- **Deadline Calendar:** Visual deadline tracking

---

### Language Editor Tools & Resources

**Reference Materials:**
- Journal-specific style guide
- Citation style manual (APA, MLA, Chicago, etc.)
- Scientific style guides (CSE, AMA, etc.)
- Grammar references
- Dictionary and thesaurus
- Subject-specific terminology resources

**Software Tools:**
- Track changes functionality
- Style checker tools
- Reference management integration
- Spell/grammar checkers
- Find and replace tools
- PDF markup tools

---

### Language Editor Best Practices

**Quality:**
- Preserve author's voice and meaning
- Don't over-edit or rewrite unnecessarily
- Focus on clarity and consistency
- Respect author's style choices (when appropriate)
- Maintain scientific accuracy

**Efficiency:**
- Create macros for common edits
- Use find-and-replace strategically
- Develop style sheets for complex manuscripts
- Prioritize substantive over cosmetic edits
- Work systematically (section by section)

**Communication:**
- Write clear, specific author queries
- Maintain professional, helpful tone
- Explain reasoning for major changes
- Be available for author questions
- Respond promptly to production team

**Ethics:**
- Maintain manuscript confidentiality
- Declare conflicts of interest
- Don't suggest your own citations
- Don't alter author's findings or conclusions
- Report suspected plagiarism or data issues

---

## Appendix: Quick Reference

### Manuscript Status Flow

```
submitted
  ↓
under_screening
  ↓
[desk_rejected] OR awaiting_reviewer_selection
  ↓
awaiting_reviewer_assignment
  ↓
in_review
  ↓
[rejected] OR [accepted] OR [minor_revision_required] OR [major_revision_required]
  ↓
(if revision) → revision_submitted → in_review (re-review)
  ↓
[accepted] OR [conditionally_accepted]
  ↓
in_production
  ↓
in_copyediting
  ↓
in_typesetting
  ↓
in_proofreading
  ↓
ready_for_publication
  ↓
published
```

### Typical Timelines

| Stage | Duration |
|-------|----------|
| Desk review/screening | 3-7 days |
| Reviewer selection | 3-7 days |
| Peer review | 2-4 weeks |
| Editorial decision | 1-2 weeks |
| Minor revision | 30 days |
| Major revision | 60-90 days |
| Re-review | 2-3 weeks |
| Copyediting | 7-14 days |
| Author review of copyedits | 7-10 days |
| Typesetting | 1-2 weeks |
| Proofreading | 3-7 days |
| **Total (submission to publication)** | **3-6 months** |

### Contact & Support

Each user role has access to:
- Email support (24-hour response)
- Knowledge base and FAQs
- Role-specific video tutorials
- User guides (downloadable PDFs)
- In-system messaging
- Help desk for technical issues

---

*Document Version: 1.0*  
*Last Updated: October 10, 2025*  
*System: Research Journal Management System*
