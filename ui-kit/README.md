# ury-ui-kit

Backend-free, pixel-verified captures of the **real** Frappe v16 desk (ERPNext / URY) and the **URY POS**, packaged as reusable
components so a video agent can build fake UI flows that look exactly like the real app — in light/dark, LTR/RTL (Arabic),
with any currency, and with ready-made demo menus (real food photos).

Captured with Playwright from a live Frappe v16 bench (ury `version-16`, seeded demo data, dev mode, light theme, 1440×900 @2×, user Administrator).
Nothing in `components/` or `pages/` needs a server, JavaScript, network, a clock or randomness.

## Layout
| Path | What |
|---|---|
| `tokens/` | compiled desk CSS (`frappe-desk.css`, report, erpnext, hrms), URY POS CSS, CSS variables for light+dark (`theme-vars.css`, `tokens.json`), Inter fonts, icon sprite (`icons/sprite.svg.html`) |
| `components/<id>/` | `component.html` (real DOM, `{{slots}}`, `data-ui` ids) · `states.json` · `slots.json` · `screenshot.png` (+`.dark`/`.rtl`) · `measurements.json` (size/position of every interactive element) · `preview*.html` (JS-free) · `README.md` |
| `pages/<id>.html` | whole pages composed **only** from components (+ `.dark`, `.ar-AED`, `.en-EUR` variants) |
| `manifest.json` | index of every component/page/menu/system with slots, states, targets and stable ids (e.g. `form-title.save`) |
| `systems/` | which UI you are animating (`registry.json`): `frappe-desk`, `ury-pos`, `huf` (React SPA captured from its build with mocked APIs: `systems/huf/README.md`) — each owns its variable system. See `systems/ADDING_A_SYSTEM.md` |
| `data/universals/` | currencies (AED, SAR, QAR, USD, EUR, INR …), languages (+RTL flags), locale presets, en/ar UI strings |
| `data/menus/` | pre-populated menus (café, South/North Indian, Mediterranean with Arabic, QSR chicken-burger, fine-dine) with real photos in `data/images/` |
| `tools/render.mjs` | render any component/page with a locale, currency, theme and menu — fully offline |
| `scripts/` | capture / verify / lint / docs pipeline (re-populate from a live bench any time) |

## Use
```bash
node tools/render.mjs pos-cart --locale ar-AE/AED --menu mediterranean --out /tmp/cart.html   # Arabic POS cart, dirham, Levantine menu
node tools/render.mjs field-currency --currency EUR --theme dark
```
## Re-populate / re-capture (needs a bench)
```bash
BASE=http://localhost:8001 node scripts/tokens.mjs        # tokens, CSS, fonts, sprite, theme vars
node scripts/capture.mjs [ids]                           # components (light, dark, rtl, states)
node scripts/verify.mjs                                  # JS-off render vs its own screenshot, fails > 0.5 % pixels
node scripts/pages.mjs verify                            # composed pages vs live pages
node scripts/lint.mjs && node scripts/check-data.mjs     # no network/JS/clock; menu + image integrity
node scripts/docs.mjs                                    # READMEs + manifest.json
```
See `AGENT_GUIDE.md` for how a video agent should drive the kit. Photo credits: `data/images/*/CREDITS.md` (Wikimedia Commons / Unsplash licences — keep attribution when publishing).

## Verification status (rebuilt 2026-11-06)
- 41 components × light/dark/RTL = 123 JS-off pixel checks, all ≤ 0.5 % (`node scripts/verify.mjs`).
- 3 pages × light/dark/RTL compared to live captures, all ≤ 0.5 % (`node scripts/pages.mjs verify`; `pages-verify-report.json`). Variants with translated text, swapped currency or menu data have no live twin and are marked `verifiedAgainstLive:false` in `manifest.json`.
- State coverage (41 components): hover 36, focus 37, active 37, disabled 25 (real `disabled` attribute + `.disabled` applied to the first control, computed-style delta recorded), error 8, empty 2, loading 10 (real Frappe busy button: aria-busy="true" on .es-button). Hover/focus/active are captured for every component that has an interactive element (explicit spec or auto-derived from its first interactive element). disabled/error/loading/empty exist only where the real UI has them (field-*, page-head, list-view, pos-cart, …); elsewhere `states.json` says `applicable:false` with the reason.
- KOT: `pos-kot-board` is the real Mosaic kitchen board with live tickets (Queued / Preparing / Ready); `pos-kot-view` is the Mosaic unit overview; `kot-list`/`kot-form` are the desk KOT screens. Mosaic only shows KOTs from the last 3 h (site time), so recapturing `pos-kot-board` needs `scripts/kot/kot-shift.sql` applied to the bench (`bench --site <site> mariadb < kot-shift.sql`) and `scripts/kot/kot-restore.sql` afterwards.
- The kit lives at `tracks/sa-ui-kit/ui-kit` of the URY workspace (symlinked as `ury_workspaces/ui-kit`); repo layout: `ui-kit/` is the kit directory; the repo root only holds README, SKILL.md and package.json.

- Page variants: every page file (22) also has its own screenshot in `pages/shots/` and renders within 0.5 % of it with JavaScript removed and zero network requests (`node scripts/pages-self.mjs`, `pages-self-report.json`); base/dark/rtl pages are additionally compared to live captures.

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
