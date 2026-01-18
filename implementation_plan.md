# Implementation Plan - Styling Architecture V2

We are solidifying the styling architecture for **Garden of Vanities**. This plan covers the documentation update and the implementation of missing token layers (Z-Index, Fluid Typography) to support the "definitive" rules.

## User Review Required

> [!CAUTION]
> **Mobile-First Validation**: We are enforcing a Mobile-First mindset. This means writing `flex-col md:flex-row` instead of `flex-row max-md:flex-col`. This might require refactoring existing components over time, but we will start with the rules.

## Proposed Changes

### Documentation

#### [MODIFY] [docs/STYLING_RULES.md](file:///home/themageking/Desktop/garden-vanities/docs/STYLING_RULES.md)

- Add sections for:
  - **Mobile-First Strategy**: Explicit breakdown of breakpoints and mindset.
  - **Accessibility (A11y)**: Minimum viable requirements (ARIA labels on interactive elements, decent contrast).
  - **Animation Strategy**: Hybrid approach (CSS for micro-interactions, Svelte Transitions for enter/exit).
  - **Fluid Layouts**: Recommendation for `clamp()` and relative units.
  - **Z-Index Scale**: New semantic layer for z-indices.

### Tokens & Styles

#### [NEW] [src/styles/tokens/1-primitives/z-index.css](file:///home/themageking/Desktop/garden-vanities/src/styles/tokens/1-primitives/z-index.css)

- Define a primitive scale (0, 10, 20... 100, 9999).

#### [MODIFY] [src/styles/tokens/2-semantic/materials.css](file:///home/themageking/Desktop/garden-vanities/src/styles/tokens/2-semantic/materials.css)

- Add semantic Z-Index variables (e.g., `--z-nav`, `--z-modal`, `--z-toast`) backed by primitives.
- _Note_: I will check if there is a better place than `materials.css`, possibly creating `layout.css` in semantic variables if needed.

#### [MODIFY] [src/styles/tokens/\_index.css](file:///home/themageking/Desktop/garden-vanities/src/styles/tokens/_index.css)

- Import the new Z-Index primitive file.

#### [MODIFY] [src/styles/tokens/3-tailwind.css](file:///home/themageking/Desktop/garden-vanities/src/styles/tokens/3-tailwind.css)

- Map the new Semantic Z-Index variables to Tailwind's `z-*` utility theme.

## Verification Plan

### Automated Tests

- Run `npm run check` to ensure no CSS syntax errors or broken imports.
- Run `npm run build` to verify the Tailwind build pipeline processes the new token files correctly.

### Manual Verification

- **Documentation**: Verify `STYLING_RULES.md` renders correctly and is comprehensive.
- **Tokens**: Inspect `app.css` (via dev tools or build output) to see if `--z-nav` variables are generated.
