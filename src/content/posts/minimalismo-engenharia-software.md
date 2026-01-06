---
title: "Minimalismo na Engenharia de Software"
subtitle: "Menos código, menos problemas. Como a simplicidade radical pode salvar projetos complexos do colapso."
slug: "minimalismo-engenharia-software"
publishedAt: "2024-04-02"
author: "@themageking"
visibility: "public"
kind: "essay"
tags: ["engenharia", "minimalismo", "arquitetura", "clean-code"]
series:
  name: "Filosofia do Código"
  order: 2
seo:
  metaTitle: "Minimalismo e Simplicidade no Código"
  metaDescription: "Por que remover código é mais importante que adicionar, e como o minimalismo impacta a manutenção de software."
---

Seguindo a ideia do nosso [último texto](/posts/jardim-digital-extensao-mente), vamos falar sobre como aplicamos essa filosofia no código em si.

Existe uma tendência natural à entropia em qualquer base de código. Funcionalidades são adicionadas, prazos apertam, e "gambiarras" provisórias se tornam permanentes. O antídoto é o **Minimalismo Ativo**.

## A Arte de Não Escrever Código

O melhor código é aquele que não precisou ser escrito. Código inexistente:

- Não tem bugs.
- Não precisa de testes.
- Não pesa no bundle.
- Não precisa de documentação.

### Complexidade Acidental vs. Essencial

Fred Brooks, no clássico _No Silver Bullet_, distingue dois tipos de complexidade:

1.  **Essencial**: A dificuldade inerente ao problema que você está resolvendo (ex: calcular rotas de logística).
2.  **Acidental**: A dificuldade que nós criamos com ferramentas erradas, abstrações prematuras e overengineering (ex: usar Microservices para um blog pessoal).

Nosso trabalho como engenheiros é **eliminar a complexidade acidental** implacavelmente.

## O Culto à "Smartness"

Muitos desenvolvedores julgam sua competência pela complexidade das soluções que criam.

> "Qualquer tolo consegue escrever código que um computador entenda. Bons programadores escrevem código que humanos entendam." — _Martin Fowler_

Prefira sempre:

- Duplicação clara > Abstração errada.
- Funções puras > Classes com estado mutável.
- Bibliotecas pequenas e focadas > Frameworks monolíticos (sempre que possível).

### Prática: O Teste do "Delete"

Ao revisar um Pull Request, pergunte-se: _"Posso atingir o mesmo objetivo deletando código em vez de adicionar?"_. Muitas vezes, a refatoração é apenas uma limpeza de lógica antiga que não serve mais.

No fim, a elegância não está na quantidade de patterns que você usou, mas na clareza cristalina da solução. Mantenha simples.
