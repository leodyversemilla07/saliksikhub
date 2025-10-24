## Context
Baseline spec capture for the RJMS. Cross-cutting concerns include enum-driven workflow, role-gated access, private file storage, and Inertia SPA delivery.

## Goals / Non-Goals
- Goals: Document current behavior as normative specs; enable spec-first iteration; reduce ambiguity
- Non-Goals: Introduce new features or breaking changes; refactor architecture

## Decisions
- Use enums as the single source of truth for workflow states and recommendations
- Restrict public access to published items only; stream PDFs via backend
- Keep manuscript/issue slugs immutable after creation
- Prefer services for storage/review orchestration

## Risks / Trade-offs
- Enum inconsistencies in current code can cause drift; specs will highlight expected names and transitions
- Duplicate revision storage (table + JSON) can diverge; call out as tech debt

## Migration Plan
No schema or behavior changes in this proposal. Follow-up changes should use separate proposals.

## Open Questions
- Should `revision_history` JSON be deprecated in favor of `manuscript_revisions` table?
- Should we add API resources for public consumption (beyond Inertia pages)?
