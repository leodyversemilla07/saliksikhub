# Manuscript Submission and Publication Workflow

This document outlines the complete workflow for manuscript submission, peer review, and publication in the journal management system.

## Workflow Diagram

```mermaid
graph TD
    Start([Author Prepares Manuscript]) --> A[Author Submits Manuscript]
    
    A --> B{Initial Administrative Check}
    B -->|Incomplete/Incorrect Format| C[Desk Reject - Return to Author]
    C --> D[Author Corrects Issues]
    D --> A
    B -->|Complete| E[Editor-in-Chief Screening]
    
    E --> F{Within Journal Scope?}
    F -->|No| G[Desk Reject - Suggest Alternative Journal]
    G --> End1([End - Consider Other Journals])
    F -->|Yes| H{Meets Quality Standards?}
    
    H -->|No| I[Desk Reject with Feedback]
    I --> End2([End - Major Revision Needed])
    H -->|Yes| J[Assign to Associate Editor]
    
    J --> K[Associate Editor Reviews]
    K --> L[Select Peer Reviewers]
    L --> M{Reviewers Accept?}
    
    M -->|Decline| N[Find Alternative Reviewers]
    N --> M
    M -->|Accept| O[Send Manuscript to Reviewers]
    
    O --> P[Reviewers Evaluate Manuscript]
    P --> Q[Reviewers Submit Reviews]
    
    Q --> R{Consensus Among Reviewers?}
    R -->|No - Conflicting| S[Editor Seeks Additional Reviewer]
    S --> O
    R -->|Yes| T[Associate Editor Makes Recommendation]
    
    T --> U[Editor-in-Chief Makes Decision]
    
    U --> V{Editorial Decision}
    
    V -->|Accept| W[Accepted - Move to Production]
    V -->|Minor Revisions| X[Author Revises Manuscript]
    V -->|Major Revisions| Y[Author Substantially Revises]
    V -->|Reject| Z[Rejection Letter Sent]
    
    Z --> End3([End - Submit to Another Journal])
    
    X --> AA[Author Resubmits with Response Letter]
    Y --> AB[Author Resubmits with Detailed Response]
    
    AA --> AC{Editor Reviews Changes}
    AB --> AD{Editor Reviews Changes}
    
    AC -->|Satisfied| W
    AC -->|Not Sufficient| AE[Additional Minor Revisions Requested]
    AE --> X
    
    AD -->|Satisfied| W
    AD -->|Not Sufficient| AF[Send to Reviewers Again]
    AF --> O
    
    W --> AG[Author Signs Copyright/License Agreement]
    AG --> AH[Copy Editing]
    
    AH --> AI[Author Reviews Edited Manuscript]
    AI --> AJ{Author Approves Edits?}
    
    AJ -->|No| AK[Author Requests Changes]
    AK --> AH
    AJ -->|Yes| AL[Typesetting/Formatting]
    
    AL --> AM[Generate Proofs]
    AM --> AN[Author Reviews Proofs]
    
    AN --> AO{Author Approves Proofs?}
    AO -->|No| AP[Author Submits Corrections]
    AP --> AQ[Corrections Made]
    AQ --> AM
    AO -->|Yes| AR[Final Production Approval]
    
    AR --> AS[Assign DOI]
    AS --> AT[Online First/Early View Publication]
    
    AT --> AU[Final Publication in Journal Issue]
    AU --> AV[Indexing in Databases]
    
    AV --> AW[Article Metrics Tracking Begins]
    AW --> AX([End - Article Published & Accessible])
```

## Workflow Stages

### 1. Submission Stage
- **Author Prepares Manuscript**: Initial preparation of research article
- **Author Submits Manuscript**: Formal submission to the journal
- **Initial Administrative Check**: Verification of formatting and completeness

### 2. Editorial Screening
- **Editor-in-Chief Screening**: Initial quality and scope assessment
- **Desk Rejection Points**: Early rejection for out-of-scope or low-quality submissions
- **Associate Editor Assignment**: Assignment to subject-matter expert

### 3. Peer Review Stage
- **Reviewer Selection**: Associate editor identifies qualified reviewers
- **Peer Review Process**: Expert evaluation of the manuscript
- **Review Consolidation**: Editor synthesizes reviewer feedback

### 4. Editorial Decision
- **Accept**: Manuscript accepted without changes
- **Minor Revisions**: Small improvements required
- **Major Revisions**: Substantial changes needed
- **Reject**: Manuscript not suitable for publication

### 5. Revision Cycle
- **Author Response**: Authors address reviewer comments
- **Re-evaluation**: Editor or reviewers assess changes
- **Iterative Process**: May require multiple revision rounds

### 6. Production Stage
- **Copyright/License Agreement**: Legal documentation
- **Copy Editing**: Language and style improvements
- **Typesetting**: Final formatting and layout
- **Proofing**: Final author verification

### 7. Publication
- **DOI Assignment**: Permanent identifier creation
- **Online First**: Early online publication
- **Issue Publication**: Inclusion in journal issue
- **Indexing**: Addition to academic databases
- **Metrics Tracking**: Citation and usage monitoring

## Key Decision Points

1. **Administrative Check**: Ensures submission meets basic requirements
2. **Scope & Quality Check**: Prevents unsuitable manuscripts from entering review
3. **Reviewer Availability**: Ensures qualified peer review
4. **Review Consensus**: Validates editorial decisions
5. **Revision Adequacy**: Confirms author responses are sufficient
6. **Production Approval**: Verifies accuracy before publication

## Related Documentation
- [PRD.md](PRD.md) - Product Requirements Document
- [USER_WORKFLOWS.md](USER_WORKFLOWS.md) - User Workflows
- [roles.md](roles.md) - System Roles
