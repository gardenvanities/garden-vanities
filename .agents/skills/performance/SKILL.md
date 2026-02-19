---
name: performance
description: Performance optimization guide — lazy loading, image optimization, bundle analysis, and Core Web Vitals
---

# Performance Optimization

## Targets

| Metric | Target |
|--------|--------|
| Lighthouse Score | > 90 all categories |
| Initial JS | < 50kB gzipped |
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |

## Rendering Strategy

### Default: SSG (Static Site Generation)
```typescript
// src/routes/+layout.ts
export const prerender = true;
```

All pages are pre-rendered by default. Disable per-route when needed:
```typescript
// src/routes/api/[endpoint]/+server.ts
export const prerender = false;
```

### ISR for Content Pages
Use `stale-while-revalidate` cache headers for article pages:

```typescript
import { setCacheHeaders } from "$lib/server/utils";

export const load: PageServerLoad = async ({ setHeaders }) => {
  setCacheHeaders(setHeaders); // max-age=3600, s-maxage=86400
  // ...
};
```

## Image Optimization

### Cloudinary CDN
All images go through Cloudinary. Use the shared utility:

```typescript
import { buildCloudinaryUrl } from "$lib/shared/cloudinary";

const url = buildCloudinaryUrl("cover/b", {
  width: 800,
  height: 450,
  crop: "fill",
  quality: "auto",
  format: "auto"   // Serves WebP/AVIF when supported
});
```

### Image Best Practices
- Always specify `width` and `height` attributes to prevent CLS
- Use `loading="lazy"` for below-the-fold images
- Use `fetchpriority="high"` for hero/LCP images
- Request `format: "auto"` from Cloudinary (auto WebP/AVIF)
- Use responsive sizes: serve appropriate resolution per viewport

## Font Optimization

### Requirements
- Variable font format only
- woff2 encoding (smallest file size)
- Preload critical fonts in `<svelte:head>`:

```svelte
<svelte:head>
  <link
    rel="preload"
    href="/fonts/geist-mono.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</svelte:head>
```

### Rules
- Use `font-display: swap` to prevent invisible text
- Limit to 2-3 font families maximum
- Subset fonts to used characters when possible

## JavaScript Optimization

### Bundle Size
- Import only what you need (named imports, not `*`)
- Prefer tree-shakeable libraries (`date-fns` over `moment`)
- Use dynamic imports for heavy components:

```svelte
{#await import("./HeavyComponent.svelte") then module}
  <module.default />
{/await}
```

### Code Splitting
SvelteKit handles route-based code splitting automatically. Additional strategies:
- Lazy load modals and popovers
- Defer non-critical third-party scripts
- Use `intersection observer` for components that appear on scroll

## Component Performance

### Avoid Unnecessary Reactivity
```typescript
// Bad: recalculates every render
const items = $derived(expensiveFilter(allItems));

// Good: only recalculates when dependencies change
const items = $derived.by(() => {
  if (!searchQuery) return allItems;
  return expensiveFilter(allItems, searchQuery);
});
```

### List Rendering
- Always use keyed `{#each}` blocks: `{#each items as item (item.id)}`
- Virtualize long lists (> 100 items)

## CSS Performance

- Tailwind CSS v4 tree-shakes unused classes automatically
- Avoid `@apply` in component styles (breaks tree-shaking)
- Use CSS `will-change` sparingly and only for animated elements
- Prefer `transform` and `opacity` for animations (GPU-accelerated)

## Monitoring

### Build Analysis
```bash
bun build                    # Check output size
npx vite-bundle-visualizer   # Visual bundle analysis
```

### Lighthouse
```bash
npx lighthouse https://gardenvanities.vercel.app --output html
```

### Core Web Vitals
- Monitor via Vercel Analytics (automatic)
- Check Google Search Console for field data
