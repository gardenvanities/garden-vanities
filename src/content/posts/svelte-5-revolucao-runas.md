---
slug: svelte-5-revolucao-runas
title: "Svelte 5: A Revolução das Runas"
subtitle: "Adeus à reatividade baseada em let e hello para $state, $derived e $effect."
summary:

ripeness: "fruit"

kind: "note"
set: "Engenharia de Software"
tags: ["svelte", "javascript", "webdev", "frontend"]

cover:
  url:
  alt:
  caption:

series:
  name: "Modern Web Frameworks"
  order: 1

publishedAt: 2026-01-10
updatedAt:

seo:
  title: "Guia Rápido de Svelte 5 e Runas"
  description: "Entenda como a nova reatividade do Svelte 5 funciona e por que as Runas mudam tudo para melhor."
---

O Svelte 5 introduz o conceito de **Runas**, uma mudança fundamental na forma como lidamos com a reatividade no framework. Inspirado por Signals, as Runas tornam a reatividade explícita e poderosa fora dos componentes `.svelte`.

## As Principais Runas

### 1. $state

Substitui as variáveis reativas simples. Agora você define explicitamente o que deve ser observado.

```javascript
let count = $state(0);
```

### 2. $derived

O sucessor do `$:` (labels reativos). Ele computa valores baseados em outros estados.

```javascript
let double = $derived(count * 2);
```

### 3. $effect

Controla efeitos colaterais de forma granular e segura.

```javascript
$effect(() => {
	console.log("O contador mudou para:", count);
});
```

## Por que mudar?

O antigo modelo baseado em atribuição (`count += 1`) tinha limitações, especialmente em objetos aninhados e arrays. Com Runas, a reatividade é **universal**: funciona em arquivos `.js` e `.ts` sem hacks.

Este post testa o sistema de `series` e datas futuras.
