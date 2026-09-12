# Lighthouse (mobile, throttled to slow 4G and a 4x slower CPU)

Measured 2026-09-12T15:54:16.590Z against a local static build served like Vercel.
Gates: performance >= 85, accessibility >= 95, best practices >= 95, SEO >= 90, FCP <= 3 s.
The finder route's Performance is measured under software WebGL (no GPU in headless Chrome) and is reported, not gated: the map's context setup dominates it. Measure it on a phone or with PageSpeed Insights against the deployed site.

| Route | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 94 | 100 | 100 | 100 | 2.5 s | 2.5 s | 0 ms | 0 |
| /find | 82 | 100 | 100 | 100 | 2.2 s | 2.2 s | 566 ms | 0 |
| /p/cm-blackprince | 98 | 100 | 96 | 100 | 1.3 s | 1.3 s | 139 ms | 0.002 |

Result: PASSED
