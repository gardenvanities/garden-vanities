# 🎨 Styling Guidelines & Architecture

This document establishes the definitive rules and standards for styling within the **Garden of Vanities** project. Ideally, this document should be the source of truth for all future development to ensure consistency, scalability, and maintainability.

---

## 1. Core Philosophy

1.  **Utility-First Implementation**: Tailwind CSS is the primary engine. We write utility classes in HTML over creating new CSS classes.
2.  **Strict Token Usage**: All colors, spacing, and typography MUST come from our defined Design Tokens. **Never** usage raw hex codes (e.g. `#000000`, `#ff5500`) or arbitrary pixels (e.g. `13px`) in component code.
3.  **Co-location**: Styles for a component belong **inside the component file** (`.svelte`), not in global stylesheets.
4.  **Semantic Naming**: Use _what it is_ (e.g. `text-primary`, `bg-surface`) rather than _what it looks like_ (e.g. `blue-text`, `bg-gray`).

---

## 2. Architecture Overview

Our styling architecture consists of three layers:

### Layer 1: Primitives (`src/styles/tokens/1-primitives/`)

- **What**: The raw atoms of our design system.
- **Examples**: `--gray-900`, `--font-fraunces`, `--space-4`.
- **Rule**: These should **RARELY** be used directly in components. They exist to feed the Semantic layer.

### Layer 2: Semantics (`src/styles/tokens/2-semantic/`)

- **What**: Context-aware aliases that map primitives to purpose.
- **Examples**: `--color-primary`, `--color-surface`, `--text-body`.
- **Rule**: These are the **only** CSS variables you should reference if you are writing custom CSS.

### Layer 3: Tailwind Theme (`src/styles/tokens/3-tailwind.css`)

- **What**: The mapping of Semantic Tokens to Tailwind Utilities.
- **Examples**: maps `--color-primary` to `text-primary`, `bg-primary`, `border-primary`.
- **Rule**: This enables us to use `<div class="bg-primary text-primary-contrast">`.

---

## 3. Rules & Best Practices

### ✅ DO:

- **Use Tailwind Utilities**:
  ```svelte
  <!-- Good -->
  <div class="flex items-center gap-4 p-4 bg-surface rounded-lg">
  ```
- **Use Semantic Tokens in Custom CSS** (only when necessary):
  ```css
  /* Good */
  .my-complex-element {
  	background: var(--color-surface-elevated);
  	color: var(--color-text);
  }
  ```
- **Co-locate Styles**:
  Put your component-specific styles in the `<style>` block of your `.svelte` file.

### ❌ DON'T:

- **Don't use Magic Numbers**:
  ```svelte
  <!-- Bad -->
  <div class="mt-[13px] w-[350px]">
  ```
  _Correction_: use `mt-3` or `mt-4`. If a specific size is needed for a layout sidebar, define it in the theme or use a fraction.
- **Don't create Global Component CSS**:
  Do **not** add new files to `src/styles/components/`. This pattern is deprecated.
  - _Why?_ It breaks code-splitting and makes it hard to delete dead code.
- **Don't Mix BEM and Tailwind**:
  If you are writing a new component, use Tailwind utilities. Don't write `.card__header { ... }` unless you are refactoring legacy code or hit a specific limitation.

---

## 4. Workflows

### How to Style a New Component

1.  **Draft with Utilities**: Start by adding classes directly to the HTML.
    ```svelte
    <button class="px-4 py-2 bg-primary text-primary-contrast rounded-md hover:opacity-90 transition-opacity">
    ```
2.  **Extract only if Complex**: If you have a complex animation or pseudo-element logic (e.g. `::before` with specific backdrop filters), create a scoped class in the `<style>` block.

    ```svelte
    <button class="custom-button ...">

    <style>
      .custom-button::before {
        content: "";
        /* ... complex glow effect ... */
      }
    </style>
    ```

### How to Add a New Color/Token

1.  **Define Primitive** (if new hue): Add to `1-primitives/colors.css`.
2.  **Define Semantic**: Add to `2-semantic/colors-light.css` (and dark).
    ```css
    --color-sidebar-bg: oklch(var(--gray-50));
    ```
3.  **Map to Tailwind**: Add to `3-tailwind.css`.
    ```css
    @theme {
    	--color-sidebar-bg: var(--color-sidebar-bg);
    }
    ```
