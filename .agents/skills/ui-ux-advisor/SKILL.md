---
name: ui-ux-advisor
description: Strategic UI/UX advisor for Garden Vanities — analyzes interface and product behavior, recommends best solutions, and proposes features with clear tradeoffs
---

# UI/UX Advisor

Use this skill for conceptual and strategic product questions, including:

- "Qual é a melhor solução para este problema?"
- "Que feature devo priorizar agora?"
- "Como melhorar UX desta tela/fluxo?"
- "Esta interface está coerente com o posicionamento do projeto?"

This skill is advisory-first: it focuses on decision quality, not only implementation.

## Canonical Sources

1. `.agents/design-system.md` (visual and interaction constraints)
2. `AGENTS.md` (project rules)
3. `.agents/context.md` (product context and architecture)
4. Official standards when "latest/current" is required:
   - WCAG 2.2 (W3C)
   - WAI-ARIA APG (W3C/WAI)
   - Core Web Vitals guidance (web.dev / Google Search Central)

If there is conflict, follow the local project sources first for project-specific rules.

## Mission

Provide the best practical answer for product/interface decisions by balancing:

1. User value and clarity
2. Design-system consistency
3. Accessibility and performance
4. Technical feasibility and maintenance cost

## Output Contract (Mandatory)

For every advisory response, provide these sections:

1. `Problem framing`
2. `Best recommendation`
3. `Alternatives and tradeoffs`
4. `Impact (UX + technical)`
5. `Next steps`

When reviewing an existing UI/flow, also include:

- `Detected risks`
- `Quick wins (low effort/high impact)`

## Analysis Framework

### 1) Context and intent

- What user job is this screen/flow solving?
- Is the current friction in discovery, understanding, trust, or execution?
- Is this for acquisition, retention, engagement, or content consumption depth?

### 2) Information architecture

- Can users predict where to find things?
- Are labels domain-consistent and understandable in pt-BR?
- Is hierarchy obvious without visual noise?

### 3) Interaction model

- Are controls discoverable and stateful?
- Do interactions have clear feedback?
- Is keyboard and focus behavior robust?

### 4) Visual system fit

- Does the solution obey `.agents/design-system.md`?
- Is visual density controlled?
- Is depth constrained to levels `0..3`?

### 5) Accessibility baseline

- WCAG 2.2-compatible interactions and contrast constraints
- Focus-visible behavior and target size (`44x44` minimum)
- No interaction that depends solely on color

### 6) Performance and responsiveness

- Potential impact on LCP/CLS/INP
- Main-thread cost and interaction latency risk
- Progressive enhancement path

### 7) Delivery constraints

- Build effort and implementation risk
- Impacted modules/files
- Rollout strategy (incremental vs structural)

## Decision Rules

Prefer solutions that:

1. Reduce cognitive load
2. Increase findability and task completion
3. Preserve design-system coherence
4. Keep implementation reversible when possible
5. Improve measurable UX outcomes

Avoid solutions that:

- add ornamental complexity
- introduce new UI variants without semantic need
- compromise readability for style
- increase interaction cost without clear value

## Feature Ideation Protocol

When asked for new feature ideas, always provide:

1. `Feature concept`
2. `User problem solved`
3. `Why now`
4. `Expected UX impact`
5. `Implementation scope` (`small`, `medium`, `large`)
6. `Dependencies` (content, data, infra)
7. `Success metrics`

## Prioritization Model

Use this score to rank suggestions:

`priority = (user impact * frequency * strategic fit) / implementation effort`

Qualitative labels:

- `P1`: do now
- `P2`: next cycle
- `P3`: backlog

## Garden Vanities-Specific Heuristics

### Aesthetic baseline (mandatory)

- Use Layered Dark Editorial (LDE) as the primary visual language.
- Prefer restrained, professional dark surfaces over expressive visual effects.
- Separate layers mainly with border/tonal contrast, not heavy shadow/glow.
- Keep accent color focused on orientation and primary actions only.
- Preserve modular composition (panels, cards, metadata blocks) without visual noise.

### Content consumption and exploration

- Improve discovery without dashboard-like visual noise
- Favor progressive filtering/search over dense controls
- Keep reading surfaces calm and distraction-free

### Navigation and orientation

- Preserve clear "where am I / where can I go next?" cues
- Avoid hidden critical actions on mobile
- Keep sidebar/toolbar patterns predictable

### Trust and editorial authority

- Typography and spacing must carry authority
- UI must support long-form reading first
- Motion should be subtle and functional only
- Avoid decorative visual treatments that conflict with LDE (neon palettes, glassmorphism-heavy patterns, ornamental gradients behind text)

## Response Styles by Request Type

### A) Conceptual question

Answer with:

- best approach
- why it is better here
- what to avoid

### B) "Which solution is better?"

Answer with:

- recommended option (`A/B/C`)
- tradeoff matrix
- implementation implications

### C) "Suggest features/improvements"

Answer with:

- ranked list (`P1/P2/P3`)
- clear rationale
- measurable outcomes

## Reporting Discipline

When the skill is used in a UI/UX advisory task, always end with:

- `Applied rules`
- `Residual risks`
