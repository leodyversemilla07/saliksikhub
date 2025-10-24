# editorial Specification

## Purpose
TBD - created by archiving change add-rjms-core-specs. Update Purpose after archive.
## Requirements
### Requirement: Editorial Decision Mapping
Editorial decisions SHALL map to manuscript statuses using enums.

#### Scenario: Accept decision
- WHEN an editor records `decision=accept`
- THEN the manuscript status becomes `accepted`

#### Scenario: Minor revision required
- WHEN an editor records `decision=minor_revision`
- THEN the manuscript status becomes `minor_revision_required`

#### Scenario: Major revision required
- WHEN an editor records `decision=major_revision`
- THEN the manuscript status becomes `major_revision_required`

#### Scenario: Reject decision
- WHEN an editor records `decision=reject`
- THEN the manuscript status becomes `rejected`

