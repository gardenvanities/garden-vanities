# Component Logic & Elegance Rules (Svelte 5)

## Filosofia: Componentes "Data-Driven"

A elegância surge da separação clara entre _o que exibe_ (UI) e _o que conhece o negócio_ (Domain). Evite prop drilling excessivo e componentes "Frankenstein" que fazem tudo.

## 1. Princípio da Composição (Slot-First Design)

Em vez de encher um componente com dezenas de props opcionais (`hasIcon`, `showTitle`, `headerClass`), prefira a **Inversão de Controle** usando Snippets.

- **Ruim (Props Explosion):**
  ```svelte
  <Card title="Olá" showHeader={true} icon={Icon} footerText="..." />
  ```
- **Elegante (Composição com Snippets):**
  ```svelte
  <Card>
  	{#snippet header()}
  		<Icon /> Olá
  	{/snippet}
  	Conteúdo principal...
  	{#snippet footer()}...{/snippet}
  </Card>
  ```
  Isso torna o componente infinitamente mais flexível sem adicionar complexidade lógica interna.

## 2. Tipagem Discrimada

TypeScript brilha quando props são mutuamente exclusivos ou dependentes. Use **União de Tipos Discriminados** para evitar estados impossíveis.

- **Regra:** Se a prop `variant="image"` exige uma `src`, mas `variant="text"` não, a tipagem deve refletir isso. Não use `src?: string` opcional globalmente se ela é obrigatória em um contexto.

## 3. Forwarding de Props (O Poder do `...rest`)

Componentes Primitivos (`ui/`) devem agir como proxies transparentes para o elemento HTML subjacente.

- **Padrão:** Sempre use `...rest` spread props no elemento raiz e permita `class` merging com `cn()` ou `clsx`.
  ```svelte
  let { class: className, children, ...rest }: Props = $props();
  <div class={cn("base-styles", className)} {...rest}>...</div>
  ```
- **Por que:** Isso evita ter que declarar manualmente `onclick`, `aria-label`, `dataset`, etc. Se o usuário quiser passar, o componente aceita sem mudanças.

## 4. Gerenciamento de Estado Local

Evite lógica complexa dentro do `<script>`. Se a lógica de estado do componente ocupa mais de 10 linhas:

- **Extração:** Mova a lógica para um arquivo `.svelte.ts` (Class-based State ou Factory Function) que vive ao lado do componente.
- **Benefício:** A lógica se torna testável unitariamente sem precisar montar o componente visual.

## 5. Padrão "Polymorphic Components" (Opcional mas Poderoso)

Para componentes `ui/` como `Button` ou `Card`, permita a prop `as` ou `element` para mudar a tag HTML renderizada (ex: renderizar um `Button` como `<a>` se tiver `href`).

- **Svelte 5:** Use `<svelte:element this={as} ...>` para implementação dinâmica limpa.

## 6. Lógica de Domínio (`garden/`)

- Estes componentes devem receber **Objetos Inteiros** (`post: PostFrontmatter`) em vez de props picotados (`title={post.title} date={post.date}`).
- **Motivo:** O componente se torna a "fonte da verdade" sobre como aquele dado deve ser exibido. Se o objeto mudar, você ajusta apenas um lugar.

## Verificação Automatizada

O Agente deve checar:

1.  Componentes com mais de 7 props primitivos devem ser refatorados para composição?
2.  `...rest` está sendo aplicado corretamente?
3.  Estilos estão isolados (sem vazar para fora)?