4.  **Use**: `bg-sidebar-bg`.

---

## 5. Migration Strategy (Cleanup)

We currently have legacy styles in `src/styles/components/`. The goal is to migrate these into their respective Svelte components.

**Example: Migrating `floating-nav.css`**

1.  Open `src/lib/core/navigation/FloatingNav.svelte`.
2.  Copy the content of `src/styles/components/floating-nav.css`.
3.  Paste into `<style>` block at the bottom of `FloatingNav.svelte`.
4.  Remove the `@import` from `src/app.css`.
5.  Delete `src/styles/components/floating-nav.css`.
6.  (Optional but recommended) Refactor the CSS classes to Tailwind utilities where possible to reduce CSS bundle size.

---

## 6. Tailwind v4 Specifics

We are using Tailwind 4.0.

- **Configuration**: is purely CSS-based in `src/app.css` and imported files.
- **Features**: We can use `oklch()` colors natively.
- **Directives**: Use `@theme` to extend the system, not `tailwind.config.js`.

---

## 7. Extended Policies

### 📱 Mobile-First Strategy

**Rule**: All custom CSS and mental models must be Mobile-First.

- **Default styles** = Mobile/Vertical Layout.
- **Breakpoints** (`sm`, `md`, `lg`) = Exceptions for larger screens.
- **Example**:

  ```svelte
  <!-- ✅ Correct -->
  <div class="flex flex-col md:flex-row">

  <!-- ❌ Incorrect (Desktop-first) -->
  <div class="flex flex-row max-md:flex-col">
  ```

### ♿ Accessibility (A11y)

**Rule**: "Minimum Viable A11y" is mandatory.

- **Interactive Elements**: Buttons and links meant for icons MUST have `aria-label`.
  ```svelte
  <button aria-label="Toggle Menu">
  	<MenuIcon />
  </button>
  ```
- **Contrast**: Ensure text remains readable on glass/translucent backgrounds (verify logic in `colors-light.css` / `colors-dark.css`).
- **Focus Indicators**: Never remove `outline` without providing a custom `:focus-visible` alternative.

### ✨ Animation Strategy

**Rule**: Hybrid Approach (The "Svelte Way").
We do **not** need heavy libraries like Framer Motion or GSAP for 90% of cases.

1.  **Micro-interactions (Hover, Focus, Click)**:
    - **Use**: CSS / Tailwind Classes.
    - **Why**: Performance (runs on compositor thread), simplicity, consistency.
    - **Example**: `transition-transform hover:scale-105 active:scale-95`.

2.  **Mounting/Unmounting (Enter/Exit)**:
    - **Use**: Svelte Native Transitions (`@sveltejs/transition`).
    - **Why**: Svelte's `transition:fade` or `in:fly` logic is unbeatable for elements entering/leaving the DOM. It handles the JS lifecycle perfectly with zero boilerplate.
    - **Example**:
      ```svelte
      <div in:fly={{ y: 20, duration: 300 }} out:fade>
      ```

3.  **Complex Choreography (Sequences)**:
    - **Use**: `svelte-motion` (only if absolutely necessary).
    - **Why**: Only reach for this if you need complex physics-based gesture animations (drag-to-dismiss) that CSS/Svelte transitions cannot handle easily.

**Token Usage**: Always use project tokens for timing and easing.

- `duration-[var(--motion-fast)]`
- `ease-[var(--motion-ease-out-quint)]`

### 💧 Fluid Layouts & Typography

**Rule**: Avoid fixed pixels for main layout text.

- Use `rem` for almost everything.
- For headline typography, consider using `clamp()` logic (defined in primitive tokens) so it scales smoothly from mobile to desktop without strict breakpoints.

### 📚 Z-Index Scale

**Rule**: Stop using arbitrary numbers like `z-50` or `z-[9999]`.
We have a semantic Z-Index scale mapped in tokens.

- `z-negative` (-1)
- `z-base` (0)
- `z-elevated` (10)
- `z-nav` (100) -> _Sticky headers, floating navs_
- `z-overlay` (200) -> _Backdrops_
- `z-modal` (300) -> _Dialogs, Command Palettes_
- `z-toast` (400) -> _Notifications_
- `z-max` (9999) -> _Critical overlays_

Usage: `z-nav`, `z-modal` (Tailwind classes).
