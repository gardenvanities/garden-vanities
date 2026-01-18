# 🏗️ Architecture & Routing Rules

This document outlines the structural standards for the **Garden of Vanities** project. It complements the [Styling Rules](./STYLING_RULES.md).

---

## 1. SvelteKit Routing (`src/routes`)

We follow a strict **Clean Architecture** approach tailored for SvelteKit.

### 🧠 separation of Concerns: UI vs. Data

**Rule**: Logic and UI must be strictly separated.

- **`+page.server.ts` / `+layout.server.ts` (The Brain)**:
  - **Responsibilities**: Database calls, API fetches, Form Actions, Data/Validation logic.
  - **Output**: Returns a type-safe `props` object to the UI.
  - **Never**: Do not write heavy logic inside `.svelte` `<script>` blocks.

- **`+page.svelte` (The Face)**:
  - **Responsibilities**: Receiving `data`, rendering UI, managing _transient_ state (open/close toggles, form inputs).
  - **Usage**:

    ```svelte
    <script lang="ts">
    	let { data } = $props(); // Svelte 5 Props
    </script>

    <h1>{data.post.title}</h1>
    ```

### 📍 Flat Route Structure

**Rule**: Keep the routing tree as flat as reasonably possible.

- Avoid deep nesting like `src/routes/app/dashboard/users/settings/...`.
- Prefer composed URLs where logical, but don't over-engineer hierarchy if it doesn't match the URL structure.
- Current approved structure is a hybrid:
  - `/posts`, `/series`, `/sets` (Content Types)
  - `/explore` (Feature)
  - `/api` (Backend endpoints)

### 📦 Colocated Components

**Rule**: Components specific to a single route belong _in_ that route.

- **Why**: Keeps `src/lib/components` clean for _truly_ reusable UI (Buttons, Cards, Nav).
- **Pattern**: Create a `_components` folder inside the route directory.
- **Example**:
  ```text
  src/routes/
  ├── dashboard/
  │   ├── _components/    <-- Dashboard specific widgets
  │   │   ├── AnalyticsChart.svelte
  │   │   └── UserList.svelte
  │   ├── +page.svelte
  │   └── +page.server.ts
  ```

---

## 2. Type Safety

**Rule**: Always use SvelteKit generated types.

- **Files**: `import type { PageServerLoad, Actions } from './$types';`
- **Props**: `let { data }: { data: PageData } = $props();`

---

## 3. Mental Model

Treat `src/routes` files as the **wiring** of the application. They connect the **Data Layer** (Logic) to the **Design System** (Components/Styles).
