# Bulletproof Architecture for SvelteKit 5

Este documento define a **arquitetura oficial** do projeto Garden Vanities.
Todo código novo DEVE seguir esta estrutura. Agentes de IA devem consultar este arquivo antes de criar ou mover arquivos.

---

## Filosofia: Colocation Over Separation

> "Código que muda junto, vive junto."

A arquitetura tradicional (separar por tipo: `components/`, `stores/`, `utils/`) cria **dependências invisíveis** e dificulta a manutenção. A arquitetura Bulletproof organiza por **domínio/feature**, permitindo que você trabalhe em uma área do app sem pular entre pastas.

---

## Estrutura de Diretórios

```text
src/lib/
├── ui/                     # 🎨 DESIGN SYSTEM (Primitivos puros)
│   ├── button.svelte
│   ├── card.svelte
│   ├── badge.svelte
│   ├── modal.svelte
│   └── index.ts            # Re-exports públicos
│
├── layout/                 # 📐 COMPONENTES DE LAYOUT
│   ├── container.svelte
│   ├── grid.svelte
│   ├── section.svelte
│   └── index.ts
│
├── core/                   # 🏗️ INFRAESTRUTURA GLOBAL
│   ├── navigation/
│   │   ├── FloatingNav.svelte
│   │   ├── CommandPalette.svelte
│   │   └── command-palette.svelte.ts  # Estado vive aqui!
│   │
│   ├── seo/
│   │   └── SEO.svelte
│   │
│   ├── theme/
│   │   ├── ThemeToggle.svelte
│   │   └── theme.svelte.ts            # Estado do tema
│   │
│   ├── Footer.svelte
│   └── index.ts
│
├── modules/                # 🌱 DOMÍNIOS DE NEGÓCIO
│   │
│   ├── posts/              # ── Tudo sobre Posts/Artigos ──
│   │   ├── components/
│   │   │   ├── PostCard.svelte
│   │   │   ├── PostAccordion.svelte
│   │   │   ├── PostHeader.svelte
│   │   │   ├── PostMetaSidebar.svelte
│   │   │   ├── PostNavigation.svelte
│   │   │   ├── Cover.svelte
│   │   │   ├── ReadingProgress.svelte
│   │   │   └── Pagination.svelte
│   │   │
│   │   ├── utils/
│   │   │   ├── reading-time.ts
│   │   │   └── date.ts
│   │   │
│   │   ├── types.ts                   # Post, PostFrontmatter
│   │   └── index.ts
│   │
│   ├── garden/             # ── Metadados do Jardim Digital ──
│   │   ├── components/
│   │   │   ├── RipenessBadge.svelte
│   │   │   ├── RipenessTabs.svelte
│   │   │   ├── KindBadge.svelte
│   │   │   ├── Backlinks.svelte
│   │   │   ├── TableOfContents.svelte
│   │   │   ├── Tag.svelte
│   │   │   ├── TagList.svelte
│   │   │   ├── PostMetadataGrid.svelte
│   │   │   ├── SectionHeader.svelte
│   │   │   └── SetCard.svelte
│   │   │
│   │   └── index.ts
│   │
│   ├── author/             # ── Informações do Autor ──
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── series/             # ── Séries de Posts ──
│       ├── utils.ts
│       └── index.ts
│
├── shared/                 # 🔧 UTILITÁRIOS VERDADEIRAMENTE GENÉRICOS
│   ├── cloudinary.ts       # CDN de imagens
│   ├── merge-class.ts      # cn() helper
│   └── index.ts
│
└── server/                 # 🔒 CÓDIGO EXCLUSIVO DO SERVIDOR
    └── posts.ts            # Leitura de arquivos MD
```

---

## Regras de Ouro

### 1. Onde colocar um novo arquivo?

| Pergunta                                               | Resposta → Pasta                              |
| ------------------------------------------------------ | --------------------------------------------- |
| É um botão/input/card genérico sem lógica de negócio?  | `lib/ui/`                                     |
| É um componente de layout (Container, Grid)?           | `lib/layout/`                                 |
| Está relacionado a navegação, tema ou SEO global?      | `lib/core/`                                   |
| Está relacionado a Posts, Ripeness, Tags, Backlinks?   | `lib/modules/posts/` ou `lib/modules/garden/` |
| É uma função pura usada em MUITOS lugares diferentes?  | `lib/shared/`                                 |
| Acessa o filesystem ou variáveis de ambiente secretas? | `lib/server/`                                 |

### 2. Estado (Stores) → Colocation

**NUNCA** crie uma pasta `lib/stores/` separada. O estado deve viver **dentro** do módulo que o usa.

```text
# ❌ ERRADO (padrão antigo)
lib/stores/theme.svelte.ts
lib/stores/command-palette.svelte.ts

# ✅ CORRETO (Bulletproof)
lib/core/theme/theme.svelte.ts
lib/core/navigation/command-palette.svelte.ts
```

### 3. Types → Colocation

**NUNCA** crie uma pasta `lib/types/` global para tipos de domínio. Tipos devem viver junto do módulo.

```text
# ❌ ERRADO
lib/types/posts.ts
lib/types/author.ts

# ✅ CORRETO
lib/modules/posts/types.ts
lib/modules/author/types.ts
```

**Exceção**: Um arquivo `lib/types/index.ts` pode existir APENAS para re-exportar tipos públicos de todos os módulos para conveniência de imports externos.

### 4. Utils → Domínio ou Shared

Pergunte: "Esta função é usada APENAS por um módulo?"

- **Sim** → Coloque dentro de `modules/[modulo]/utils/`
- **Não, é genérica** → Coloque em `lib/shared/`

### 5. Barrel Exports (index.ts)

Cada pasta deve ter um `index.ts` que exporta sua API pública:

```typescript
// lib/modules/posts/index.ts
export { default as PostCard } from "./components/PostCard.svelte";
export { default as PostAccordion } from "./components/PostAccordion.svelte";
export * from "./types";
export { formatDate } from "./utils/date";
```

### 6. Imports

Sempre use o alias `$lib/` e importe do barrel:

```typescript
// ✅ CORRETO
import { PostCard, type Post } from "$lib/modules/posts";
import { Button } from "$lib/ui";
import { cn } from "$lib/shared";

// ❌ ERRADO (deep imports)
import PostCard from "$lib/modules/posts/components/PostCard.svelte";
```

---

## Checklist para Code Review

O Agente deve verificar antes de aprovar qualquer mudança:

- [ ] Novo componente está na pasta correta segundo as regras acima?
- [ ] Estado foi criado dentro do módulo, não em `lib/stores/`?
- [ ] Tipos de domínio estão no módulo, não em `lib/types/`?
- [ ] Utils específicos estão no módulo, não em `lib/utils/`?
- [ ] O `index.ts` do módulo foi atualizado para exportar o novo item?

---

## Migração de Código Legado

Ao encontrar código fora da estrutura Bulletproof durante uma tarefa:

1. **Não ignore**: Aproveite para mover o arquivo para o lugar correto.
2. **Atualize imports**: Use busca global para corrigir todos os imports quebrados.
3. **Teste**: Execute `bun check` para garantir que nada quebrou.
