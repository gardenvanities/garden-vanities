# Hybrid Design System Rules (Geist + HIG)

## Philosophy: "Structured Soul"

This project uses a hybrid approach to combine the rigorous structural integrity of **Vercel Geist** with the immersive, organic interaction model of **Apple HIG (2026)**.

## 1. Domain Separation (The Treaty)

To prevent conflict, each system has a strict monopoly over specific CSS properties.

### Vercel Geist Controls: **STRUCTURE**

Geist is responsible for the "Skeleton" and "Grid" of the garden.

- **Typography Scale:** Line-heights, letter-spacing, and font-sizes must assume Geist's precision (e.g., rigid 1.5 leading for body, tight tracking for headers).
- **Layout & Spacing:** All margins (`m-4`), paddings, and gaps follow strict Geist spacing tokens.
- **Borders:** 1px solid borders. No fuzzy borders. `border-border` is the law.
- **Radii:** Strict radius scale (`sm`, `md`, `lg`, `xl`). No random `border-radius: 13px`.

### Apple HIG Controls: **SOUL**

HIG is responsible for the "Atmosphere" and "Touch".

- **Materials (Backgrounds):** Glassmorphism (`backdrop-blur`), translucent layers, and vibrant gradients.
- **Depth (Shadows):** Multiple drop-shadow layers to create depth (z-axis).
- **Motion:** Spring-based animations for layout changes. 300ms `ease-out` for interactions.
- **Interaction States:** The "Liquid" feel. Active states scale down (0.98). Hover states lift up (-2px).

## 2. Design Tokens (No Magic Numbers)

To maintain visual consistency and support themes (Dark/Light), raw values are prohibited.

- **Colors**: NEVER use Hex, RGB, or HSL literals (e.g., `#ff0000`).
  - **Do**: Use Tailwind classes (`text-primary`, `bg-surface`) or CSS variables (`var(--color-text)`).
- **Spacing/Sizing**: NEVER use arbitrary pixel values (e.g., `padding: 13px`).
  - **Do**: Use the spacing scale (`p-4`, `m-2`) or variables (`var(--spacing-md)`).
- **Typography**: NEVER define `font-size` or `line-height` manually.
  - **Do**: Use typography tokens (`text-base`, `font-display`).
- **Exceptions**: Only allowed for unique, one-off decorative elements (like a specific complex animation), and must be documented.

## 3. Accessibility (a11y)

The Digital Garden must be usable by everyone.

- **Semantic HTML**:
  - Use `<button>` for actions and `<a>` for navigation. NEVER use `onclick` on a `<div>` or `<span>` without ARIA roles and keyboard support.
  - Interactive elements MUST have a visible `:focus-visible` state.
- **Headings**:
  - Maintain a strict hierarchy. `<h1>` is reserved for the page title. Components should use `<h2>` through `<h6>`.
- **Images**:
  - Every `<img>` or Cloudinary wrapper MUST have an `alt` attribute. Use `alt=""` only for purely decorative images.
- **Contrast**:
  - Use token-based color combinations that are pre-verified for WCAG AA contrast compliance.
- **Forms**:
  - Every input MUST have a linked `<label>`.

## 4. Implementation Rules

### Source of Truth

- **Geist Tokens:** Derived from `src/styles/tokens/tokens-primitive.css` (Spacing, Sizes).
- **HIG Materials:** Derived from `src/styles/tokens/materials.css` (Blurs, Shadows, Colors).

### CSS Composition Pattern

Components must layer these systems:

```svelte
<div class="
  /* Geist Structure */
  h-10 px-4 rounded-md border border-border

  /* HIG Soul */
  bg-material-thin backdrop-blur-md shadow-sm
  transition-all duration-300 ease-out-quint
  hover:scale-[1.02] hover:bg-material-regular active:scale-95
">
```

### Prohibited Actions

- **DO NOT** use Geist's default "Black/White" stark color scheme for backgrounds. Use HIG's "Materials" (translucent grays).
- **DO NOT** use HIG's "Large Titles" layout logic. Keep Geist's precise grid alignment.
- **DO NOT** mix corner radii. If a card is `rounded-xl`, its children must respect that curvature.

## 5. Adaptation Strategy (Refactoring)

- **Refactoring:** When touching `src/styles`, split `tokens` into `structure` (Geist) and `materials` (HIG).
- **New Components:** Must define their structure first (Geist), then apply their material (HIG).
- **Token-First (Priority)**: Sempre use as classes e tokens definidos no sistema (ex: `.glass`, `.prose`, `text-primary`). Utilize classes utilitárias do Tailwind apenas se não houver um token ou classe específica para a necessidade, mas a prioridade absoluta é das classes e tokens customizados do projeto.
- **Transitions**: Every interactive state (hover, focus) should have a subtle transition (e.g., `transition-colors duration-200`).
