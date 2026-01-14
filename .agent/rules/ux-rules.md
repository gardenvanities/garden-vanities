# UX & Aesthetic Core (The Garden's Soul)

## Filosofia: "Humanist Digital Garden"

O projeto adota um sistema híbrido **Geist (Estrutura) + HIG (Alma)**. Consulte `.agent/rules/design-system-rules.md` para a implementação técnica. A UX deve evocar a sensação de folhear um livro raro em uma biblioteca antiga, mas com a responsividade de uma interface futurista.

## 1. O Protocolo "Alive Interface" (Micro-interações)

A interface nunca deve parecer morta ou congelada. A resposta ao input do usuário deve ser biológica, não mecânica.

- **Regra dos 3 Estados:** Todo elemento interativo (botões, cards, links) OBRIGATORIAMENTE deve ter estados visuais distintos para:
  1.  `Idle` (Repouso)
  2.  `Hover` (Intenção/Foco)
  3.  `Active/Press` (Ação confirmada)
- **Física de Animação:** Use curvas `cubic-bezier` personalizadas (ex: `ease-out-quint`) para suavidade. Evite animações lineares.
- **Duração:**
  - Micro-interações (hover): 150ms-250ms.
  - Transições de página/layout: 300ms-500ms.
- **Feedback Tátil Visual:** Ao clicar, o elemento deve ter um leve `scale-down` (0.98) para emular a pressão física.

## 2. Tipografia e Ritmo de Leitura (Core)

O conteúdo é rei. A leitura deve ser "effortless" (sem esforço).

- **Medida Dourada:** Parágrafos de texto longo (artigos) devem ter estritamente entre **60 a 75 caracteres de largura** (use `max-w-prose` ou `65ch`).
- **Escala Modular:** Respeite a hierarquia de `tokens-primitive.css`. Nunca use tamanhos de fonte arbitrários.
- **Contraste Suave:**
  - **Light Mode:** Nunca use preto puro (`#000`) no fundo branco. Use `text-gray-900` ou tokens de "Ink".
  - **Dark Mode:** Nunca use branco puro (`#FFF`) no fundo preto. Use `text-gray-100` ou tokens de "Paper".
- **Espaço em Branco:** O "respiro" é tão importante quanto o conteúdo. Use margens generosas (`gap-8`, `py-12`) para separar blocos de pensamento.

## 3. Navegação e Wayfinding

O usuário nunca deve se sentir perdido no labirinto de ideias.

- **Indicadores de Localização:** Breadcrumbs ou "Active States" na sidebar são obrigatórios em páginas profundas (`posts/`, `topics/`).
- **Links Externos:** Devem ser visualmente distintos (ícone `↗` ou sublinhado diferente) para não quebrar a expectativa de navegação SPA.
- **Voltar Inteligente:** Se o usuário entrou via link direto num post, o botão "Voltar" deve levá-lo ao índice da categoria, não para o "nada".

## 4. Performance Percebida (Otimismo)

A percepção de velocidade > Velocidade real.

- **Skeleton Screens:** Proibido usar "Spinners" genéricos de tela cheia. Use Skeletons que imitam a forma do conteúdo que vai carregar.
- **UI Otimista:** Se possível, atualize a UI instantaneamente ao clicar (ex: like, trocar tema) e trate o erro em background depois.
- **Sem Layout Shift (CLS):** Imagens e iframes devem ter `aspect-ratio` reservados antes de carregar para evitar que o texto "pule" durante a leitura.

## 5. Acessibilidade de Elite

Acessibilidade não é um "extra", é a base da elegância.

- **Focus Ring Customizado:** O foco do teclado deve ser visível e bonito. Substitua o `outline` padrão do browser por um `ring-2 ring-primary ring-offset-2`.
- **Área de Toque (Mobile):** Todo botão tem que ter no mínimo `44x44px` de área clicável, mesmo que o ícone seja visualmente menor. Use `p-2` ou `-m-2 p-2` para compensar.
- **Redução de Movimento:** Respeite `prefers-reduced-motion`. Animações de entrada (`fly`, `scale`) devem ser desativadas ou simplificadas para `fade` simples se o usuário preferir.

## Checklist de Validação do Agente

O Agente UX deve rejeitar qualquer PR que contenha:

- [ ] Elementos interativos sem `:hover` ou `:focus-visible`.
- [ ] Texto corrido (body) com mais de 80 caracteres de largura.
- [ ] Contraste de cor inacessível (menos de 4.5:1 para texto normal).
- [ ] Layout Shifts visíveis no carregamento.
