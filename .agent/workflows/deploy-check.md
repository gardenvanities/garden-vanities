---
description: Pre-deploy checklist — validate, build, and check bundle size
---
// turbo-all

# Deploy Check

Full pre-deploy validation pipeline.

## Steps

### 1. Sync SvelteKit types
```bash
bun run prepare
```

### 2. Type check
```bash
bun check
```

### 3. Lint
```bash
bun lint
```

### 4. Run tests
```bash
bun test run
```

### 5. Production build
```bash
bun run build
```

### 6. Check bundle size

After build completes, review the output for:
- Total JS bundle size (target: < 50kB gzipped per route)
- Any unexpectedly large chunks
- Ensure no server-only code leaked to client bundles

### 7. Preview (optional)

```bash
bun preview
```

Manually verify:
- Home page loads
- Article pages render correctly
- Navigation works
- Dark/light mode toggle
- Mobile responsive layout

## All Steps Must Pass

If any step fails, fix the issues before deploying. The deploy pipeline should block on:
- Type errors
- Lint errors
- Test failures
- Build failures

## Success Criteria

- [ ] All 5 validation commands exit code 0
- [ ] No warnings in build output
- [ ] Bundle sizes within targets
- [ ] Preview renders correctly (if checked)
