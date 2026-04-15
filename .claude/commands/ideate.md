---
description: Surface one concrete, well-scoped improvement for CheatDay and file it as a Linear issue. No code changes.
---

# /ideate — propose the next issue

Goal: produce **one** Linear issue that a single `/work` iteration can complete. No code changes in this command.

## Playbook

### 1. Scan for candidates

Look in this order and pick the strongest single candidate:

1. **Open bugs visible in the code** — TODO/FIXME comments, obvious edge cases, missing error handling, `any` types hiding real shapes, console warnings in build output.
2. **UX gaps** on the three core screens (`HomePage`, `StatsPage`, `SettingsPage`) — empty states, loading states, accessibility (focus rings, aria-labels, reduced motion), mobile safe areas.
3. **PWA polish** — offline behaviour, cache strategy, install prompt, icon/manifest coverage.
4. **Performance** — unnecessary reactivity, re-renders, large dependencies, unoptimised SVG/canvas.
5. **Feature extensions** that align with the 80/20 tracking concept (e.g. streaks, weekly recap, export, notifications).

Use Grep/Glob to verify the problem is real before filing. Don't invent issues.

### 2. Check for duplicates

`list_issues` in the CHE team — skim Backlog + Todo titles. If something similar already exists, stop and tell the user "Nothing new worth filing — existing: CHE-XX".

### 3. Shape the issue

A good CheatDay issue fits in one session (~30–90 min of work). If it's bigger, split it.

Write:
- **Title**: imperative, under ~60 chars. e.g. "Add empty-state illustration to Stats when no logs exist".
- **Description** (markdown):
  ```
  ## Why
  <one short paragraph on the user-visible problem>

  ## Scope
  <bullet list of what's in>

  ## Out of scope
  <bullet list of what's not — keeps the PR small>

  ## Acceptance criteria
  - [ ] <concrete, testable>
  - [ ] `npx vue-tsc --noEmit` clean
  - [ ] `npx vite build` clean

  ## Notes
  <file paths, hints, gotchas>
  ```
- **Labels**: pick from existing Linear labels (`list_issue_labels`). Don't invent new ones.
- **Estimate / priority**: leave default unless obvious.

### 4. Create the issue

Call `mcp__62715eb5-0c85-4366-afb7-37c049b51f14__save_issue` with:
- teamId (CHE team)
- state (Todo)
- title, description as above

### 5. Report

Return to the user: the `CHE-XX` identifier, title, and a one-sentence rationale for why this is the right next thing.

## Guardrails

- One issue per invocation. No grab-bags.
- No speculative rewrites ("migrate to X framework") — stay inside the current stack.
- Don't file anything you wouldn't want to implement yourself in the next `/work` run.
