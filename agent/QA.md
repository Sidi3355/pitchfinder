# QA log

Nothing merges without a sign-off entry here. Numbers per iteration.

## Iteration 0: setup (11 Sep 2026)

| Check                  | Result                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | pass (0 errors, 4 warnings in code slated for removal)                                                                  |
| `npm test`             | pass, 6 unit tests (geo helpers)                                                                                        |
| `npm run build`        | pass in 4.8 s                                                                                                           |
| `npm run check:bundle` | 324 KB gz initial JS, under the 350 KB budget; MapLibre still inline (fails the split assertion, expected until item 7) |
| `npm run test:e2e`     | pass, smoke test on mobile (iPhone 13 emulation) and desktop                                                            |
| `npm run lighthouse`   | FAIL: home Perf 78, A11y 93, BP 96, SEO 91, FCP 2.9 s; pitch route identical (no route yet, same SPA)                   |

Sign-off: setup commit approved. Gates that fail are recorded as the baseline, not hidden.
