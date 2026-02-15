---
description: Scaffold a new Markdown post with correct frontmatter
---

# Create Post

Scaffold a new post with the correct frontmatter schema.

## Inputs

1. **Title** (required) — post title in pt-BR
2. **Kind** (required) — `note`, `essay`, `tutorial`, `thought`, or custom
3. **Ripeness** (default: `seed`) — `seed`, `root`, or `fruit`
4. **Tags** (required) — array following tag rules
5. **Set** (optional) — existing set slug
6. **Series** (optional) — existing series slug + order number

## Steps

### 1. Generate the slug

Convert the title to `kebab-case`:
- Lowercase
- Remove accents and special characters
- Replace spaces with hyphens
- Max 60 characters

Example: `"Deep Work: A Ciência da Concentração"` → `deep-work-ciencia-concentracao`

### 2. Create the file

Create `src/content/posts/{slug}.md` with this template:

```markdown
---
slug: {slug}
title: "{title}"
subtitle: ""
summary: ""

ripeness: "{ripeness}"

kind: "{kind}"
set: {set or remove line}
tags: [{tags as quoted comma-separated}]

cover:
  url: ""
  alt: ""
  caption: ""

series:
  name: {series or remove block}
  order: {order or remove block}

publishedAt: {today YYYY-MM-DD}
updatedAt:

seo:
  title: ""
  description: ""
---

{content placeholder}
```

### 3. Validate tag rules

- All tags singular, lowercase, no accents
- No abbreviations
- Portuguese except internationally recognized terms
- Compound names with hyphen

### 4. Verify kind exists

Check that a matching file exists at `src/content/kinds/{kind}.md`. If not, offer to create it.

### 5. Verify set/series exists (if provided)

Check `src/content/sets/{set}.md` or `src/content/series/{series}.md` exists.
