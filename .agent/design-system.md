# Garden Vanities Design System

> Source of truth for all AI agents and contributors.
> If there is any conflict with implementation details in the codebase, this document takes precedence for new work.

## 1) Core Direction

- Product posture: editorial-first knowledge platform.
- Experience goals: clear, sophisticated, timeless.
- Primary priority: legibility.
- Secondary priority: subtle personality.
- Density: controlled, never compressed.
- Visual signature: typographic hierarchy + negative space, not ornament.

Non-negotiable rule:

`If a visual decision does not improve comprehension, hierarchy, or orientation, it must not exist.`

## 2) Theme Strategy

- Official matrix: `light` is the structural reference.
- `dark` has equal product importance and must have full parity.
- Theme model: semantic token names are stable across themes.
- Theme switching happens by alias/reference values, never semantic renaming.

Rule:

`Two modes, one identity.`

## 3) Token Architecture

Use four layers:

1. Primitive tokens: raw scales (`gray-*`, `space-*`, `radius-*`, motion primitives).
2. Semantic global tokens: intent (`--color-text`, `--color-surface`, `--color-border`).
3. Component tokens: optional, only when necessary (`--button-*`, `--input-*`).
4. Domain tokens: feature-context tokens that reference global tokens.

Governance rules:

- Components must consume semantic/component/domain tokens, never primitive values directly.
- Domain tokens must never override global semantics.
- No hardcoded colors in components.
- No arbitrary utility values when a tokenized utility exists.

## 4) Color System

- Base tone: neutral surfaces with strategic accent usage.
- Brand: one dominant brand family for identity and primary interaction.
- State colors are separate from brand semantics:
  - success
  - error
  - warning
  - info

Color rules:

- Brand tokens are for identity and primary actions.
- State tokens are for semantic feedback only.
- Never use brand token as success/error/warning/info replacement.
- Never use decorative multi-accent palettes in core UI.

## 5) Contrast and Accessibility

Minimum requirements:

- Normal text: WCAG AA (`>= 4.5:1`).
- Small text: WCAG AAA target (`>= 7:1`).

Additional rules:

- Muted text must remain legible.
- Focus indication must not rely only on color change.
- Interaction semantics must not depend only on color.

## 6) Typography

Allowed families (max 3):

1. UI: sans humanist.
2. Editorial headings: serif contemporary or equivalent editorial family.
3. Code: monospace.

Usage rules:

- Max 3 font weights per screen (ideal: 2 dominant weights).
- Body text minimum for long reading: 16px.
- Line length target for prose: 60-75 CPL (ideal around 66 CPL).
- ALL CAPS allowed only for short signaling labels, never for long reading text.

## 7) Spacing and Layout

- Spacing scale: 4px-based.
- Only official scale values may be used.
- Vertical rhythm defaults:
  - section standard: 64px
  - dense sections: 48px
  - macro transitions: 80px

Grid:

- Mobile: 4 columns.
- Tablet: 8 columns.
- Desktop: 12 columns.
- Main structural layout shift starts at `lg` (>=1024px).

Interaction hit area:

- Minimum target size: `44x44`.
- Preferred for primary actions: `48x48`.

## 8) Radius, Shadow, Surfaces, Depth

Radius:

- Keep moderate rounded system.
- Avoid both ultra-sharp and excessively rounded consumer aesthetics.

Surface model (fixed):

1. Base
2. Elevated
3. Overlay
4. Inverse

Depth model (official, total levels = 4):

- Level 0: Base
- Level 1: Elevated surface
- Level 2: Floating elements
- Level 3: Modal/overlay maximum

Depth rules:

- No level above 3.
- No decorative layering.
- Depth indicates spatial hierarchy only.

Shadows:

- Border is default separator.
- Shadow is only for true elevation/layer change.
- Avoid dramatic shadows and stacked shadow effects.

## 9) Motion System

Durations:

- Fast: 120ms
- Base: 200ms
- Slow: 320ms

Easing:

- Standard: `cubic-bezier(0.2, 0, 0, 1)`
- Entrance: `cubic-bezier(0, 0, 0.2, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`

Motion rules:

- No animation over 400ms for standard interactions.
- No decorative motion loops.
- No bounce/elastic/overshoot for core UI.
- Respect `prefers-reduced-motion`.

## 10) Interactive States

Every interactive element must define:

1. default
2. hover (desktop)
3. focus-visible
4. active/pressed
5. disabled (when applicable)

Focus ring standard:

- 2px visible outline.
- 2px offset.
- High-contrast brand-aligned token.
- Never remove focus without equivalent accessible replacement.

## 11) Loading, Empty, and Error Patterns

Loading:

- Skeleton is default for structural content loading.
- Spinner only for short scoped actions.

Empty state:

- Must include title, concise explanation, and next action (when applicable).
- No playful/illustrative noise.

Error:

- Recoverable errors: inline and actionable.
- Blocking errors: modal/screen-level with clear primary action.

## 12) Content and Internationalization Behavior

- Layout must tolerate text expansion (+30-50%) without breaking.
- Editorial content is not truncated in reading views.
- Truncation is allowed for utilitarian UI only (menus, metadata, constrained cards).
- Critical instructions and errors must never be truncated.

## 13) Component Decision Rules

- Reuse existing components first.
- Extend before creating new components.
- New variant allowed only for semantic difference, never stylistic preference.
- "One-off UI" is acceptable only if:
  - not reusable
  - introduces no new visual pattern
  - uses existing tokens only

No-exception policy:

`There are no visual exceptions outside this system.`

## 14) Token and Variant Governance

New token allowed only if all conditions pass:

- solves a real semantic gap
- not duplicating existing token semantics
- expected reuse in multiple contexts
- works in light and dark
- documented with purpose and allowed usage

New variant allowed only if:

- it encodes a new semantic intent
- cannot be represented by existing states/variants
- preserves accessibility and identity constraints

Governance scope for this project:

- No mandatory periodic audit cadence is required (personal project).
- Enforcement is still required on every new implementation.

## 15) Agent Execution Protocol

When an AI agent creates or edits UI, it must:

1. Select existing tokens and utilities before introducing anything new.
2. Validate light and dark parity.
3. Validate interactive states and focus visibility.
4. Validate spacing/grid/rhythm compliance.
5. Validate no forbidden patterns (hardcoded color, decorative motion, style drift).
6. Report any unavoidable mismatch as explicit technical debt.

## 16) Quick Self-Checks (for AI Agents)

Run these commands before finalizing UI/style changes:

```bash
# Hardcoded colors in Svelte/CSS
rg -n "#[0-9a-fA-F]{3,8}|rgb\\(|hsl\\(" src --glob '*.svelte' --glob '*.css'

# Removed outlines without focus-visible replacement (manual review required)
rg -n "outline:\\s*none" src --glob '*.svelte' --glob '*.css'

# Arbitrary utility values that may bypass tokens
rg -n "\\[[^\\]]+\\]" src --glob '*.svelte'

# Potential legacy depth usage beyond the official system
rg -n "shadow-xl|--shadow-4|z-\\[|z-\\(--z-critical\\)" src
```

Expected behavior:

- Any hit must be reviewed and justified.
- Unjustified hits must be fixed before completion.
