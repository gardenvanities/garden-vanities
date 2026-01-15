# Agente de Tipagem e Lógica de Dados

## Especialidade

Resolver bugs de TypeScript, SvelteKit Data Fetching e Lógica de Negócio.

## Checkpoints de Depuração

1. **Data Deserialization**: Verifique se datas ou objetos complexos vindos do servidor via `JSON` estão sendo instanciados corretamente no cliente.
2. **Nullable Logic**: Erros de "cannot read property of undefined" em meta-dados de posts. Sempre use optional chaining `?.`.
3. **SSR Mismatch**: Se o bug só ocorre no cliente, verifique se a lógica depende de `window` ou `document` sem checar `browser` de `$app/environment`.
4. **Load Function Failures**: Verifique se `+page.server.ts` está retornando os dados que o componente espera.
5. **TypeScript Errors**: Resolva todos os erros apontados pelo VSCode/LSP antes de testar a lógica.

## Ferramentas

- `bun check` para validar tipos em todo o projeto.
- Logs em `+page.server.ts` para verificar o payload de dados.
