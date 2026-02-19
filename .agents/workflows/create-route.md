---
description: Scaffold a new SvelteKit route with page, server load, and cache headers
---

# Create Route

Scaffold a new SvelteKit route following project conventions.

## Inputs

1. **Route path** (required) — e.g., `/about`, `/tags/[tag]`
2. **Has server data?** (default: yes) — whether a `+page.server.ts` is needed
3. **Prerender?** (default: yes) — whether the page should be static

## Steps

### 1. Create route directory

```bash
mkdir -p src/routes/{route-path}
```

### 2. Create `+page.server.ts` (if server data needed)

```typescript
import type { PageServerLoad } from "./$types";
import { setCacheHeaders } from "$lib/server/utils";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	return {
		// data
	};
};
```

### 3. Create `+page.svelte`

```svelte
<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";

	const { data } = $props();
</script>

<SEO title="{Page Title}" description="{Page description}" />

<main class="container py-8">
	<h1 class="text-3xl font-heading font-bold mb-6">{Page Title}</h1>
</main>
```

### 4. Disable prerender if dynamic

If the route requires real-time data:

```typescript
// +page.ts
export const prerender = false;
```

## Conventions

- Routes are **thin orchestration** — no business logic in `+page.svelte`
- All data comes from `+page.server.ts` calling functions in `$lib/server/` or `$lib/modules/`
- Always include `<SEO>` component with `title` and `description`
- Always call `setCacheHeaders(setHeaders)` in server load functions
- Use layout components (`.container`, `.prose-container`) for consistent spacing
- Dynamic routes use bracket notation: `[slug]`, `[type]`

## Checklist

- [ ] Route directory created
- [ ] `+page.server.ts` with `setCacheHeaders` (if needed)
- [ ] `+page.svelte` with `<SEO>` component
- [ ] Page uses container/layout utilities
- [ ] No business logic in page component
- [ ] `bun check` passes
