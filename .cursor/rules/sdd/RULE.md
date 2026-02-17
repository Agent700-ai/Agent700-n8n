---
alwaysApply: true
---

# Rule: Use Spec-Driven Development for Meaningful Changes

For any non-trivial feature, refactor, or behavior change, **do not jump straight to code**.
Always collaborate with me to create or refine a short spec first, then implement against that spec.

---

## 1. When to Require a Spec

Create or update a spec whenever:
- A new feature, workflow, or API is being added.
- Behavior changes could affect users, data, or other systems.
- There is uncertainty, cross-cutting impact, or more than "a few lines of code."

**Skip the spec for**: Minor copy tweaks, obvious one-line fixes, or dependency updates with no behavior change.

**Hotfix escape hatch**: For urgent production fixes, implement first but create the spec within 24 hours. Do not skip documentation entirely.

---

## 2. Workflow Rules

### Before Coding
1. Ask clarifying questions until you can draft the spec.
2. Propose spec in Markdown using the template below, referencing existing code/architecture.
3. Mark any unclear requirements with `[NEEDS CLARIFICATION: reason]`.
4. **Wait for my approval** before writing implementation code.

### Minimum Viable Spec for Approval
At minimum, these sections must be complete (not TBD):
- Problem & Motivation
- Goals
- Non-Goals  
- At least one P1 Functional Requirement
- At least one Acceptance Criterion (Given/When/Then)

Other sections can be marked TBD for initial approval if we agree to refine during implementation.

### During Implementation
- Treat the spec as the **contract**.
- If you discover conflicts or gaps, **pause and update the spec with me**.
- Keep code, tests, and spec aligned. Highlight any deviations you think are necessary.

### After Implementation
- Verify all Acceptance Criteria pass.
- Confirm Success Criteria are measurable (or instrumented).
- Update spec if final behavior differs from original.

---

## 3. Spec Lifecycle

Specs are **living documents**, not throwaway artifacts.

| Phase | Action |
|-------|--------|
| **Creation** | Save to `/docs/specs/YYYY-MM-DD-feature-name.md`. Commit with feature branch. |
| **During Dev** | Update spec if implementation reveals gaps or changes. Spec = contract. |
| **PR/Merge** | Reference spec path in PR description. Add spec path as comment in primary file touched. |
| **Post-Launch** | When behavior changes later, update spec first, then implement. |
| **Deprecation** | When feature is removed, archive spec to `/docs/specs/archive/`. |

---

## 4. Behavioral Expectations

- **Gate code behind spec**: If I ask for a feature without a spec, propose or request a spec first.
- **Push for clarity**: Call out missing Goals, Non-Goals, Acceptance Criteria, or vague requirements.
- **Mark ambiguity explicitly**: Use `[NEEDS CLARIFICATION: reason]` rather than assuming or inventing answers.
- **Respect context limits**: If a spec exceeds ~500 lines, propose decomposition into sub-specs.
- **Reference, don't duplicate**: Link to project-level docs (architecture.md, etc.) instead of copying content.
- **Time-box spec drafting**: Initial draft should take <15 min. If longer, scope is too big—break it down.
- **Use spec as backbone**: Organize your explanation, code plan, and test plan around spec sections.

---

## 5. Spec Template

- Use this template when creating specs. Keep it **short, clear, and specific**—target <500 lines.
[Feature Title]
Status: Draft | Approved Author: [name] Last Updated: [date] Spec Path: /docs/specs/YYYY-MM-DD-feature-name.md

# Specification Title

## Problem & Motivation

**What problem are we solving?**

Why does it matter now? Who is affected?

## Goals

- [Goal 1]
- [Goal 2]

## Non-Goals

- [Explicitly out of scope item 1]
- [Explicitly out of scope item 2]

## Background & Context

Relevant existing behavior, constraints, or prior work.

Link to project-level docs (`architecture.md`, `AGENTS.md`, etc.)—do not duplicate them here.

## Key Entities (if feature involves data)

- **[Entity Name]**: What it represents, key attributes (no implementation details yet).

## Requirements

### Functional Requirements

| ID | Priority | Requirement | Justification |
|----|----------|-------------|---------------|
| FR-001 | P1 | System MUST [behavior] | [justification] |
| FR-002 | P2 | System SHOULD [behavior] | [justification] |
| FR-003 | NEEDS CLARIFICATION | System MUST [behavior] via [unknown method] | Clarification needed: [what is unclear] |

### Non-Functional Requirements

- **Performance**: [targets]
- **Security**: [requirements]
- **Observability**: [logging, metrics, alerts]

### Priority Definitions

| Priority | Definition |
|----------|------------|
| **P1** | Must have for launch. Blocks release. |
| **P2** | Should have. Significant value, but can ship without. |
| **P3** | Nice to have. Defer if time-constrained. |

## Design Overview

High-level approach: UX/API surfaces, data model changes, key components touched.

Trade-offs or alternatives considered.

## Edge Cases

- What happens at boundary conditions (empty input, max limits, concurrent access)?
- How should the system handle specific error scenarios?

## Risks & Open Questions

- Known risks, dependencies, unknowns requiring decisions.
- Items marked `[NEEDS CLARIFICATION]` from requirements.

## Acceptance Criteria

Use Given/When/Then format for each user story.

### Story 1: [User story title]

- **Given** [initial state], **When** [action], **Then** [expected outcome].
- **Given** [alternate state], **When** [action], **Then** [alternate outcome].

### Story 2: [User story title]

- **Given** [...], **When** [...], **Then** [...].

## Success Criteria

Measurable business/UX outcomes beyond passing tests.

## Test Plan

| Type | Coverage |
|------|----------|
| **Unit** | [key functions/modules to test] |
| **Integration** | [component interactions to verify] |
| **E2E** | [critical user flows to automate] |

## 6. Quick Reference Checklist

Before approving a spec, verify:

- [ ] Problem is clearly stated
- [ ] Goals are specific and measurable
- [ ] Non-Goals explicitly exclude likely scope creep
- [ ] Requirements have priority (P1/P2/P3) with justification
- [ ] Unclear items marked `[NEEDS CLARIFICATION]`
- [ ] Edge cases documented
- [ ] Acceptance Criteria use Given/When/Then
- [ ] Success Criteria are measurable
- [ ] Spec is <500 lines
- [ ] Links to (not duplicates) project-level context