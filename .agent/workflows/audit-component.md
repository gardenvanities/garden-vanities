---
description: Run a quality audit on a Svelte component against project standards
---

# Audit Component

Systematically check a component against all project conventions and quality standards.

Design system canonical source: `.agent/design-system.md`.

## Steps

### 1. Props Interface

- [ ] Uses explicit `interface Props`
- [ ] Props destructured with `$props()`
- [ ] Default values provided for optional props
- [ ] `class?: string` included if component renders DOM elements
- [ ] No `any` types — use `unknown` or specific types

### 2. Svelte 5 Runes

- [ ] Uses `$state` (not `let` for reactive values)
- [ ] Uses `$derived` (not `$:` reactive declarations)
- [ ] Uses `$effect` sparingly (not for derived values)
- [ ] No legacy Svelte 4 patterns (`export let`, `$:`, `$$props`)

### 3. Styling

- [ ] Uses Tailwind utility classes (not `<style>` unless justified)
- [ ] Colors from design tokens (`text-muted`, `bg-surface`, `border-border`)
- [ ] No hardcoded hex/rgb/oklch colors
- [ ] No arbitrary values when a token exists (`p-4` not `p-[1rem]`)
- [ ] Uses utility classes where available (`.container`, `.glass`, `.flow`)
- [ ] Depth is within official levels (`0..3`)
- [ ] Motion is functional only (no decorative animation)

#### Justified `<style>` Exceptions
A `<style>` block is allowed only for:
- `@keyframes` animations
- `:global()` selectors (Markdown content, runtime DOM)
- Complex `calc()` / `oklch()` computations
- Scrollbar / pseudo-element styling
- State-dependent compound selectors beyond Tailwind

### 4. Imports

- [ ] Order: Framework/NPM → `$lib/` → relative → types
- [ ] No unused imports
- [ ] No circular dependencies
- [ ] Uses shared utilities (`formatShortDate`, `cn`, `setCacheHeaders`)
- [ ] No duplicate logic (check `$lib/shared/` for existing utils)

### 5. Code Quality

- [ ] No `console.log` statements
- [ ] No `any` type assertions
- [ ] No comments (unless technically necessary)
- [ ] Component follows SRP (Single Responsibility Principle)
- [ ] Logic extracted to `.svelte.ts` if `<script>` exceeds ~80 lines
- [ ] Constants centralized if shared, local if not

### 6. Accessibility

- [ ] Semantic HTML (`<button>` not `<div onclick>`)
- [ ] `aria-label` on icon-only buttons
- [ ] Keyboard navigable (focusable, Enter/Space activated)
- [ ] Focus states visible (`.focus-ring` or `focus:ring`)
- [ ] Interactive states include default/hover/focus/active/disabled (when applicable)
- [ ] Alt text on images
- [ ] Proper heading hierarchy

### 7. Barrel Export

- [ ] UI component exported in `src/lib/ui/index.ts`
- [ ] Domain component exported in domain's `index.ts` (if exists)

### 8. Validate

// turbo
```bash
bun check && bun lint
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Missing Props interface | 🔴 Must fix |
| `any` types | 🔴 Must fix |
| Hardcoded colors | 🟡 Should fix |
| Unnecessary `<style>` | 🟡 Should fix |
| Missing barrel export | 🟢 Nice to have |
| Missing aria-label on icon button | 🟡 Should fix |
| Unused imports | 🔴 Must fix |
| console.log in production | 🔴 Must fix |
