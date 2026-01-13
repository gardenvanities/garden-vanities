---
description: Executa a manutenção completa do projeto (check, lint, format) com aprovação automática.
---

// turbo-all

1. Limpa o console para iniciar a varredura

```bash
clear
```

2. Executa a verificação de tipos do Svelte

```bash
bun check
```

3. Executa a análise estática (Lint)

```bash
bun lint
```

4. Formata o código conforme as regras do Prettier

```bash
bun format
```

5. Tenta iniciar o servidor de desenvolvimento para garantir que o build está íntegro em tempo real (opcional)

```bash
bun dev
```
