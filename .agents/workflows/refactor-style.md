---
description: Migrate a component's style block to Tailwind utility classes
---

# Refactor Style

Systematically migrate a component's `<style>` block to Tailwind utility classes.

Design system canonical source: `.agents/design-system.md`.

## When to Use

Use this workflow when a component has a `<style>` block that can be replaced with Tailwind.

**Do NOT refactor if the `<style>` contains:**
- `@keyframes` animations
- `:global()` selectors for runtime DOM manipulation
- Complex `oklch()` / `calc()` beyond Tailwind's capabilities
- Scrollbar or pseudo-element styling (`::-webkit-*`)
- State-dependent compound selectors that Tailwind can't express

## Steps

### 1. Audit the `<style>` block

For each CSS rule, determine its Tailwind equivalent:

| CSS Property | Tailwind Equivalent |
|-------------|-------------------|
| `display: flex` | `flex` |
| `align-items: center` | `items-center` |
| `gap: var(--space-3)` | `gap-3` |
| `color: var(--color-muted)` | `text-muted` |
| `background-color: var(--color-surface)` | `bg-surface` |
| `border: 1px solid var(--color-border)` | `border border-border` |
| `font-size: 0.875rem` | `text-sm` |
| `font-weight: 600` | `font-semibold` |
| `border-radius: var(--radius-2)` | `rounded-md` |
| `transition: background-color var(--motion-fast)` | `transition-colors duration-fast` |
| `padding: var(--space-2)` | `p-2` |

### 2. Handle hover/focus states

CSS hover → Tailwind `hover:` prefix:
```
.item:hover { background: var(--color-surface-hover); }
→ hover:bg-surface-hover
```

Parent hover affecting child → use `group`/`group-hover`:
```
.item:hover .icon { color: var(--color-text); }
→ Parent: class="group", Child: class="group-hover:text-text"
```

### 3. Replace class-by-class

Work through each HTML element:
1. Find each element that uses a styled class
2. Replace the class with equivalent Tailwind utilities
3. Remove the CSS class name from the element

### 4. Remove the `<style>` block

Once all classes are migrated, delete the entire `<style>` block.

### 5. Verify

// turbo
```bash
bun check && bun lint
```

Visually inspect the component in the browser to confirm appearance matches.
Confirm the migrated result still follows LDE baseline (layered dark hierarchy, restrained accent, no ornamental effects).

## Checklist

- [ ] All CSS properties mapped to Tailwind equivalents
- [ ] Hover/focus states converted with appropriate prefixes
- [ ] No hardcoded colors; semantic token usage preserved
- [ ] No decorative motion introduced
- [ ] No depth above level 3 introduced
- [ ] No LDE drift introduced (no neon accents, heavy blur/glow, decorative gradients on reading surfaces)
- [ ] No remaining class references from old `<style>`
- [ ] `<style>` block completely removed
- [ ] `bun check && bun lint` passes
- [ ] Visual appearance unchanged
