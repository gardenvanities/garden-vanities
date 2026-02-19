---
name: svelte-patterns
description: Svelte 5 patterns and conventions used in this project
---

# Svelte 5 Patterns

This project uses **Svelte 5 with Runes** exclusively. All new components must follow these patterns.

## Props Pattern

Always use an explicit `interface Props` with `$props()` destructuring:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    class?: string;
  }

  let { title, description = "", class: className = "" }: Props = $props();
</script>
```

### Rules
- Always define `interface Props` (never inline types)
- Use `class: className` alias for the CSS class prop
- Provide default values in destructuring
- Use `[key: string]: unknown` only for pass-through components

## Reactivity Patterns

### `$state` — Mutable local state
```typescript
let count = $state(0);
let items = $state<string[]>([]);
```

### `$derived` — Computed values
```typescript
const doubled = $derived(count * 2);
const fullName = $derived(`${firstName} ${lastName}`);
```

### `$derived.by` — Complex computations
```typescript
const filtered = $derived.by(() => {
  if (!query) return items;
  return items.filter(i => i.includes(query));
});
```

### `$effect` — Side effects (use sparingly)
```typescript
$effect(() => {
  document.title = fullTitle;
});
```

> **Rule:** Prefer `$derived` over `$effect` whenever possible. `$effect` should only be used for DOM side effects, subscriptions, or integrations with non-Svelte libraries.

## Composition: Snippets vs Props

### Use Snippets for structural/layout components
```svelte
<!-- Parent -->
<Card>
  {#snippet header()}
    <h2>Title</h2>
  {/snippet}
  {#snippet content()}
    <p>Body text</p>
  {/snippet}
</Card>

<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    header?: Snippet;
    content: Snippet;
    class?: string;
  }

  let { header, content, class: className = "" }: Props = $props();
</script>

<div class={className}>
  {#if header}{@render header()}{/if}
  {@render content()}
</div>
```

### Use props for atomic UI components
```svelte
<!-- Badge.svelte — configured entirely via props -->
<script lang="ts">
  interface Props {
    variant?: "default" | "primary" | "danger";
    children: Snippet;
    class?: string;
  }

  let { variant = "default", children, class: className = "" }: Props = $props();
</script>
```

## Extracting Logic to `.svelte.ts`

When a component's `<script>` grows too complex, extract logic into a co-located `.svelte.ts` file:

```typescript
// reading-progress.svelte.ts
export function createReadingProgress() {
  let percent = $state(0);
  let minutesLeft = $state(0);

  function update(scrollY: number, totalHeight: number, readingTime: number) {
    percent = Math.min(100, (scrollY / totalHeight) * 100);
    minutesLeft = Math.ceil(readingTime * (1 - percent / 100));
  }

  return {
    get percent() { return percent; },
    get minutesLeft() { return minutesLeft; },
    update
  };
}
```

```svelte
<!-- ReadingProgress.svelte -->
<script lang="ts">
  import { createReadingProgress } from "./reading-progress.svelte.ts";
  const progress = createReadingProgress();
</script>
```

### When to extract
- Component `<script>` exceeds ~80 lines of logic
- Logic is reusable across components
- Complex state machines or computed chains
- Integration with external libraries

## Store Pattern (`.svelte.ts`)

Global stores use `$state` in module-level `.svelte.ts` files:

```typescript
// stores/ui.svelte.ts
let sidebarOpen = $state(false);
let sidebarExpanded = $state(true);

export const uiStore = {
  get sidebarOpen() { return sidebarOpen; },
  get sidebarExpanded() { return sidebarExpanded; },
  toggleSidebar() { sidebarOpen = !sidebarOpen; },
  setSidebarExpanded(value: boolean) { sidebarExpanded = value; }
};
```

## Component File Organization

Order sections in `.svelte` files:

1. `<script lang="ts">` — imports, interface, props, state, logic
2. Template markup (HTML)
3. `<style>` (only if technically justified)

### Import Order within `<script>`
1. Framework & NPM (`svelte`, `@lucide/svelte`)
2. Project aliases (`$lib/ui/...`, `$lib/modules/...`)
3. Relative imports (`./sibling.ts`)
4. Type-only imports (`import type { ... }`)

## Event Handling

Use the `on` prefix with native event names (Svelte 5 pattern):

```svelte
<button onclick={handleClick}>Click</button>
<input oninput={(e) => query = e.currentTarget.value} />
```

## Conditional Rendering

```svelte
{#if condition}
  <Component />
{:else if otherCondition}
  <AltComponent />
{:else}
  <Fallback />
{/if}
```

## List Rendering

Always provide a unique `key`:

```svelte
{#each items as item (item.id)}
  <ListItem {item} />
{/each}
```

## Transitions

Use Svelte transitions for enter/exit animations:

```svelte
<script>
  import { fly, fade } from "svelte/transition";
</script>

{#if isOpen}
  <div transition:fly={{ y: 10, duration: 200 }}>Content</div>
{/if}
```
