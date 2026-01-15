# Agente de Runtime e Performance

## Especialidade

Console, Performance, Eventos e Erros Críticos de Execução.

## Checkpoints de Depuração

1. **Memory Leak**: Verifique se `$effect` que usa `setInterval` ou `addEventListener` possui uma função de retorno para limpeza.
2. **Console Noise**: Identifique e remova logs de desenvolvimento em produção.
3. **Infinite Re-renders**: Analise se um update de estado está disparando uma cascata de renders desnecessários.
4. **Hydration Errors**: Verifique se o HTML gerado no servidor é idêntico ao do primeiro render no cliente.
5. **Package Issues**: Verifique se versões de bibliotecas (ex: Lucide, Fuse.js) são compatíveis com Bun.

## Ferramentas

- Monitoramento de erros no console do navegador via subagente.
- Perfil de performance se o componente parecer "pesado".
