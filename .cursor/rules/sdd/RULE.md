---
alwaysApply: true
---


# sdd


# Rule: Use Spec‑Driven Development for Meaningful Changes

For any non‑trivial feature, refactor, or behavior change, **do not jump straight to code**.  
Always collaborate with me to create or refine a short spec first, then implement against that spec.

## 1. When to Require a Spec
Create / update a spec whenever:
- A new feature, workflow, or API is being added.
- Behavior changes could affect users, data, or other systems.
- There is uncertainty, cross‑cutting impact, or more than “a few lines of code” involved.

Minor copy tweaks or obvious one‑line fixes can skip this.

## 2. Spec Template (Single Source of Truth)

Before coding, draft or iterate on a spec that follows this structure:

1. **Title & Status**
   - Title
   - Status: Draft / In review / Approved

2. **Problem & Motivation**
   - What problem are we solving?
   - Why does it matter now? Who is affected?

3. **Goals**
   - Bullet list of what success looks like.

4. **Non‑Goals**
   - Explicitly list what is **out of scope** to avoid scope creep.

5. **Background / Context**
   - Relevant existing behavior, architecture, constraints, or links to prior work.

6. **Requirements**
   - **Functional**: What the system must do (user stories, flows, API behavior).
   - **Non‑functional**: Performance, security, durability, observability, etc.

7. **Design Overview**
   - High‑level approach: UX/API surfaces, data model changes, key components touched.
   - Any important trade‑offs or alternatives considered.

8. **Risks & Open Questions**
   - Known risks, edge cases, unknowns that need decisions.

9. **Acceptance Criteria & Test Plan**
   - Concrete criteria for “done.”
   - How we will test (unit, integration, E2E), including key scenarios.

The spec should be **short, clear, and specific**, not a big waterfall document. It can start rough and be refined.

## 3. Workflow Rules

- **Before coding**:
  - Ask clarifying questions until you can draft or update the spec.
  - Propose the spec in Markdown, referencing existing code/architecture where helpful.
  - Wait for my confirmation or edits before moving to implementation.

- **During implementation**:
  - Treat the spec as the **contract**: if you discover conflicts or gaps, pause and update the spec with me.
  - Keep code, tests, and spec aligned; highlight any deviations you think are necessary.

- **After implementation**:
  - Verify that acceptance criteria and test plan from the spec are satisfied.
  - If we change behavior beyond the original spec, update the spec accordingly.

## 4. Behavioral Expectations in Cursor

- If I ask for a feature without a spec, **first propose or request a spec** instead of writing full code.
- If the spec is vague, push for clarification: call out missing Goals, Non‑Goals, or Acceptance Criteria.
- Only generate substantial code once there is at least a **“good enough”** spec that covers:
  - Problem, Goals, Requirements, and Acceptance Criteria.
- Use the spec as the organizing backbone for your explanation, code plan, and test plan.# sdd

Write your command content here.

This command will be available in chat with /sdd
