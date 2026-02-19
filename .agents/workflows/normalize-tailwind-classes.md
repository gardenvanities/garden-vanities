---
description: Normalize Tailwind classes to canonical utilities when equivalents exist
---
// turbo-all

# Normalize Tailwind Classes

Run this workflow when Tailwind IntelliSense reports `suggestCanonicalClasses`.

## Goal

Reduce arbitrary-value noise and enforce canonical utility usage for consistency.

## Rules

- Prefer canonical utility classes over bracket arbitrary values when equivalent exists.
- Keep arbitrary values only when no canonical utility exists.
- Preserve behavior and visual result.

## Common Replacements

- `md:w-[17.5rem]` -> `md:w-70`
- `md:w-[4.75rem]` -> `md:w-19`
- `w-[260px]` -> `w-65`
- `aspect-[4/3]` -> `aspect-4/3`
- `aspect-[16/10]` -> `aspect-16/10`
- `z-[90]` -> `z-90`
- `z-[100]` -> `z-100`
- `backdrop-blur-[8px]` -> `backdrop-blur-sm`
- `transition-[all]` -> `transition-all`

## Checks

```bash
rg -n "transition-\\[all\\]|aspect-\\[[0-9]+/[0-9]+\\]|z-\\[[0-9]+\\]|w-\\[[0-9]+px\\]|h-\\[[0-9]+px\\]|min-h-\\[[0-9]+px\\]|max-h-\\[[0-9]+px\\]|bg-\\[oklch\\(from_var\\(--color-primary\\)_l_c_h_/" src --glob '*.svelte'
```

## Validate

```bash
bun check && bun lint
```

## Exit Criteria

- No unresolved canonical-class warnings in edited files.
- `bun check && bun lint` exit code `0`.
