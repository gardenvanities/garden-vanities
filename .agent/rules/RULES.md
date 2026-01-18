# Agent Operational Rules

## 1. Filosofia de Código (Clean Code)

- **Zero Comentários**: O código deve ser autoexplicativo. Não adicione comentários explicando "o que" o código faz.
- **Zero Console.log**: Jamais commitar código com logs de debug.
- **Single Responsibility**: Componentes devem ser pequenos e focados.
- **CSS Externo**: Componentes complexos devem ter seu CSS extraído para `src/styles/components/` (ex: `floating-nav.css`). **NUNCA** deixe blocos `<style>` gigantes dentro do `.svelte`.

## 2. Estrutura de Arquivos (Garden Architecture)

- **`src/lib/components/ui/`**: Componentes burros e reutilizáveis (Button, Card). Design System puro.
- **`src/lib/components/garden/`**: Componentes de domínio (PostCard, RipenessBadge). Conhecem dados do negócio.
- **`src/lib/components/core/`**: Componentes estruturais globais (Navbar, SEO, Footer).
- **`src/styles/tokens/`**: Definições de Design System (Cores, Espaçamento, Motion).
- **`src/content/`**: Markdown source of truth.

## 3. Automação e Comportamento

- **Testes Visuais**: Você tem permissão para usar o navegador (`browser_subagent`) para validar visualmente suas alterações sem pedir permissão a cada clique.
- **Correção Proativa**: Se encontrar código legado (Svelte 4 ou Tailwind antigo) durante uma tarefa, atualize-o silenciosamente para o padrão definido em `STACK.md`.
- **Leitura Antes de Escrita**: Antes de criar ou editar estilos, LEIA `src/app.css` e `src/styles/tokens/` para garantir que está usando as variáveis corretas.

## 4. Browser Agent Protocol

Ao testar no navegador:

1. Abra o localhost.
2. Interaja com o elemento modificado.
3. Se houver erro no console, capture-o.
4. Relate apenas o necessário (sucesso/falha visual ou erro técnico).

### Permissões Automáticas

O browser agent tem permissão explícita para executar as seguintes ações **sem solicitar aprovação do usuário**:

- **Executar JavaScript** (`browser_execute_javascript`) — Para inspecionar DOM, testar interações, validar estados.
- **Capturar screenshots** — Para documentar resultados visuais.
- **Navegar entre páginas** — Para validar fluxos e links.
- **Clicar, digitar e scrollar** — Para simular interações reais.
