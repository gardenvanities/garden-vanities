# AGENTS.md

> Universal context for AI coding agents. For detailed project documentation, see `.agent/context.md`.

## Project

**Garden Vanities** — Intellectual platform (digital garden) for sharing knowledge.
Aesthetic: layered dark editorial minimalism (inspired by layers.to), modular grid. Tone: objective, erudite.

## Stack

- **Framework:** SvelteKit (latest) with Svelte 5 Runes
- **Styling:** Tailwind CSS v4 (inline classes, no `<style>` unless technically necessary)
- **Runtime:** Bun
- **Deploy:** Vercel (`@sveltejs/adapter-vercel`)
- **Images:** Cloudinary CDN
- **Icons:** Lucide (straight/square aesthetic)

## Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server
bun check            # Type checking + Svelte validation
bun lint             # ESLint
bun test             # Vitest
bun build            # Production build
```

## Architecture (Domain-Driven)

```
src/
├── lib/
│   ├── ui/              # Dumb UI Kit (Button, Card, Badge...). Props only, no business logic.
│   ├── modules/         # Business domains (garden/, taxonomy/, series/)
│   │   └── [domain]/
│   │       ├── components/   # Smart components for this domain
│   │       ├── types.ts      # Domain types
│   │       ├── services.ts   # Domain logic
│   │       └── constants.ts  # Domain constants
│   ├── server/          # Server-only (DB, API keys, content loading)
│   ├── shared/          # Pure universal utilities (date, merge-class)
│   ├── stores/          # Svelte stores (ui, scroll)
│   └── core/            # App shell (Sidebar, FloatingNav, CommandPalette)
├── routes/              # Thin load/actions only. No business logic.
├── styles/
│   ├── tokens/          # Design tokens (colors, spacing, typography, motion)
│   └── utilities.css    # Utility classes (.container, .glass, .flow)
├── content/             # Markdown content (posts, series, sets, kinds, library)
```

## Code Style

- **Language:** Code in English (US). UI text in pt-BR.
- **No comments** unless absolutely necessary.
- **TypeScript strict.** `any` is prohibited — use `unknown`.
- **Naming:** `kebab-case` for files/dirs, `PascalCase` for components/types, `camelCase` for functions/vars, `SCREAMING_SNAKE_CASE` for global constants.
- **Import order:** framework/NPM → `$lib/` aliases → relative → `import type`.
- **Error handling:** Result Pattern (`{data, error}`) in `$lib`; `error()` in `load`; `fail()` in Actions.

## Component Rules

- Svelte 5 Runes only (`$state`, `$derived`, `$props`, `$effect`).
- Explicit `interface Props` with `$props()` destructuring.
- Prefer Snippets (composition) for layout; props for atomic UI.
- Colors from CSS tokens (`--color-*`). Never hardcoded hex in components.
- Tailwind canonical classes are mandatory when equivalent exists (`md:w-70` over `md:w-[17.5rem]`, `aspect-4/3` over `aspect-[4/3]`).
- Reuse existing components. Extend before creating new. New only when truly novel.
- `<style>` only for: `@keyframes`, `:global()`, complex `calc()`/`oklch()`, scrollbar/pseudo-element styling.
- Design system source of truth for AI agents: `.agent/design-system.md`.

## UI Definition of Done

- Uses only design-system tokens/utilities from `.agent/design-system.md`.
- No hardcoded color values in components.
- Follows the official visual language: deep dark surfaces, subtle borders, low-glare contrast, restrained accent.
- Interactive elements implement: `default`, `hover` (desktop), `focus-visible`, `active`, `disabled` (when applicable).
- Focus indicator is visible and accessible.
- Depth stays within official levels `0..3` (no layer above 3).
- Motion is functional only (no decorative animation).
- Light and dark modes keep semantic parity.

## Content Model

| Type | Purpose |
|------|---------|
| Posts | Core articles (note, essay, tutorial, thought) |
| Series | Ordered post groups |
| Sets | Thematic collections |
| Kinds | Dynamic post type definitions (`src/content/kinds/`) |
| Library | Consumed references (books, videos) |

### Ripeness (visibility)
- `seed` (Semente): Author page only
- `root` (Rascunho): Not listed, accessible via direct link/backlink
- `fruit` (Maduro): Publicly listed

### Tag Rules
Singular, lowercase, no accents/special chars, Portuguese (except internationally recognized terms), compound names with hyphen.

## Performance Targets

- Lighthouse > 90 all categories
- Initial JS < 50kB gzipped
- LCP < 2.5s
- Default `prerender = true` (SSG), ISR via `stale-while-revalidate` for articles

## Security

- Never commit secrets. Use `.env` (local) + Vercel dashboard (prod).
- `.env.example` is source of truth for required env vars.

## Git Conventions

### Branch Naming
- `feat/{description}` — New features
- `fix/{description}` — Bug fixes
- `refactor/{description}` — Code restructuring
- `chore/{description}` — Tooling, config, dependencies
- `content/{description}` — Content-only changes

### Commit Format (Conventional Commits)
```
<type>(<scope>): <description>

feat(garden): add ripeness filter to explore page
fix(seo): correct canonical URL for series pages
refactor(ui): migrate Badge to Svelte 5 runes
chore(deps): update SvelteKit to 2.x
content(posts): add deep-work article
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `content`, `style`, `perf`, `test`, `docs`
**Scope:** optional, use domain name (`garden`, `ui`, `seo`, `core`, `posts`)

### Rules
- Commits must be atomic (one logical change per commit)
- Description in English, lowercase, imperative mood, no period
- PR descriptions include rationale, alternatives considered, and impact

## Forbidden Patterns

These patterns must NEVER appear in production code:

| Pattern | Reason | Alternative |
|---------|--------|-------------|
| `console.log` | Debug artifact | Remove entirely, or use proper logging |
| `any` type | Breaks type safety | Use `unknown`, specific type, or generic |
| `{@html variable}` without sanitization | XSS vulnerability | Sanitize input or use structured rendering |
| `document.querySelector` | Bypasses Svelte reactivity | Use `bind:this` or Svelte refs |
| `document.getElementById` | Same as above | Use `bind:this` |
| `innerHTML` | XSS risk + bypasses Svelte | Use `{@html}` with sanitization if needed |
| `eval()` | Code injection risk | Never use |
| `var` keyword | Function-scoped, error-prone | Use `const` or `let` |
| `export let` | Legacy Svelte 4 | Use `$props()` |
| `$:` reactive | Legacy Svelte 4 | Use `$derived` or `$effect` |
| `$$props` / `$$restProps` | Legacy Svelte 4 | Use spread in `$props()` |
| `@apply` in CSS | Breaks Tailwind tree-shaking | Use inline utility classes |
| Hardcoded color values | Bypasses design system | Use CSS token classes |
| Arbitrary Tailwind value when canonical utility exists | Preventable style drift/noise | Use canonical utility class |
| `setTimeout` for animations | Fragile, not frame-synced | Use CSS transitions or Svelte transitions |
| `!important` in CSS | Specificity hack | Fix the cascade instead |

## AI Behavior

- Full autonomy for implementation, refactoring, UI adjustments.
- Stop and ask only for: destructive actions, core API changes, deploy infra changes.
- Fix low-impact tech debt proactively. Signal structural refactors with proposal.
- Complete solutions for new files; incremental for existing code edits.
- Strictly reuse existing components before creating new ones.
- Provide risk summary after autonomous cycles.
- For conceptual UI/UX decisions, analysis, and feature ideation, use `.agent/skills/ui-ux-advisor/SKILL.md`.
