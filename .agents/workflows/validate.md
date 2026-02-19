---
description: Run the full validation pipeline (type check, lint, test)
---
// turbo-all

# Validate

Run the complete validation pipeline to ensure code quality.

## Steps

1. Run agent instruction consistency checks:
```bash
bun run check:agents
```

2. Run type checking and Svelte validation:
```bash
bun check
```

3. Run ESLint for code consistency:
```bash
bun lint
```

4. Run the test suite:
```bash
bun run test --run
```

## Expected Results

- All four commands must exit with code 0.
- If any step fails, fix the issues before proceeding.
- Report the number of errors found and fixed.

## Common Issues

- **Type errors after refactoring:** Run `bun run prepare` first to sync SvelteKit types.
- **Lint errors from unused imports:** Remove them or prefix with `_` if intentional.
- **Test failures:** Check if test fixtures need updating after content model changes.
