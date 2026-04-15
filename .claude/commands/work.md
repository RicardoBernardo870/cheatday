---
description: Run one full autonomous iteration — pick a Linear issue, branch, implement, verify, push, open PR targeting dev.
---

# /work — one autonomous iteration

You are operating on the CheatDay repo. Read `CLAUDE.md` first if you haven't in this session — the tech stack, conventions, branch policy, and quality gates are non-negotiable.

## Goal

Deliver one shippable change, end-to-end:

1. Sync with `dev`.
2. Pick (or create) a Linear issue.
3. Create a branch that matches Linear's `gitBranchName`.
4. Implement the change following repo conventions.
5. Run typecheck + production build. Fix what breaks. Repeat until clean.
6. Commit with a Linear-referenced message.
7. Push the branch to `origin`.
8. Open a PR targeting `dev`.
9. Move the Linear issue to **In Review** and paste the PR URL as a comment.

## Step-by-step playbook

### 1. Sync with dev

```bash
git fetch origin
git switch dev
git pull --ff-only origin dev
git status
```

Abort if the working tree is dirty — tell the user, do not stash silently.

### 2. Pick or create the next issue (Linear MCP)

Priority order:
1. Issues in **In Progress** assigned to me (resume in-flight work).
2. Issues in **Todo** assigned to me.
3. Unassigned issues in **Todo**.
4. Unassigned issues in **Backlog** with clear acceptance criteria.
5. If none qualify → run the ideation playbook from `.claude/commands/ideate.md` to create one, then proceed.

Use:
- `mcp__62715eb5-0c85-4366-afb7-37c049b51f14__list_issues` (filter by team CHE, state, assignee)
- `mcp__62715eb5-0c85-4366-afb7-37c049b51f14__get_issue` to read full description + gitBranchName

Record: issueId, identifier (e.g. `CHE-19`), title, gitBranchName, description.

### 3. Create the branch

```bash
git switch -c <gitBranchName>
```

If it already exists locally, switch to it and `git pull --ff-only` if it tracks a remote.

### 4. Plan, then implement

For non-trivial work (more than a couple of file edits), sketch the approach in your head (or via the Plan agent if the scope is unclear). Keep the change tightly scoped to the issue's acceptance criteria — resist side-quests. If you spot unrelated problems, call `mcp__ccd_session__spawn_task` to flag them for later.

Follow CheatDay conventions strictly (arrow functions, Pinia setup stores, PrimeVue `:pt`, glass-card, composables in `useXxx.ts`, etc.).

Move the Linear issue to **In Progress** as soon as you start coding (`save_issue` with the In Progress state id).

### 5. Verify — hard gate

```bash
npx vue-tsc --noEmit
npx vite build
```

Both must exit clean. Fix any error before continuing — do not paper over type errors with `any`, do not disable ESLint rules. If a fix is outside the issue's scope, stop and report back to the user rather than expanding the change.

### 6. Commit

```bash
git add <specific files>   # never `git add -A`
git commit -m "$(cat <<'EOF'
<type>(<CHE-ID>): <short summary>

<optional body explaining the why>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

`<type>` is `feat` / `fix` / `refactor` / `chore` / `docs` / `perf` per Conventional Commits.

### 7. Push

```bash
git push -u origin <gitBranchName>
```

Never `--force` on a branch that already has remote history unless the user asks explicitly.

### 8. Surface the PR URL (target dev)

`gh` CLI is **not installed** on this machine. After pushing, the remote returns a pre-filled PR URL of the form:

```
https://github.com/RicardoBernardo870/cheatday/pull/new/<branch>
```

Construct this URL and report it to the user along with the suggested title/body so they can open the PR with a single click. Title and body template:

```
Title: <CHE-ID>: <short summary>

Body:
## Summary
- <bullet 1>
- <bullet 2>

## Linear
Closes <CHE-ID>

## Test plan
- [ ] `npx vue-tsc --noEmit` passes
- [ ] `npx vite build` passes
- [ ] <manual checks specific to the change>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

When the user reports the PR number/URL back, continue with step 9.

### 9. Update Linear

- Move the issue to **In Review**.
- Add a comment on the issue with the PR URL (`save_comment`).

### 10. Report

Return to the user (concise):
- Issue + PR URL
- One-line summary of what shipped
- Next candidate issue (if running under `/loop`)

## Guardrails

- **Never** push to `main`, `master`, or `dev` directly.
- **Never** merge the PR — leave it for human review.
- **Never** commit `.env`, secrets, or generated build artefacts.
- **Never** skip typecheck or build.
- **Never** invent Linear state IDs — always look them up via `list_issue_statuses`.
- If a step fails and you can't resolve it within the scope of the issue, **stop and report** rather than force a workaround.

## Under `/loop`

When this command is invoked inside a loop, after reporting, call `ScheduleWakeup` with the same `/work` prompt to kick the next iteration. Pick a delay appropriate to what you're waiting on (CI, nothing → ~1200s default). Stop the loop if:
- No issue qualifies **and** ideation can't produce one.
- Two consecutive iterations fail the quality gate for the same reason.
- The user interrupts.
