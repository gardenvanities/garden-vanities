# Architecture & Responsibility Rules

## Directory Structure & Responsibilities

### 1. `src/routes/` (The Application Shell)

- **Role**: Entry points and data orchestration.
- **Rules**:
  - Keep `+page.svelte` files clean. They should primarily compose components from `$lib/components`.
  - Use `+page.server.ts` for data fetching, form actions, and complex business logic.
  - Avoid putting complex UI logic inside routes; move it to components or state modules.

### 2. `src/lib/components/` (UI Layer)

Organize components by their scope and reuse:

- **`ui/` (Primitives)**:
  - Examples: `Button.svelte`, `Input.svelte`, `Card.svelte`.
  - Rules: Stateless where possible. Highly reusable. Focused on design system tokens. No knowledge of "Posts" or "Garden" domain.
- **`core/` (Infrastructure)**:
  - Examples: `Navbar.svelte`, `Footer.svelte`, `ThemeToggle.svelte`.
  - Rules: Components that define the app's frame and global functionality.
- **`garden/` (Domain-Specific)**:
  - Examples: `PostCard.svelte`, `RipenessBadge.svelte`, `BacklinkSection.svelte`.
  - Rules: Components that understand the Business Logic/Domain (Digital Garden).
- **`layout/` (Patterns)**:
  - Examples: `Section.svelte`, `Container.svelte`, `Grid.svelte`.
  - Rules: Used for structural consistency across pages.

### 3. `src/lib/server/` (Protected Logic)

- **Role**: Code that **MUST NOT** reach the browser.
- **Rules**:
  - Handle file system access (e.g., reading Markdown files).
  - Use private environment variables here.
  - SvelteKit ensures this folder is never bundled into the client build.

### 4. `src/lib/utils/` (Shared Logic)

- **Role**: Pure functions and helpers accessible by both client and server.
- **Rules**:
  - Keep functions pure (same input = same output).
  - Examples: `date-formatter.ts`, `cloudinary-url-builder.ts`, `class-merger.ts`.
  - Avoid side-effects here.

### 5. `src/lib/types/` (Definitions)

- **Role**: Centralized TypeScript definitions.
- **Rules**:
  - Favor `interface` for data objects (frontmatter, posts).
  - Favor `type` for unions or aliases.

### 6. `src/lib/stores/` (Global State)

- **Role**: Application-wide state.
- **Rules**:
  - Use Svelte 5 `$state` objects in simple `.ts` files instead of legacy `writable` stores where possible.

## Data Flow Rules

- **Server to Client**: Data fetched in `+page.server.ts` should be clean and ready for display. Do not send raw markdown strings if only a title is needed.
- **Markdown as Source of Truth**: All "content" lives in `src/content`. Components should not have hardcoded article text.
- **Dependency Direction**:
  - `routes` → `components` + `server/utils`
  - `garden components` → `ui components`
  - `ui components` → **NEVER** depend on domain logic.
