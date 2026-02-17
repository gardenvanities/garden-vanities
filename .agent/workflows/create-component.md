---
description: Scaffold a new Svelte component following project conventions
---

# Create Component

Scaffold a new Svelte 5 component following the project's architecture and naming conventions.

Design system canonical source: `.agent/design-system.md`.

## Inputs

Before starting, determine:
1. **Component name** (PascalCase, e.g. `StatusIndicator`)
2. **Location type:**
   - `ui` → `src/lib/ui/` (dumb, agnostic, props-only)
   - `domain` → `src/lib/modules/[domain]/components/` (smart, domain-specific)
3. **Domain name** (only if domain component, e.g. `garden`, `posts`)

## Steps

### 1. Create the component file

For a **UI component** at `src/lib/ui/{ComponentName}.svelte`:

```svelte
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();
</script>

<div class={className}></div>
```

For a **domain component** at `src/lib/modules/{domain}/components/{ComponentName}.svelte`:

```svelte
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();
</script>

<div class={className}></div>
```

### 2. Follow these conventions

- **Svelte 5 Runes only:** Use `$state`, `$derived`, `$props`, `$effect`.
- **Explicit Props interface:** Always define `interface Props` with typed properties.
- **Tailwind inline classes:** Style with utility classes. No `<style>` block unless technically required (keyframes, `:global()`, complex calc).
- **Design tokens:** Use CSS token classes (`text-muted`, `bg-surface-elevated`, `border-border`). Never hardcode colors.
- **Aesthetic baseline:** Enforce Layered Dark Editorial (LDE): subtle layered surfaces, restrained accent usage, modular spacing rhythm.
- **Depth and motion:** Respect depth levels `0..3` and functional motion only.
- **Import order:** Framework/NPM → `$lib/` → relative → types.
- **No comments** unless explaining a non-obvious technical decision.
- **Composition over configuration:** For layout components, use Snippets. For atomic UI, use props.

### 3. Register in barrel file (UI components only)

If the component is in `src/lib/ui/`, add it to `src/lib/ui/index.ts`:

```typescript
export { default as ComponentName } from "./ComponentName.svelte";
```

For domain components, add to the domain's `index.ts` barrel file if one exists.

### 4. Validate

// turbo
Run validation to ensure no type or lint errors:
```bash
bun check && bun lint
```

## Checklist

- [ ] File named in PascalCase and placed in correct directory
- [ ] Uses `interface Props` with `$props()` destructuring
- [ ] Styled with Tailwind utility classes using design tokens
- [ ] No `<style>` block (unless justified per project rules)
- [ ] Includes interactive states and visible focus when interactive
- [ ] Matches LDE visual grammar (dark-first layering, restrained accent, no decorative effects)
- [ ] Respects depth/motion constraints from `.agent/design-system.md`
- [ ] Registered in barrel file (if applicable)
- [ ] Passes `bun check && bun lint`
