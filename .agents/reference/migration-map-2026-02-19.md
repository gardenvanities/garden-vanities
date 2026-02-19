# Codex Configuration Migration Map (2026-02-19)

## Goal

Align repository configuration with current OpenAI Codex patterns for:
- AGENTS.md orchestration
- repository skills
- multi-agent runtime roles
- rules policy

while preserving all existing project instructions.

## Preservation Guarantees

- Original root policy snapshot preserved at:
  - `.agents/reference/AGENTS.backup-2026-02-19.md`
- Existing `.agents/skills/*` kept in place (no deletion)
- Existing `.agents/workflows/*` kept in place (no deletion)
- No content schema, design-system, or context document removed

## Applied Changes

1. Path normalization
- Updated references from `.agent/...` to `.agents/...` across active docs.

2. Runtime configuration
- Added `.codex/config.toml`
- Added role configs:
  - `.codex/agents/explorer.toml`
  - `.codex/agents/reviewer.toml`
  - `.codex/agents/uiux.toml`
  - `.codex/agents/content.toml`

3. Rules policy
- Added `.codex/rules/default.rules`

4. Agent routing docs
- Added `.agents/roles/*.md`
- Added `.agents/README.md` index
- Added `.agents.md` fallback project doc entry

5. AGENTS orchestration
- `AGENTS.md` now includes hierarchy and routing sections while retaining project rules.

6. Validation workflow hardening
- Added `check:agents` script to `package.json`
- Updated `.agents/workflows/validate.md` and `.agents/workflows/deploy-check.md` to include agent consistency check
- Normalized test command to `bun run test --run` (Vitest) to avoid Bun native test-runner mismatch
- Updated command references in `AGENTS.md` and `.agents/context.md`

## Deferred (Safe, optional)

- Consolidate overlapping workflow content into fewer high-signal skills.
- Add nested `AGENTS.md` in subdirectories only where local overrides are needed.
- Add CI check to detect stale `.agent/` path references outside backup snapshots.
