# Garden Vanities — Project Context

> Reference file for AI assistants. Read this before writing any code.

---

## Identity

- **Purpose:** Intellectual platform for sharing knowledge (digital garden), with future monetization potential based on audience response.
- **Audience:** Men seeking knowledge, insights, skills, and cultured entertainment.
- **Nature:** Personal project with commercial potential.
- **Aesthetic:** Retro-futurism, bento grid, minimalism.

---

## Language & Tone

| Context | Language |
|---------|----------|
| UI / User-facing text | pt-BR (future: English support) |
| Code (variables, functions, files) | English (US) |
| Comments | Avoid entirely. Only when absolutely necessary |
| Commit messages | Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.) |
| Communication tone | Objective, erudite, never informal or colloquial |

---

## Design System

### Visual Identity
- **Mood:** Retro-futuristic, minimalist
- **Priority:** Dark mode first, light mode supported
- **Animation level:** Moderate — purposeful micro-interactions, no gratuitous effects
- **Icons:** Prefer straight/square aesthetic. Any icon library allowed if consistent. Currently using Lucide.

### Typography
- **Body/Article:** Variable font, woff2 format required
- **Monospace:** Geist Mono (Vercel) or similar
- **UI/Headings:** Currently using a sans-serif (open to change if variable + woff2)

### Colors
- **Rule:** Always use CSS tokens (`--color-*`). No hardcoded hex/oklch in components.
- **Token location:** `src/styles/tokens/`
- **Kind tokens:** `--color-kind-note`, `--color-kind-essay`, etc.
- **Ripeness tokens:** `--color-ripeness-seed`, `--color-ripeness-root`, `--color-ripeness-fruit`

---

## Tech Stack

### Mandatory (do not replace)
- **Framework:** SvelteKit (latest)
- **Styling:** Tailwind CSS (latest)
- **Runtime/Package manager:** Bun (latest)
- **Image CDN:** Cloudinary
- **Deployment:** Vercel (`@sveltejs/adapter-vercel`)

### Prohibited
- Libraries that duplicate native browser/framework APIs
- Manual DOM manipulation outside Svelte
- `moment.js`, `jQuery`, or heavy utility libraries
- Prefer `date-fns` (tree-shakeable) over monolithic date libs

---

## Architecture

### Directory Structure (Domain-Driven)

```
src/
├── lib/
│   ├── ui/              # Dumb, agnostic UI Kit (Button, Card, Badge...)
│   ├── domains/         # Core business logic by bounded context
│   │   ├── garden/      # Posts, markdown, ripeness
│   │   ├── taxonomy/    # Tags, kinds, series, sets
│   │   └── [future]/    # commerce/, auth/, etc.
│   ├── server/          # Server-only infra (DB, API keys, security)
│   └── utils/           # Pure, universal utility functions
├── routes/              # Thin orchestration layer only
└── styles/              # Design tokens, base styles, utilities
content/                 # Raw Markdown/MDX at project root (NOT in src/)
```

> **Note:** Current structure uses `src/lib/modules/` — migration to `src/lib/domains/` is planned.

### Rules
- **Routes are thin:** `+page.server.ts` only orchestrates `load`/`actions`. No business logic in `+page.svelte`.
- **Barrel files:** Only in reusable component modules. Never in logic folders or routes.
- **Content files:** Keep at project root (`content/`) to separate data from code.

---

## Component Patterns

### Framework
- **Svelte 5 Runes only** (`$state`, `$derived`, `$props`, `$effect`)
- Explicit `interface Props` with `$props<Props>()` destructuring
- Prefer **Snippets** (composition) for structural components
- Prefer **props** (configuration) for atomic UI components

### Styling
- **Default:** Tailwind inline classes on elements
- **`<style>` allowed only for:**
  - Complex CSS animations (`@keyframes`)
  - Dynamic content styling via `:global()` selectors (Markdown)
  - Complex `calc()` / `oklch()` computations beyond Tailwind
  - Scrollbar customization, `::-webkit-*` pseudo-elements

### Quality
- **SRP:** Split when managing multiple independent concerns
- Extract logic to `.svelte.ts` files when complexity grows
- **Accessibility:** Semantic HTML first, `aria-labels` only when no visible text, full keyboard navigation with subtle focus states
- Use layout components (`Container`, `Grid`, `Section`) for consistency

---

## Content Model

