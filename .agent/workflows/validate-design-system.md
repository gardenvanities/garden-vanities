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
rg -n "blur-|backdrop-blur|shadow-2xl|shadow-3xl|from-.*to-|via-" src --glob '*.svelte' --glob '*.css'
rg -n "transition-\\[all\\]|aspect-\\[[0-9]+/[0-9]+\\]|z-\\[[0-9]+\\]|w-\\[[0-9]+px\\]|h-\\[[0-9]+px\\]|min-h-\\[[0-9]+px\\]|max-h-\\[[0-9]+px\\]|bg-\\[oklch\\(from_var\\(--color-primary\\)_l_c_h_/" src --glob '*.svelte'
```

2. Run project validation:

```bash
bun check && bun lint
```

3. Report with mandatory sections:
- `Applied rules`
- `Residual debt`

4. Run visual conformance check against LDE baseline:
- layered dark hierarchy is clear (base/elevated/overlay)
- accent is restrained and functional
- no decorative neon/glow/gradient treatment in reading surfaces
5. Resolve Tailwind canonical warnings when an equivalent utility exists (`w-70`, `aspect-4/3`, `z-90`, `transition-all`, etc.)

## Exit Criteria

- No unresolved violations against `.agent/design-system.md`
- `bun check && bun lint` exit code `0`
- Final report includes the two mandatory sections
