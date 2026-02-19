# .agents Directory Guide

This directory is the project instruction system for Codex.

## Structure

- `context.md`: product + architecture context.
- `design-system.md`: visual and interaction source of truth.
- `skills/`: repository skills auto-discovered by Codex.
- `workflows/`: reusable operational playbooks.
- `roles/`: human-readable role prompts aligned with `.codex/config.toml`.
- `reference/`: preserved historical snapshots (no loss policy).

## No-loss policy

- Existing instructions are preserved.
- Migrations are additive first, cleanup later.
- Historical root instruction snapshots are stored in `reference/`.

## Skill discovery

Codex scans `.agents/skills` from current directory up to repo root.
Keep one focused job per skill and a strict trigger description.
