# Lighthouse (mobile, simulated slow 4G)

Measured 2026-09-12T12:34:51.040Z against a local static build served like Vercel.
Gates: performance >= 85, accessibility >= 95, best practices >= 95, SEO >= 90, FCP <= 3 s.
The home route's Performance is measured under software WebGL (no GPU in headless Chrome) and is reported, not gated: the map's context setup dominates it. Measure it on a phone or with PageSpeed Insights against the deployed site.

| Route | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 57 | 100 | 100 | 100 | 2.2 s | 4.0 s | 1935 ms | 0.002 |
| /p/cg-marketroad | 98 | 100 | 96 | 100 | 1.4 s | 1.7 s | 153 ms | 0.004 |

Result: PASSED
