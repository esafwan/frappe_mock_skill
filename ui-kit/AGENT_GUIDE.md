# Guide for the video agent
1. Pick the **system** (`systems/registry.json`): `frappe-desk` for v15 desk/ERPNext screens, `ury-pos` for the POS, `ury-desk` for the URY v16 desk, `ury-captain` (waiter), `ury-mosaic` (KDS), `ury-self-order` (QR), `ury-kiosk`, `ury-admin`, `ury-brief` (v16 apps, source commit 100c43fe2e; details in README.md "URY v16 systems"). Each system has its own CSS + variables; never mix their CSS in one page.
2. Pick a **locale** from `data/universals/locales.json` (e.g. `ar-AE/AED`, `ar-SA/SAR`, `en-IN/INR`, `de-DE/EUR`, `en-US/USD`). Arabic locales set `dir=rtl` and translate fixed UI words via `data/universals/i18n/ar.json`; currency slots are re-formatted (symbol side, decimals, grouping).
3. Pick a **menu** from `data/menus/` (`mediterranean` is the only fully Arabic one). Item names, prices-per-currency and photos load from JSON; POS components that have a `bindings.json` accept `--menu`.
4. Start from `pages/*.html` (complete screens) or assemble your own from `components/<id>/component.html`. Target elements by `data-ui` ids listed in `manifest.json` (`targets`), whose pixel boxes are in each `measurements.json` (1440×900 @2×) — use them for cursor paths and click highlights.
5. Show a state by applying the class/attribute changes in `states.json` (hover/focus/active are CSS pseudo-states: also ship a `states/<state>.png` screenshot).
6. Change text only through slots (`slots.json` gives type, sample and max length — respect `maxLength` so layouts do not break).
7. Never fetch anything at render time. If you need new data, add it to `data/` and re-run `node scripts/docs.mjs`.

## URY v16 systems
Prefer `ury-*` screens (`ury-<app>-screen-*`) for anything URY v16; each system's components share one cafe menu and photos from `data/images/`. Variants: `preview.html`, `preview.dark.html`, `preview.rtl.html`. Re-capture: `node scripts/capture.mjs <ids>` from `ui-kit/` (specs `scripts/specs-ury-*.mjs`). See README.md "URY v16 systems" for screens and the v16 desk essence.
