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
| `systems/` | which UI you are animating (`registry.json`): `frappe-desk`, `ury-pos`, planned `huf` — each owns its variable system. See `systems/ADDING_A_SYSTEM.md` |
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
- States: hover/focus/active are captured for every component that has an interactive element (explicit spec or auto-derived from its first interactive element). disabled/error/loading/empty exist only where the real UI has them (field-*, page-head, list-view, pos-cart, …); elsewhere `states.json` says `applicable:false` with the reason.
- KOT: `pos-kot-board` is the real Mosaic kitchen board with live tickets (Queued / Preparing / Ready); `pos-kot-view` is the Mosaic unit overview; `kot-list`/`kot-form` are the desk KOT screens. Mosaic only shows KOTs from the last 3 h (site time), so recapturing `pos-kot-board` needs `scripts/kot/kot-shift.sql` applied to the bench (`bench --site <site> mariadb < kot-shift.sql`) and `scripts/kot/kot-restore.sql` afterwards.
- The kit lives at `tracks/sa-ui-kit/ui-kit` of the URY workspace (symlinked as `ury_workspaces/ui-kit`); repo layout: `ui-kit/` is the kit directory; the repo root only holds README, SKILL.md and package.json.
