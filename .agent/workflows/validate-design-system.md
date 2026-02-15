---
description: Validate design-system compliance for UI tasks
---
// turbo-all

# Validate Design System

Run this workflow whenever a task changes UI, styles, tokens, or layout behavior.

## Steps

1. Run quick design-system self-checks:

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgb\\(|hsl\\(" src --glob '*.svelte' --glob '*.css'
rg -n "outline:\\s*none" src --glob '*.svelte' --glob '*.css'
rg -n "\\[[^\\]]+\\]" src --glob '*.svelte'
rg -n "shadow-xl|--shadow-4|z-\\[|z-\\(--z-critical\\)" src
```

2. Run project validation:

```bash
bun check && bun lint
```

3. Report with mandatory sections:
- `Applied rules`
- `Residual debt`

## Exit Criteria

- No unresolved violations against `.agent/design-system.md`
- `bun check && bun lint` exit code `0`
- Final report includes the two mandatory sections

