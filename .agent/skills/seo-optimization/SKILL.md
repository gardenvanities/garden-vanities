---
name: seo-optimization
description: SEO implementation guide — meta tags, Open Graph, structured data, and best practices
---

# SEO Optimization

## SEO Component

The project uses a centralized `SEO.svelte` component at `src/lib/core/seo/SEO.svelte`. Every page must include it.

### Props

```typescript
interface Props {
  title: string;              // Page title (appended with " | Garden of Vanities")
  description?: string;       // Meta description (default: site tagline)
  image?: string;             // Cloudinary public ID for OG image
  type?: "website" | "article"; // OpenGraph type
  publishedAt?: string;       // ISO date for articles
  updatedAt?: string;         // ISO date for articles
  author?: string;            // Author name (default: "Stephan Carvalho")
  noindex?: boolean;          // Set true for non-indexable pages
}
```

### Usage in Pages

```svelte
<script>
  import SEO from "$lib/core/seo/SEO.svelte";
</script>

<!-- Regular page -->
<SEO title="Explorar" description="Navegue por todos os artigos do jardim." />

<!-- Article page -->
<SEO
  title={post.title}
  description={post.seo?.description || post.summary}
  image={post.cover?.url}
  type="article"
  publishedAt={post.publishedAt}
  updatedAt={post.updatedAt}
/>
```

## What SEO.svelte Generates

For every page:
- `<title>` with site name suffix
- `<meta name="description">`
- `<link rel="canonical">` (auto-generated from current URL)
- `<meta name="robots">` (index/noindex)
- Theme color meta tags (light/dark)
- **OpenGraph** tags (og:type, og:title, og:description, og:image, og:url, og:site_name, og:locale)
- **Twitter Card** tags (summary_large_image)
- **JSON-LD** structured data (WebSite or BlogPosting schema)

For articles specifically:
- `article:published_time` and `article:modified_time`
- `article:author`
- BlogPosting schema with headline, dates, and author

## OG Image Generation

The component auto-generates OG images:
1. If `image` prop provided → uses Cloudinary URL (1200×630, fill crop)
2. If no image → generates via `/og` endpoint with title + description

## SEO Checklist for New Pages

- [ ] Include `<SEO>` component with `title` and `description`
- [ ] Use `type="article"` for content pages with dates
- [ ] Provide `image` prop when cover image available
- [ ] Set `noindex={true}` for draft/internal pages
- [ ] Ensure `publishedAt` and `updatedAt` are passed for articles

## SEO Checklist for Posts

Posts have an optional `seo` field in frontmatter that overrides defaults:

```yaml
seo:
  title: "Custom SEO Title"           # Falls back to post title
  description: "Custom SEO desc"      # Falls back to post summary
```

## Content Best Practices

- **Title tag:** Max 60 characters. Descriptive and unique per page.
- **Meta description:** 120-155 characters. Compelling summary.
- **Heading hierarchy:** Single `<h1>` per page, sequential `<h2>`→`<h3>`.
- **Semantic HTML:** Use `<article>`, `<section>`, `<nav>`, `<aside>`, `<main>`.
- **Image alt text:** Always descriptive. Required in cover frontmatter.
- **Internal linking:** Use relative links between related posts.
- **Canonical URLs:** Auto-handled by SEO component.

## Performance Impact on SEO

- LCP < 2.5s (prerender + font preload)
- CLS minimized (font-display: swap, explicit image dimensions)
- FID < 100ms (minimal JS on initial load)

## robots.txt and Sitemap

- Sitemap should be auto-generated for all `fruit` ripeness posts
- `root` ripeness posts should have `noindex`
- `seed` ripeness posts should have `noindex`
