# Adding a UI system (Huf, Helpdesk, a new ERP skin …)
1. `cp -r systems/_template systems/<id>` and edit `system.json` (name, componentGroup, tokens, variable system, rtl, defaults).
2. Put its built CSS/fonts/icons under `tokens/` (CSS in `tokens/css/<system>-*.css`; all `url()` local/relative — no network).
3. Write `scripts/specs-<id>.mjs` (same shape as specs.mjs; `group:'<componentGroup>'`, `css:[…]` listing the css files the harness should load, ids prefixed `<group>-`). Register the file in `scripts/capture.mjs` spec loader.
4. `node scripts/capture.mjs <ids>` → `node scripts/verify.mjs <ids>` until every mode passes (<=0.5% pixels, JS off).
5. Add the system to `systems/registry.json` and run `node scripts/manifest.mjs`.
6. Each system owns its own variable system (`system.json.variableSystem`): the renderer (`tools/render.mjs --system <id>`) loads that system's CSS only, so Frappe desk, URY POS and Huf never leak styles into each other.

## SPA systems captured with mocked APIs ("app" mode, used by `huf`)
When the UI is a single-page app whose backend you do not want to run, capture it from its own build with every API call mocked:
specs get `source` (which build), `fixtures` (route mocks) and `waitFor`; `scripts/capture.mjs` opens a fresh mocked context per spec
instead of logging in to a bench (see `scripts/huf/app.mjs` and `systems/huf/README.md`). Specs may set `modes` (default light/dark/rtl)
and `slotNames` (semantic slot names for utility-class markup such as Tailwind).
