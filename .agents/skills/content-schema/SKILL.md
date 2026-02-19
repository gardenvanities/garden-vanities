---
name: content-schema
description: Frontmatter schemas for all content types — posts, series, sets, kinds, library, authors
---

# Content Schema Reference

All content lives in `src/content/` as Markdown files with YAML frontmatter.

## Posts (`src/content/posts/`)

The core content type. Filename must be `kebab-case.md` matching the slug.

```yaml
---
slug: deep-work-ciencia-concentracao        # Required. URL slug, kebab-case
title: "Deep Work: A Ciência da Concentração" # Required. Display title
subtitle: "Estratégias para atingir..."       # Optional. Shown below title
summary: "Análise do conceito de..."          # Required. Used in cards and SEO fallback

ripeness: "fruit"                             # Required. "seed" | "root" | "fruit"

kind: "tutorial"                              # Required. Must match a slug in content/kinds/
set: produtividade                            # Optional. Must match a slug in content/sets/
tags: ["productivity", "neuroscience"]        # Required. Array, singular, lowercase, no accents

cover:                                        # Optional
  url: "cover/b"                              #   Cloudinary public ID
  alt: "Description of image"                 #   Required if cover present
  caption: "Caption text"                     #   Optional

series:                                       # Optional
  name: filosofia-do-codigo                   #   Must match a slug in content/series/
  order: 2                                    #   Position in series (1-indexed)

publishedAt: 2026-01-09                       # Required. ISO date (YYYY-MM-DD)
updatedAt:                                    # Optional. ISO date

seo:                                          # Optional (falls back to title/summary)
  title: "Custom SEO title"
  description: "Custom meta description"
---
```

### Ripeness Rules
| Value | Label | Visibility |
|-------|-------|------------|
| `seed` | Semente | Author page only |
| `root` | Rascunho | Not listed, accessible via direct link/backlink |
| `fruit` | Maduro | Publicly listed |

### Tag Rules
- Singular form (`algoritmo`, not `algoritmos`)
- Lowercase, no accents (`inteligencia-artificial`, not `Inteligência Artificial`)
- No abbreviations
- Portuguese, except internationally recognized terms (`machine-learning`, `deep-work`)
- Compound names with hyphen

---

## Series (`src/content/series/`)

Ordered groups of related posts.

```yaml
---
slug: filosofia-do-codigo                     # Required. kebab-case
title: "Filosofia do Código"                  # Required
description: "Reflexões sobre a arte..."      # Required
status: ongoing                               # Required. "ongoing" | "completed" | "archived" | "draft"
cover:                                        # Optional
  url: "card/a"
  alt: "Description"
resources:                                    # Optional. External references
  - title: "Clean Code - Robert Martin"
    url: "https://..."
    type: link                                #   "link" | "video" | "book"
nextSuggestedSeries:                          # Optional. Array of series slugs
  - modern-web-frameworks
publishedAt: 2024-04-01                       # Required
---
```

---

## Sets (`src/content/sets/`)

Unordered thematic collections. Posts reference their set via the `set` field.

```yaml
---
slug: design                                  # Required. kebab-case
title: "Design"                               # Required
description: "Exploração de princípios..."    # Required
cover:                                        # Optional
  url: "cover/e"
  alt: "Description"
relatedSets:                                  # Optional. Array of set slugs
  - engenharia-software
---
```

---

## Kinds (`src/content/kinds/`)

Dynamic post type definitions.

```yaml
---
slug: note                                    # Required. Lowercase, must match kind values in posts
title: Nota                                   # Required. pt-BR display label
color: "var(--color-kind-note)"               # Required. Use a semantic token reference
description: Notas rápidas, observações...    # Required. Shown as tooltip/description
---
```

### Current Kinds
| Slug | Title | Color |
|------|-------|-------|
| `note` | Nota | `var(--color-kind-note)` |
| `essay` | Ensaio | `var(--color-kind-essay)` |
| `tutorial` | Tutorial | `var(--color-kind-tutorial)` |
| `thought` | Reflexão | `var(--color-kind-thought)` |

New kinds can be created freely by adding a new `.md` file.

---

## Library (`src/content/library/[type]/`)

References to consumed content. Organized by type subdirectory.

```yaml
---
slug: deep-work-cal-newport                   # Required. kebab-case
type: book                                    # Required. "book" | "article" | "film" | "music" | "research" | "series-tv"
title: "Deep Work: Rules for Focused..."      # Required
subtitle: "Regras para o Sucesso..."          # Optional. pt-BR translation
summary: "Um guia prático sobre..."           # Required
status: completed                             # Required. "reading" | "completed" | "abandoned" | "want"
rating: 5                                     # Optional. 1-5
cover:                                        # Optional
  url: "library/books/deep-work"
  alt: "Cover description"
tags: ["productivity", "focus"]               # Required. Same rules as posts

startedAt: "2025-12-01"                       # Optional. ISO date
completedAt: "2025-12-15"                     # Optional. ISO date
affiliateLink: "https://amzn.to/..."          # Optional
externalLink: "https://..."                   # Optional
createdAt: "2025-12-15"                       # Required

# Book-specific fields:
author: "Cal Newport"                         # Required for books
publisher: "Grand Central Publishing"         # Optional
year: 2016                                    # Optional
pages: 296                                    # Optional
language: "en"                                # Optional. ISO 639-1
genres: ["self-help", "productivity"]         # Optional
format: ebook                                 # Optional. "physical" | "ebook" | "audiobook"
---
```

### Library Type Directories
| Directory | Content |
|-----------|---------|
| `books/` | Books |
| `articles/` | Articles / blog posts |
| `films/` | Movies |
| `music/` | Albums / songs |
| `research/` | Academic papers |
| `series-tv/` | TV series |

---

## Authors (`src/content/authors/`)

```yaml
---
name: Stephan Carvalho                        # Required
nick: gardenvanities                          # Required. Username
avatar: avatar/kira                           # Required. Cloudinary public ID
role: Intelectual                             # Required
social:                                       # Optional
  twitter: https://twitter.com/gardenvanities
  instagram: https://instagram.com/gardenvanities
  youtube: https://youtube.com/gardenvanities
  github: https://github.com/gardenvanities
  tiktok: https://tiktok.com/gardenvanities
slug: stephan                                 # Required
---
```
