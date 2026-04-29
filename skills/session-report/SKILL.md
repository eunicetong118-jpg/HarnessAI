# Session Report Generator

Generate styled HTML reports of work completed in a Claude Code session.

## When to Trigger
- User says "generate report", "session report", "summarize session".
- After major milestone or ingest.
- End of session.

## Process

### Step 1: Gather Data
- **Git**: `git diff --stat`, `git log --oneline`.
- **Files**: New wiki pages, updated logs.
- **Context**: Key decisions, synthesis findings.
- **Next Steps**: Tasks from `TaskGet` or conversation.

### Step 2: Structure
- **Header**: Date, project (HarnessAI).
- **Executive Summary**: High-level accomplishments.
- **Wiki Updates**: Table of pages created/modified.
- **Decisions**: Architectural/principled choices.
- **Next Steps**: Follow-ups.

### Step 3: HTML Generation
- Use clean, modern CSS.
- Narrative style: Direct, technical, caveman-compliant if active.
- Save to `docs/reports/session-report-YYYY-MM-DD.html`.

### Step 4: Ledger Update
- Update `wiki/log.md` with the report link.
- Update `wiki/index.md` if new categories emerge.

## HTML Template Reference
- Located in `references/template.html`.
