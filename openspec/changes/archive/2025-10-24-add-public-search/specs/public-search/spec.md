# public-search Specification

## Purpose
Enable public users to search published manuscripts by content fields to improve discoverability and accessibility of journal articles.

## ADDED Requirements

### Requirement: Public Search Form
Public visitors SHALL have access to a search form on the archives page to search published manuscripts.

#### Scenario: Display search form
- WHEN a visitor navigates to the archives page
- THEN the page displays a search input field with placeholder text
- AND includes a search button

### Requirement: Search by Title
Search SHALL match manuscripts where the search term appears in the title field.

#### Scenario: Search by title
- WHEN a visitor searches for "machine learning"
- AND a published manuscript has title "Applications of Machine Learning in Research"
- THEN that manuscript appears in search results

### Requirement: Search by Authors
Search SHALL match manuscripts where the search term appears in the authors field.

#### Scenario: Search by author name
- WHEN a visitor searches for "Smith"
- AND a published manuscript lists "John Smith" as an author
- THEN that manuscript appears in search results

### Requirement: Search by Keywords
Search SHALL match manuscripts where the search term appears in the keywords field.

#### Scenario: Search by keyword
- WHEN a visitor searches for "neural networks"
- AND a published manuscript has "neural networks" in its keywords
- THEN that manuscript appears in search results

### Requirement: Search by Abstract
Search SHALL match manuscripts where the search term appears in the abstract field.

#### Scenario: Search by abstract content
- WHEN a visitor searches for "experimental results"
- AND a published manuscript mentions "experimental results" in its abstract
- THEN that manuscript appears in search results

### Requirement: Published Only Results
Search SHALL only return manuscripts with status `published`.

#### Scenario: Unpublished manuscripts excluded
- WHEN a visitor searches for any term
- THEN only manuscripts with status `published` are returned
- AND manuscripts with other statuses are not included

### Requirement: Case Insensitive Search
Search SHALL be case insensitive.

#### Scenario: Case insensitive matching
- WHEN a visitor searches for "Machine Learning"
- THEN manuscripts with "machine learning" in searchable fields are found

### Requirement: Search Results Display
Search results SHALL display manuscript title, authors, publication date, and DOI with links to full manuscript.

#### Scenario: Display search results
- WHEN search returns results
- THEN each result shows title, authors, publication info
- AND includes link to manuscript detail page

### Requirement: No Results Message
When no manuscripts match the search, SHALL display appropriate message.

#### Scenario: No search results
- WHEN a search returns no matches
- THEN display "No manuscripts found matching your search"
- AND suggest trying different keywords

### Requirement: Search Results Pagination
Search results SHALL be paginated with 20 results per page.

#### Scenario: Paginated results
- WHEN search returns more than 20 results
- THEN results are split across multiple pages
- AND navigation controls are provided