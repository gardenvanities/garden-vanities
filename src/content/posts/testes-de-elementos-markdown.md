---
slug: testes-de-elementos-markdown
title: "Laboratório de Testes Markdown"
subtitle: "Um post exaustivo para verificar a renderização de todos os elementos visuais e tipográficos do jardim."
summary: "Este é um artigo de teste criado para validar o CSS e a renderização de componentes Markdown, incluindo tabelas, matemática, códigos e citações."
ripeness: "fruit"
kind: "essay"
set: "meta"
tags: ["design-system", "markdown", "testes"]
cover:
  url: "cover/a"
  alt: "Imagem de teste abstrata"
  caption: "Uma legenda para a imagem de capa."
publishedAt: 2026-01-27
updatedAt: 2026-01-27
seo:
  title: "Teste de Elementos Markdown"
  description: "Página de teste para verificar estilos de markdown."
---

Este é um artigo de teste criado para validar o CSS e a renderização de componentes Markdown, incluindo tabelas, matemática, códigos e citações.

## Tipografia e Ênfase

Aqui testamos os estilos básicos de texto.

- Texto em **Negrito (Bold)** para destaque forte.
- Texto em _Itálico (Italic)_ para ênfase sutil.
- Texto ~~Riscado (Strikethrough)~~ para correções.
- Texto com <mark>Highlight (Mark)</mark> para chamar atenção (se suportado via HTML ou sintaxe específica `==`).
- Combinação: **Negrito e _Itálico_** ao mesmo tempo.

### Parágrafos

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna erot. Vivamus quis **metus** in nunc dignissim cursus. Sed vel ipsum in sapien pellentesque fermentum.

> **Citação em Bloco (Blockquote)**:
> Esta é uma citação importante para destacar sabedoria ou referências externas.
>
> Pode ter múltiplos parágrafos e até listas dentro.
>
> - Item citado 1
> - Item citado 2

---

## Listas

### Lista Não Ordenada

- Item nível 1
- Item nível 1
  - Item nível 2 (aninhado)
  - Item nível 2
    - Item nível 3
- Item nível 1 final

### Lista Ordenada

1.  Primeiro passo
2.  Segundo passo
    1.  Sub-passo A
    2.  Sub-passo B
3.  Terceiro passo

### Lista de Tarefas (Task List)

- [x] Tarefa completada
- [ ] Tarefa pendente
- [ ] Tarefa futura

---

## Códigos e Sintaxe

### Inline Code

Para usar variáveis, use `const universe = 42;` no meio do texto. Também serve para atalhos como `Ctrl+C`.

### Blocos de Código

**TypeScript / JavaScript:**

```typescript
interface User {
	id: number;
	name: string;
}

function greet(user: User): string {
	return `Hello, ${user.name}!`;
}

const me = { id: 1, name: "Mage" };
console.log(greet(me));
```

**Rust:**

```rust
fn main() {
    let x = 5;
    let y = 10;
    println!("A soma é: {}", x + y);
}
```

**CSS:**

```css
.container {
	display: flex;
	justify-content: center;
	align-items: center;
}
```

---

## Tabelas

Abaixo uma tabela para verificar alinhamento e bordas.

| Nome    |  Tipo  | Poder (0-100) | Status   |
| :------ | :----: | ------------: | -------- |
| Gandalf |  Mago  |            99 | Vivo     |
| Aragorn | Humano |            85 | Rei      |
| Legolas |  Elfo  |            82 | Arqueiro |
| Frodo   | Hobbit |            10 | Portador |

---

[MATH BLOCKS REMOVED FOR DEBUGGING]

---

## Mídia e Links

### Imagens

Aqui está uma imagem de exemplo (placeholder):

![Exemplo de Imagem Abstrata](https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop)
_Legenda: Uma imagem aleatória do Unsplash para teste de `figure` e `figcaption`._

### Links

- [Link Externo (Google)](https://google.com) - deve abrir em nova aba?
- [Link Interno (Home)](/) - deve navegar via SPA.
- **Backlink (Manual)**: [Rust para TS](/posts/rust-para-desenvolvedores-typescript) - A sintaxe `[wikilink]` requer plugin adicional.

---

## Notas de Rodapé

Aqui está uma afirmação que precisa de uma fonte[^1]. E aqui está outra observação técnica[^2].

---

[^1]: Esta é a nota de rodapé número 1. Links para referência bibliográfica.

[^2]: Notas de rodapé são ótimas para explicações laterais sem quebrar o fluxo.
