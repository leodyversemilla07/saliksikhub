## ADDED Requirements

### Requirement: Private File Storage
Manuscript files SHALL be stored privately with generated temporary URLs for access.

#### Scenario: Temporary URL
- WHEN rendering manuscript details
- THEN private file paths are converted to temporary URLs or streamed via controllers

### Requirement: PDF Serving
Published manuscript PDFs SHALL be streamed inline with appropriate headers.

#### Scenario: Serve published PDF
- WHEN a visitor opens the PDF route for a published manuscript
- THEN the system streams the PDF with Content-Type application/pdf and an inline Content-Disposition
