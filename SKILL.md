---
name: frappe-mock-ui
description: Build fake-but-pixel-exact Frappe v16 desk (ERPNext/URY) and URY POS screens for demo videos from backend-free, JS-free components. Use when a video/animation needs UI that looks exactly like the real app, in light/dark, LTR/RTL Arabic, with swappable currency (AED/SAR/QAR/USD/EUR/INR…) and ready menus with real food photos.
---
# frappe-mock-ui
Everything is under `ui-kit/`. Read `ui-kit/README.md` (layout) and `ui-kit/AGENT_GUIDE.md` (workflow); all paths below are relative to `ui-kit/`. Entry points:
- `manifest.json` — every component, its slots (type/sample/maxLength), states, targetable `data-ui` ids and pixel boxes, systems and pages.
- `pages/*.html` — finished screens (`desk-list`, `desk-form`, `pos-register`) plus `.dark`, `.ar-AED`, `.en-EUR` and menu variants like `pos-register.mediterranean-ar-AED.html`.
- `node tools/render.mjs <component> --locale ar-AE/AED --menu mediterranean --theme dark --out out.html` — render one component with locale, currency, theme and menu JSON.
- `systems/registry.json` — choose the UI system (`frappe-desk`, `ury-pos`, `ury-captain`, `ury-mosaic`, `ury-self-order`, `ury-kiosk`, `ury-admin`, `ury-brief`, `ury-desk` (URY v16, see section below), `huf` (foundation: real HUF SPA captured with mocked APIs, see `systems/huf/README.md`)); each has its own variables/CSS. Add one via `systems/ADDING_A_SYSTEM.md`.
- `data/menus/*.json` (cafe, south-indian, north-indian, mediterranean[en+ar], qsr-chicken-burger, fine-dine) with real photos in `data/images/`; `data/universals/` for currencies, languages (RTL), locales, en/ar UI strings.
Rules: change text only via slots (respect `maxLength`); never fetch at render time; keep CC BY / CC BY-SA photo attribution (`data/CREDITS.md`) in published videos; re-capture with `scripts/all.sh` against a live v16 bench when the real UI changes.

## Loyal Arrow extension
See `loyal-arrow/README.md`: brand, sidebar/workspace/report structure, copy, synthetic UAE and India datasets and flow scripts for the Loyal Arrow loyalty app.

## URY v16 systems (static mocks, source `version-16` @ 100c43fe2e)

Eight systems cover the whole URY v16 product. All render offline, JS-free, light + dark + RTL (Arabic, `dir=rtl`) at 1440x900 @2x unless noted; photos come from `data/images/<menu>/` (see `data/credits`). Contact sheet (one light screen per app): `ui-kit/docs/ury-contact-sheet.png`.

| System | Group / prefix | Components (screens) | What it is |
|---|---|---|---|
| `ury-pos` | `pos-*` (57; 12 `pos-screen-*`) | register, tables, orders, reservations, dashboard, settings, dialogs | POS SPA (React/Tailwind); extended with the v16 static recapture (`scripts/specs-ury-pos-static.mjs`) |
| `ury-captain` | `ury-captain-*` | 10 (4) | waiter PWA: table grid, order taking, send-to-kitchen bar, service requests |
| `ury-mosaic` | `ury-mosaic-*` | 10 (4) | kitchen display: production-unit cards, item pills, alerts, delayed/empty boards |
| `ury-self-order` | `ury-self-order-*` | 14 (8) | table-QR ordering on phone and tablet: menu, detail, cart, checkout, status |
| `ury-kiosk` | `ury-kiosk-*` | 9 (9) | self-service kiosk, landscape and portrait, same cafe menu and photos |
| `ury-admin` | `ury-admin-*` | 18 (9) | urypos admin: service board dashboard, reports (daily P&L), masters, printer config, setup wizard, sales plan |
| `ury-brief` | `ury-brief-*` | 8 (5) | Brief mobile app: today story, chats, call, settings |
| `ury-desk` | `ury-desk-*` | 17 (9) | the Frappe v16 desk as URY ships it (below) |

**v16 desk essence (`ury-desk`, partOf `frappe-desk`).** v16 replaced the v15 top navbar menu with: a left sidebar (app switcher, search, workspace links in collapsible sections Plan, Operate, Observe, Control, Setup), a bottom dock of app icons, a slim navbar with only the global search (Ctrl/Cmd+K awesomebar), notifications bell and avatar (the navbar logo was removed), `es-breadcrumbs` page heads, and workspaces made of shortcuts, link cards and number cards. List, form, report and POS-Invoice screens sit in that shell (`ury-desk-shell`). Do not mix with v15 `frappe-desk` components.

**Source of truth.** `/Users/safwan/Code/ury-v16-latest` (branch `version-16`, commit `100c43fe2e`). Query its structure with `graphify query "<words>" --graph /Users/safwan/Code/ury-v16-latest/graphify-out/graph.json`. Each `systems/ury-*/system.json` records the commit.

**Re-capture.** Specs are hand-authored from v16 class lists, not a live bench:
```bash
cd ui-kit
node scripts/capture.mjs <component-id> [...]      # re-render screenshots, previews, states, measurements
# specs: scripts/specs-ury-<system>.mjs (aggregators) -> scripts/ury-v16/<system>/*.mjs (+ cafe-images.mjs for menus)
# CSS: tokens/css/ury-v16/components/*.css ; shared static helper: scripts/static-capture.mjs
node scripts/manifest.mjs && node scripts/docs.mjs # then `git checkout` any huf-*/pos-* README churn they rewrite
node scripts/lint.mjs && node scripts/verify.mjs 'ury-*'
```
