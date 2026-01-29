# Guia de Conteúdo e Estilo - Garden of Vanities

Este documento serve como referência para a criação de novos conteúdos no jardim, garantindo consistência nos metadados, SEO e componentes visuais.

---

## 1. Frontmatter Padrão (Template)

Copie e cole este bloco no início de cada arquivo `.md`:

```yaml
---
slug: "titulo-do-artigo-na-url"
title: "Título Poético ou Visual"
subtitle: "Subtítulo explicativo que aparece abaixo do H1 e nos cards."
summary: "Resumo denso para SEO e busca interna. Use palavras-chave aqui."
ripeness: "seed" # seed (rascunho) | root (em desenvolvimento) | fruit (concluído)
kind: "note" # note | essay | tutorial | thought
set: "default" # Categoria macro (opcional)
tags: ["tópico-1", "tópico-2"]
publishedAt: 2024-03-20
updatedAt: 2024-03-20
cover:
  url: "folder/image-name" # Caminho no Cloudinary (sem a URL base)
  alt: "Descrição acessível da imagem"
  caption: "Legenda visível (opcional)"
seo: # Opcional - Sobrescreve dados automáticos
  title: "Título Otimizado para Google (ex: Tutorial Completo de X)"
  description: "Meta description exata (max 160 chars)"
---
```

---

## 2. Dicionário de Metadados

### Visuais vs. Invisíveis

| Campo           | Onde Aparece?               | Função Principal                                          |
| :-------------- | :-------------------------- | :-------------------------------------------------------- |
| **`title`**     | H1 da Página, Cards         | Título estético e principal para o leitor.                |
| **`subtitle`**  | Subtítulo do H1, Cards      | Complemento visual, contexto imediato.                    |
| **`summary`**   | **Invisível** (Busca/SEO)   | Alimentar o algoritmo de busca interna e fallback de SEO. |
| **`seo.title`** | **Invisível** (Google/Abas) | Título "clicável" para resultados de busca (SERP).        |
| **`seo.desc`**  | **Invisível** (Google)      | Resumo curto para resultados de busca (Snippet).          |

### Taxonomia (Classification)

#### `ripeness` (Maturidade)

Define o estado de evolução do pensamento.

- 🌱 **`seed`**: Ideia inicial, rascunho, poucas linhas.
- 🌿 **`root`**: Em desenvolvimento, estruturado mas pode mudar.
- 🍎 **`fruit`**: Conteúdo maduro, polido e finalizado.

#### `kind` (Tipo)

Define o formato do conteúdo.

- 📝 **`note`**: Anotação rápida, técnica ou link.
- 📄 **`essay`**: Ensaio longo, opinativo e estruturado.
- 📚 **`tutorial`**: Guia passo-a-passo, educacional.
- 💡 **`thought`**: Reflexão filosófica ou abstrata.

---

## 3. SEO Avançado (Estratégia)

Use o objeto `seo:` quando o título "artístico" do post não for claro o suficiente para quem busca no Google.

**Exemplo Prático:**

- **No Site (Visual):**
  - `title`: "O Abismo"
  - `subtitle`: "Uma reflexão sobre a complexidade acidental."
- **No Google (SEO):**
  - `seo.title`: "O Abismo: Por que microsserviços falham (Análise de Arquitetura)"
  - `seo.description`: "Entenda como a complexidade acidental em sistemas distribuídos cria um abismo técnico. Análise crítica sobre engenharia de software."

---

## 4. Imagens e Capas

As imagens utilizam o Cloudinary. A URL deve ser **parcial**, apenas o caminho público do ID.

- ✅ **Correto:** `cover/minha-imagem`
- ❌ **Errado:** `https://res.cloudinary.com/.../cover/minha-imagem.jpg`

---

## 5. Componentes Especiais no Markdown

### Notas de Rodapé

Use para referências ou comentários laterais.

```markdown
O conceito de autopoiese[^1] é fundamental.

[^1]: Maturana, H. R., & Varela, F. J. (1980). Autopoiesis and Cognition.
```

### Callouts (Citações)

Use blockquotes para destaque.

```markdown
> **Nota:** Isso é importante.
```
