---
name: design-system
description: Complete reference for the project's design system — tokens, utilities, and Tailwind mappings
---

# Design System Reference

The design system lives in `src/styles/` and is organized into **primitives**, **semantic tokens**, **Tailwind mappings**, and **utility classes**.

## Token Architecture

```
src/styles/
├── tokens/
│   ├── _index.css              ← Imports all token files
│   ├── 1-primitives/
│   │   ├── colors.css          ← Raw color values (oklch)
│   │   ├── typography.css      ← Font families, sizes, weights
│   │   ├── spacing.css         ← Spacing scale (--space-1 to --space-16)
│   │   ├── motion.css          ← Transition durations (--motion-fast, --motion-base, --motion-slow)
│   │   └── z-index.css         ← Z-index layers (--z-base to --z-max)
│   ├── 2-semantic/
│   │   ├── colors-dark.css     ← Dark mode color assignments
│   │   ├── colors-light.css    ← Light mode color assignments
│   │   ├── materials.css       ← Glass, surface materials (--material-glass, --material-surface)
│   │   ├── layout.css          ← Layout constraints (--content-width, --sidebar-width)
│   │   └── typography.css      ← Semantic type scale (--font-heading, --font-body)
│   └── 3-tailwind.css          ← Maps all tokens to Tailwind theme
└── utilities.css               ← Utility classes (.container, .glass, .flow, .prose-container)
```

## Using Colors

### Semantic Color Tokens
Always use semantic tokens, never raw color values:

| Token | Purpose | Tailwind |
|-------|---------|----------|
| `--color-bg` | Page background | `bg-bg` |
| `--color-surface` | Card/panel surface | `bg-surface` |
| `--color-surface-elevated` | Elevated surfaces | `bg-surface-elevated` |
| `--color-surface-hover` | Hover state | `bg-surface-hover` |
| `--color-text` | Primary text | `text-text` |
| `--color-muted` | Secondary text | `text-muted` |
| `--color-border` | Borders | `border-border` |
| `--color-primary` | Accent/brand color | `text-primary`, `bg-primary` |
| `--color-focus` | Focus ring color | `ring-focus` |

### Kind Colors (per content type)
Defined in `colors.css` primitives:
- `--color-kind-note` → blue
- `--color-kind-essay` → violet
- `--color-kind-tutorial` → emerald
- `--color-kind-thought` → amber

### Ripeness Colors
- `--color-ripeness-seed` → rose
- `--color-ripeness-root` → amber
- `--color-ripeness-fruit` → emerald

> **Tech Debt:** These tokens exist but badge components currently hardcode Tailwind colors instead of using them. Future migration planned.

## Using Spacing

The spacing scale follows a consistent progression:

| Token | Value | Tailwind |
|-------|-------|----------|
| `--space-1` | 0.25rem | `p-1`, `m-1`, `gap-1` |
| `--space-2` | 0.5rem | `p-2`, `m-2`, `gap-2` |
| `--space-3` | 0.75rem | `p-3`, etc. |
| `--space-4` | 1rem | `p-4` |
| `--space-6` | 1.5rem | `p-6` |
| `--space-8` | 2rem | `p-8` |

## Using Typography

| Token | Purpose | Tailwind |
|-------|---------|----------|
| `--font-body` | Body text | `font-body` |
| `--font-heading` | Headings | `font-heading` |
| `--font-mono` | Code/mono | `font-mono` |

## Using Motion

| Token | Duration | Tailwind |
|-------|----------|----------|
| `--motion-fast` | 100-150ms | `duration-fast` |
| `--motion-base` | 200-300ms | `duration-base` |
| `--motion-slow` | 400-500ms | `duration-slow` |

## Using Z-Index

| Token | Usage |
|-------|-------|
| `--z-base` | Default elements |
| `--z-dropdown` | Dropdowns, tooltips |
| `--z-sticky` | Sticky headers |
| `--z-overlay` | Modal overlays |
| `--z-modal` | Modal dialogs |
| `--z-toast` | Toast notifications |
| `--z-max` | Command palette, top-level |

## Utility Classes

Defined in `utilities.css`:

| Class | Purpose |
|-------|---------|
| `.container` | Centered content with max-width and padding |
| `.prose-container` | Narrower container for reading content |
| `.content-container` | Content area container |
| `.flow` | Vertical spacing between children (uses lobotomized owl) |
| `.flow--sm` | Smaller vertical spacing |
| `.flow--lg` | Larger vertical spacing |
| `.glass` | Glassmorphism effect (backdrop-blur + transparency) |
| `.bg-material-*` | Material backgrounds |
| `.focus-ring` | Consistent focus ring styling |
| `.sr-only` | Screen reader only |
| `.text-muted` | Muted text color |
| `.text-primary` | Primary text color |
| `.transition-base` | Base transition preset |
| `.transition-fast` | Fast transition preset |
| `.scrollbar-none` | Hide scrollbar |

## Rules

1. **Never hardcode colors.** Use CSS tokens via Tailwind classes.
2. **Never use arbitrary values** when a token exists (e.g., use `p-4` not `p-[1rem]`).
3. **Use semantic tokens**, not primitive tokens, in components.
4. **Dark mode is automatic** — semantic tokens switch via `prefers-color-scheme` and `.dark` class.
5. **Use utility classes** for common patterns (`.container`, `.flow`, `.glass`) instead of repeating the same Tailwind combinations.
6. **Tailwind v4 CSS variable syntax:** Use the shorthand `bg-(--var-name)` instead of `bg-[var(--var-name)]`. This applies to all utilities: `text-(--var)`, `ease-(--var)`, `z-(--var)`, etc.

