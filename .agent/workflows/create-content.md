---
description: Scaffold a new content file (series, set, kind, or library entry)
---

# Create Content

Scaffold any non-post content type following project schemas.

## Inputs

1. **Type** (required) — `series`, `set`, `kind`, or `library`
2. **Subtype** (required for library) — `book`, `article`, `film`, `music`, `research`, `series-tv`
3. **Title** (required)

## Templates

### Series (`src/content/series/{slug}.md`)

```markdown
---
slug: {slug}
title: "{title}"
description: "{description}"
status: ongoing
cover:
  url: ""
  alt: ""
resources: []
nextSuggestedSeries: []
publishedAt: {today YYYY-MM-DD}
---

{description body}
```

### Set (`src/content/sets/{slug}.md`)

```markdown
---
slug: {slug}
title: "{title}"
description: "{description}"
cover:
  url: ""
  alt: ""
relatedSets: []
---

{description body}
```

### Kind (`src/content/kinds/{slug}.md`)

```markdown
---
slug: {slug}
title: "{label in pt-BR}"
color: "var(--color-kind-{slug})"
description: "{what this kind represents}"
---
```

After creating a new kind, update `KIND_LABELS` in `src/lib/modules/garden/constants.ts`.

### Library (`src/content/library/{subtype}/{slug}.md`)

```markdown
---
slug: {slug}
type: {subtype}
title: "{title}"
subtitle: ""
summary: ""
status: want
rating:
cover:
  url: ""
  alt: ""
tags: []

startedAt:
completedAt:
affiliateLink:
externalLink:
createdAt: {today YYYY-MM-DD}

# Type-specific fields (books):
author: ""
publisher: ""
year:
pages:
language: "pt"
genres: []
format: ebook
---

{notes body}
```

## Validation

- Slug must be kebab-case and unique within its content type
- Tags must follow tag rules (singular, lowercase, no accents)
- Referenced slugs (relatedSets, nextSuggestedSeries) must exist
