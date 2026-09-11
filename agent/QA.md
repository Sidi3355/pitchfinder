# QA log

Nothing merges without a sign-off entry here. Numbers per iteration.

## Iteration 0: setup

| Check | Result |
| --- | --- |
| `npm run lint` | pass |
| `npm test` | see below |
| `npm run build` | pass, 324 KB gz initial JS |
| `npm run check:bundle` | pass on size (350 KB budget), MapLibre split not yet enforced |
| `npm run test:e2e` | see below |
| `npm run lighthouse` | see below |
