# Technical Stack & Modern Standards (2026)

Este arquivo define a **ÚNICA VERDADE** técnica do projeto. Agentes devem ignorar conhecimentos prévios que conflitem com estas regras.

## 1. Core Frameworks (Vite-Powered)

- **SvelteKit 2.49+**: Configurado com `@sveltejs/adapter-auto`.
- **Svelte 5 (Runes Only)**: Modo legadol (Svelte 4) está **PROIBIDO**.
- **Tailwind CSS 4.1**: Configurado via `@tailwindcss/vite` plugin. **NÃO EXISTE** `tailwind.config.js`.

## 2. Padrões Obrigatórios

### Svelte 5 (Runes)

| Recurso      | ❌ Antigo (Banido)       | ✅ Novo (Obrigatório)                 |
| ------------ | ------------------------ | ------------------------------------- |
| Estado Local | `let count = 0`          | `let count = $state(0)`               |
| Props        | `export let data`        | `let { data } = $props()`             |
| Reatividade  | `$: double = count * 2`  | `let double = $derived(count * 2)`    |
| Efeitos      | `onMount`, `afterUpdate` | `$effect(() => { ... })`              |
| Eventos      | `dispatch('save')`       | `let { onsave } = $props(); onsave()` |
| Listeners    | `on:click={...}`         | `onclick={...}`                       |
| Slots        | `<slot />`               | `{@render children()}` (Snippets)     |

### Tailwind CSS 4.1

| Conhecimento Antigo            | Realidade Atual (v4)                                      |
| ------------------------------ | --------------------------------------------------------- |
| Config no `tailwind.config.js` | Config CSS-first (veja `src/app.css` e `@theme`)          |
| `@apply` em classes Svelte     | **Evitar**. Usar classes utilitárias diretamente no HTML. |
| Sintaxe `shadow-[var(--bot)]`  | **Depreciado**. Use `shadow-(--bot)`                      |
| Sintaxe `bg-gradient-to-*`     | **BANIDO**. Use `bg-linear-to-*` (t/r/b/l/tr/tl/br/bl)    |
| Cores Opacas (`rgb/hsl`)       | **Moderno**. Use `oklch(l c h / alpha)`                   |

## 3. Configuration Sources

- **Estilos Globais**: `src/app.css` (Importa `@theme` e plugins).
- **Tokens**: `src/styles/tokens/` (Definidos como variáveis CSS nativas).
- **Vite Config**: `vite.config.ts` (Onde o plugin do Tailwind reside).

## 4. Ecossistema

- **Icons**: `lucide-svelte` (Importar componentes individuais).
- **Markdown**: `mdsvex` com plugins `rehype-slug`, `rehype-katex-svelte`.
- **Runtime**: `Bun` (usar `bun func` em vez de `npm func`).
