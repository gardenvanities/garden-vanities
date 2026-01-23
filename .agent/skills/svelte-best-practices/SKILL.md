---
name: sveltekit-best-practices
description: Princípios do SvelteKit 2 & Svelte 5. Server Load, Form Actions, Runes e roteamento.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SvelteKit Best Practices

> Princípios para desenvolvimento com SvelteKit 2 e Svelte 5 (Runes).

---

## 1. Server vs Universal (Client+Server)

### Árvore de Decisão de Lógica


```

Onde o código deve rodar?
│
├── Acesso a Banco de Dados, API Keys, File System
│   └── Server Only (+page.server.ts / +server.ts)
│
├── Estado Reativo de UI ($state, event handlers)
│   └── Componente Svelte (.svelte)
│
└── Fetch público ou lógica compartilhada?
└── Universal (+page.ts / +layout.ts)

```

### Por Padrão

| Tipo | Uso |
|------|-----|
| **Server (`.server.ts`)** | Acesso seguro a DB, segredos, Actions |
| **Universal (`.ts`)** | Fetch de APIs públicas, cache agressivo |
| **Component (`.svelte`)** | UI, Runes (`$state`), Hydration |

---

## 2. Padrões de Data Fetching

### Estratégia de Load

| Padrão | Uso |
|--------|-----|
| **Server Load** | Preferencial. Roda apenas no servidor. |
| **Universal Load** | Roda no servidor E no cliente (hidratação). |
| **Await Blocks** | Streaming de dados (Promises) na UI. |

### Fluxo de Dados

| Fonte | Padrão |
|-------|---------|
| Banco de Dados | `+page.server.ts` (função load) |
| API Externa | `fetch` nativo dentro do `load` |
| Input do Usuário | Form Actions + `use:enhance` |

---

## 3. Princípios de Roteamento

### Convenções de Arquivo

| Arquivo | Propósito |
|---------|-----------|
| `+page.svelte` | UI da Rota |
| `+layout.svelte` | Layout Compartilhado |
| `+page.server.ts` | Data Loading & Form Actions |
| `+error.svelte` | Boundary de Erro |
| `+server.ts` | API Route (Endpoint) |

### Organização de Rotas

| Padrão | Uso |
|--------|-----|
| Grupos `(app)` | Organizar sem afetar a URL |
| Params `[slug]` | Rotas dinâmicas |
| Optional `[[lang]]` | Parâmetros opcionais |
| Matchers `[id=int]` | Validação de rota via RegEx |

---

## 4. API Routes (+server.ts)

### Request Handlers

| Método | Uso |
|--------|-----|
| GET | Ler dados (ex: JSON API, imagens) |
| POST | Webhooks ou chamadas externas |
| PATCH/PUT | Atualizações via fetch manual |
| DELETE | Remoção via fetch manual |

### Melhores Práticas

- Prefira **Form Actions** para mutações de dados da UI.
- Use `json()` e `text()` helpers do `@sveltejs/kit`.
- Valide inputs (ex: Zod/Valibot).
- Use `throw error(status, message)` para controle de fluxo.

---

## 5. Princípios de Performance

### Otimização

- Use `data-sveltekit-preload-data="hover"` no body/links.
- Otimize imagens com `@sveltejs/enhanced-img`.
- Evite `await` no top-level do `load` se não for essencial (non-blocking).
- Use Snippets do Svelte 5 para reutilização leve de UI.

### Bundle Optimization

- Importe bibliotecas pesadas dentro de `onMount` ou dynamic import.
- Configure o adapter correto (Vercel, Node, Static) no `svelte.config.js`.

---

## 6. SEO & Metadata

### Head Management

| Método | Uso |
|--------|-----|
| `<svelte:head>` | Injetar tags no head por componente |
| `$page.data` | Usar dados carregados para título dinâmico |

### Tags Essenciais

- Title dinâmico (`<title>{data.title}</title>`)
- Meta description
- Canonical URL
- Open Graph tags

---

## 7. Estratégia de Cache

### Controle HTTP

| Camada | Controle |
|--------|----------|
| `setHeaders` | Cache-Control no `load` ou `+server.ts` |
| Adapter config | ISR ou Prerender (ex: Vercel ISR) |
| `export const csr` | Desativar JS client-side (páginas estáticas) |

### Revalidação

| Método | Uso |
|--------|-----|
| `invalidate()` | Recarrega dados no cliente |
| `invalidateAll()` | Recarrega todos os `load` functions ativos |
| `depends('tag')` | Invalidação granular baseada em chaves |

---

## 8. Form Actions (Server Actions)

### Casos de Uso

- Submissão de formulários
- Mutações de Banco de Dados
- Redirecionamentos pós-operação

### Melhores Práticas

- Nomeie actions: `default` ou nomeadas (`?/login`).
- Use `use:enhance` para UX progressiva (sem refresh).
- Retorne `fail(400, { data })` para validação de UI.
- Utilize `Zod` ou `Superforms` para validação robusta.

---

## 9. Svelte 5 & Runes

### Gerenciamento de Estado

| Legado (Svelte 4) | Runes (Svelte 5) |
|-------------------|------------------|
| `let count = 0` | `let count = $state(0)` |
| `$: double = x * 2` | `let double = $derived(x * 2)` |
| `export let data` | `let { data } = $props()` |
| `onMount(() => ...)` | `$effect(() => ...)` |

---

## 10. Anti-Patterns

| ❌ Não faça | ✅ Faça |
|-------------|---------|
| Query DB em `.svelte` | Use `+page.server.ts` |
| `fetch` em `load` p/ DB | Use conexão direta em Server Load |
| Stores globais p/ tudo | Use Context ou URL State |
| Efeitos colaterais no `load` | Use Actions para mutações |
| Ignorar Types | Use `PageData`, `ActionData` gerados |

---

## 11. Estrutura de Projeto


```

src/
├── lib/
│   ├── server/      # Código exclusivo do server (DB, Secrets)
│   └── components/  # Componentes reutilizáveis
├── routes/
│   ├── (app)/       # Grupo de rotas (app principal)
│   │   ├── dashboard/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   └── +layout.svelte
│   └── api/
│       └── [resource]/
│           └── +server.ts
└── app.html

```

---

> **Lembre-se:** No SvelteKit, a distinção principal é entre **Server Load** (dados) e **Client Hydration** (interatividade). Use Runes (`$state`) para reatividade fina e Actions para mutações.
