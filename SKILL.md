---
name: frappe-mock-ui
description: Build fake-but-pixel-exact Frappe v16 desk (ERPNext/URY) and URY POS screens for demo videos from backend-free, JS-free components. Use when a video/animation needs UI that looks exactly like the real app, in light/dark, LTR/RTL Arabic, with swappable currency (AED/SAR/QAR/USD/EUR/INR…) and ready menus with real food photos.
---
# frappe-mock-ui
Everything is under `ui-kit/`. Read `ui-kit/README.md` (layout) and `ui-kit/AGENT_GUIDE.md` (workflow); all paths below are relative to `ui-kit/`. Entry points:
- `manifest.json` — every component, its slots (type/sample/maxLength), states, targetable `data-ui` ids and pixel boxes, systems and pages.
- `pages/*.html` — finished screens (`desk-list`, `desk-form`, `pos-register`) plus `.dark`, `.ar-AED`, `.en-EUR` and menu variants like `pos-register.mediterranean-ar-AED.html`.
- `node tools/render.mjs <component> --locale ar-AE/AED --menu mediterranean --theme dark --out out.html` — render one component with locale, currency, theme and menu JSON.
- `systems/registry.json` — choose the UI system (`frappe-desk`, `ury-pos`, planned `huf`); each has its own variables/CSS. Add one via `systems/ADDING_A_SYSTEM.md`.
- `data/menus/*.json` (cafe, south-indian, north-indian, mediterranean[en+ar], qsr-chicken-burger, fine-dine) with real photos in `data/images/`; `data/universals/` for currencies, languages (RTL), locales, en/ar UI strings.
Rules: change text only via slots (respect `maxLength`); never fetch at render time; keep CC BY / CC BY-SA photo attribution (`data/CREDITS.md`) in published videos; re-capture with `scripts/all.sh` against a live v16 bench when the real UI changes.