### Content Types
| Type | Purpose |
|------|---------|
| **Posts** | Core content — articles, notes, essays |
| **Series** | Ordered groups of related posts |
| **Sets** | Unordered thematic collections |
| **Kinds** | Dynamic post type definitions (note, essay, tutorial, thought...) |
| **Library** | Consumed references (books, videos, courses) cited in posts |
| **Pages** | Static page content (editable without code changes) |

### Ripeness (Visibility Rules)
| Level | Name | Behavior |
|-------|------|----------|
| `seed` | Semente | Author page only; general annotations |
| `root` | Rascunho | Not listed; accessible only via direct link/backlink |
| `fruit` | Maduro | Publicly listed and visible |

### Tag Rules
- Always **singular** form
- Always **lowercase**
- No abbreviations — write in full
- No special characters or accents
- Language: Portuguese, except internationally recognized terms in their original language
- Compound names: separate with **hyphen** (`inteligencia-artificial`)

### Schema
- No formal schema exists yet — **create one** for validation when working with content types.

---

## Code Standards

### TypeScript
- **Strict mode** mandatory
- **`any` is prohibited** — use `unknown` instead
- Infer types for local variables; explicit types only at boundaries (functions, props, APIs)
- **Error handling:** Result Pattern (`{data, error}`) in `$lib` logic; `error()` in `load` functions; `fail()` in Actions

### Naming Conventions
| Artifact | Convention | Example |
|----------|-----------|---------|
| Directories, routes, assets | `kebab-case` | `post-parser.ts` |
| Components, types, classes | `PascalCase` | `ArticleCard.svelte` |
| Functions, variables | `camelCase` | `getPostBySlug()` |
| Global constants | `SCREAMING_SNAKE_CASE` | `KIND_LABELS` |

### Import Order
1. Framework & external NPM libraries
2. Project aliases (`$lib/...`)
3. Relative local files
4. Type definitions (`import type`)

### Constants
- Keep **close to usage** by default
- Centralize only when shared across multiple modules or representing global config

---

## Performance & Deploy

### Rendering Strategy
- **Default:** `prerender = true` globally (SSG)
- **Exceptions:** Disable prerender for routes needing real-time processing
- **Articles:** ISR via `stale-while-revalidate` cache headers for content updates without full rebuilds

### Targets
- Lighthouse Score **> 90** in all categories
- Initial JavaScript **< 50kB** gzipped
- LCP **< 2.5s**
- Preload critical fonts via `<svelte:head>`
- Minimize CLS

### Cache Strategy
- Use `setCacheHeaders()` utility from `$lib/server/utils.ts`
- ISR pattern: `max-age=3600, s-maxage=86400` (default)

---

## Quality & Testing

### Validation Pipeline (in order)
```bash
bun check    # Type checking + Svelte validation
bun lint     # ESLint consistency
bun test     # Vitest unit tests
```

### Testing Stack
- **Unit/Component:** Vitest (via Bun)
- **E2E:** Playwright
- **CI/CD:** GitHub Actions → Vercel

### Linting Rules (non-negotiable)
- `@typescript-eslint/recommended` with no-`any`
- Svelte ESLint plugin
- Mandatory Promise handling (no floating promises)
- Restrict `{@html}` usage

---

## Security

- **Never commit secrets** (API keys, tokens, credentials, `DATABASE_URL`)
- `.env` must be in `.gitignore`
- `.env.example` is the single source of truth for required env vars
- If a secret is accidentally committed: **invalidate immediately**, clean git history with BFG Repo-Cleaner
- No auth system yet

---

## AI Behavior Rules

### Autonomy
- **Full autonomy** for implementation, refactoring, and UI adjustments
- Allowed to take reversible technical risks (Git-backed)
- **Stop and ask** only for: destructive actions, core component API changes, deploy infrastructure changes
- After autonomous cycles, provide a concise summary of risk decisions taken

### Code Generation
- **Complete solutions** for new files, structural components, system configs
- **Incremental changes** for refactoring existing files or small logic adjustments
- Always clearly indicate insertion points for incremental edits

### Component Reuse
- **Strictly reuse existing components** for visual consistency
- Extend existing components (new props/snippets) before creating new ones
- New components only when functionality is truly novel

### Tech Debt
- **Fix proactively** if low-impact (dead code, type refinement, local perf)
- **Signal only** (with proposal) for structural refactors or architecture changes — wait for author approval

### Documentation
- Document the "why" in PRs — include considered alternatives and scalability impact
- Commits: direct and atomic (Conventional Commits)
- Dense explanations go in PR descriptions, not commit messages
