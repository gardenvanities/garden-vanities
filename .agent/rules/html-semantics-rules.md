# HTML Semantics Rules — Structure & Accessibility

## Filosofia

HTML semântico não é decoração — é a fundação da acessibilidade, SEO, e manutenibilidade. O significado deve estar no markup, não apenas no CSS.

## 1. Document Structure

Toda página deve ter uma estrutura clara de landmarks:

- **`<main>`**: Conteúdo principal (apenas 1 por página)
- **`<header>`**: Cabeçalho global ou de seção
- **`<footer>`**: Rodapé global ou de seção
- **`<nav>`**: Navegação (com `aria-label` se houver múltiplas)
- **`<aside>`**: Conteúdo relacionado mas não essencial (sidebar, TOC)

```html
<body>
	<header><!-- Logo, Nav --></header>
	<main><!-- Conteúdo --></main>
	<footer><!-- Links, Copyright --></footer>
</body>
```

## 2. Article Pages

Para páginas de conteúdo (posts do jardim):

- **`<article>`**: Envolve o conteúdo completo do post
- **`<header>`**: Dentro de `<article>` para título e metadados
- **`<section>`**: Para blocos temáticos com `<h2>` próprio
- **`<figure>` + `<figcaption>`**: Para imagens com legenda

```html
<article>
	<header>
		<h1>Título do Post</h1>
		<time datetime="2026-01-14">14 de Janeiro, 2026</time>
	</header>
	<section>
		<h2>Seção</h2>
		<p>Conteúdo...</p>
	</section>
</article>
```

## 3. Heading Hierarchy

Regras estritas para headings:

- **H1**: Apenas 1 por página — o título principal
- **H2-H6**: Sequência lógica, NUNCA pular níveis (H2 → H4 é proibido)
- **Estilização**: NUNCA usar heading apenas por tamanho visual
- **`aria-level`**: Use se precisar ajustar semântica sem mudar visual

```html
<!-- ✅ Correto -->
<h1>Título da Página</h1>
<h2>Seção 1</h2>
<h3>Subseção 1.1</h3>
<h2>Seção 2</h2>

<!-- ❌ Incorreto: pula H3 -->
<h1>Título</h1>
<h2>Seção</h2>
<h4>Subseção</h4>
```

## 4. Interactive Elements

Escolha o elemento correto:

| Ação                      | Elemento                 | Quando Usar          |
| ------------------------- | ------------------------ | -------------------- |
| Navegar para outra página | `<a href>`               | Muda a URL           |
| Executar ação             | `<button>`               | Muda estado, não URL |
| Submeter formulário       | `<button type="submit">` | Dentro de `<form>`   |

### Proibições

- **NUNCA** use `<div onclick>` ou `<span onclick>` para elementos clicáveis
- **NUNCA** use `<a href="#">` para ações (use `<button>`)
- **SEMPRE** adicione `:focus-visible` a elementos focáveis

## 5. Forms

Formulários acessíveis:

- **`<label>`**: Todo `<input>` DEVE ter um label associado via `for`
- **`<fieldset>` + `<legend>`**: Para agrupar campos relacionados
- **`aria-describedby`**: Para mensagens de erro ou ajuda
- **`autocomplete`**: Use valores apropriados (`email`, `name`, etc.)

```html
<label for="email">Email</label> <input type="email" id="email" autocomplete="email" />
```

## 6. Lists & Tables

- **Listas de navegação**: `<ul>` ou `<ol>` com `<li>`
- **Dados tabulares**: `<table>` com `<thead>`, `<tbody>`, `<th scope>`
- **NUNCA** use `<table>` para layout
- **NUNCA** use listas apenas para espaçamento visual

## 7. Time & Dates

Use o elemento `<time>` para datas:

```html
<time datetime="2026-01-14T16:00:00-03:00">14 de Janeiro, 2026</time>
```

## 8. Images & Media

- **`alt`**: Descrição contextual para todas as imagens
- **`alt=""`**: Apenas para imagens puramente decorativas
- **`loading="lazy"`**: Para imagens abaixo do fold
- **`width` + `height`**: Para evitar layout shift (CLS)

## Checklist de Validação do Agente

O Agente de Semântica HTML deve verificar:

- [ ] Apenas 1 `<h1>` por página
- [ ] Hierarquia de headings sem saltar níveis
- [ ] Todos os links têm texto descritivo (não "clique aqui")
- [ ] Imagens têm `alt` apropriado (descritivo ou vazio)
- [ ] Formulários têm labels associados
- [ ] Elementos interativos usam `<a>` ou `<button>` corretamente
- [ ] Página tem landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`)
