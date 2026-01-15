# Agent Automation & Browser Permissions

## 1. Browser JavaScript Execution

- O Agente tem permissão explícita para executar JavaScript no navegador durante sessões de inspeção e teste através da ferramenta `browser_subagent`.
- Esta permissão é concedida para evitar pedidos redundantes de confirmação ("pedir confirmação toda vez"), permitindo que o Agente valide a interface e o comportamento do código de forma autônoma e eficiente.
- **Objetivo**: Garantir que a experiência de desenvolvimento seja fluida ("executar direto").

## 2. Verificação de Interface (Visual Inspection)

- Ao visualizar o navegador, o Agente pode interagir com elementos (clicar, focar, digitar) para garantir que as regras de UX e acessibilidade definidas em `.agent/rules/ux-rules.md` estão sendo seguidas.
- O Agente deve documentar brevemente no seu pensamento (thought) as ações realizadas no navegador, mas não precisa aguardar aprovação manual para cada interação individual de script interno.

## 3. Uso de Ferramentas de Comando

- Para tarefas de rotina como `lint`, `format` e `check`, o Agente deve utilizar a flag `SafeToAutoRun: true` se as diretrizes do workflow e a segurança do ambiente permitirem, alinhado com o desejo do usuário por automação.
