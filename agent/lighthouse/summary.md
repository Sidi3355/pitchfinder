# Lighthouse (mobile, throttled to slow 4G and a 4x slower CPU)

Measured 2026-09-12T19:20:52.859Z against a local static build served like Vercel.
Gates: performance >= 85, accessibility >= 95, best practices >= 95, SEO >= 90, FCP <= 3 s.
The finder route's Performance is measured under software WebGL (no GPU in headless Chrome) and is reported, not gated: the map's context setup dominates it. Measure it on a phone or with PageSpeed Insights against the deployed site.

| Route | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Runs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 95 | 100 | 100 | 100 | 2.4 s | 2.4 s | 0 ms | 0 | 1 |
| /find | 80 | 100 | 100 | 100 | 1.7 s | 3.1 s | 462 ms | 0 | 1 |
| /p/cm-blackprince | 99 | 96 | 96 | 100 | 1.3 s | 1.3 s | 111 ms | 0 | 1 |

Result: PASSED
