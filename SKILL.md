---
name: frappe-mock-ui
description: Build fake-but-pixel-exact Frappe v16 desk (ERPNext/URY) and URY POS screens for demo videos from backend-free, JS-free components. Use when a video/animation needs UI that looks exactly like the real app, in light/dark, LTR/RTL Arabic, with swappable currency (AED/SAR/QAR/USD/EUR/INR…) and ready menus with real food photos.
---
# frappe-mock-ui
Everything is under `ui-kit/`. Read `ui-kit/README.md` (layout) and `ui-kit/AGENT_GUIDE.md` (workflow); all paths below are relative to `ui-kit/`. Entry points:
- `manifest.json` — every component, its slots (type/sample/maxLength), states, targetable `data-ui` ids and pixel boxes, systems and pages.
- `pages/*.html` — finished screens (`desk-list`, `desk-form`, `pos-register`) plus `.dark`, `.ar-AED`, `.en-EUR` and menu variants like `pos-register.mediterranean-ar-AED.html`.
- `node tools/render.mjs <component> --locale ar-AE/AED --menu mediterranean --theme dark --out out.html` — render one component with locale, currency, theme and menu JSON.
- `systems/registry.json` — choose the UI system (`frappe-desk`, `ury-pos`, `huf` (foundation: real HUF SPA captured with mocked APIs, see `systems/huf/README.md`)); each has its own variables/CSS. Add one via `systems/ADDING_A_SYSTEM.md`.
- `data/menus/*.json` (cafe, south-indian, north-indian, mediterranean[en+ar], qsr-chicken-burger, fine-dine) with real photos in `data/images/`; `data/universals/` for currencies, languages (RTL), locales, en/ar UI strings.
Rules: change text only via slots (respect `maxLength`); never fetch at render time; keep CC BY / CC BY-SA photo attribution (`data/CREDITS.md`) in published videos; re-capture with `scripts/all.sh` against a live v16 bench when the real UI changes.

## Loyal Arrow extension
See `loyal-arrow/README.md`: brand, sidebar/workspace/report structure, copy, synthetic UAE and India datasets and flow scripts for the Loyal Arrow loyalty app.

## Feature catalogues

Before building a mock or screen for an app (URY, Huf, Huf WhatsApp channel, frappe_whatsapp, Genie, Pulse, DeskAI, Loyal Arrow), read its catalogue in `docs/catalogues/` (index: `docs/catalogues/README.md`). Show only features listed as built, and never mock "Planned" items as shipped.

## Mock-spec engine (any desk page from one JSON)

For any Frappe v16 desk screen (any DocType form or list, report, workspace, dashboard, dialog, open menu), write one `mock-spec/1` JSON and render it; do not hand-edit HTML. Everything is under `ui-kit/`; run commands from there.

```
node bin/mock.mjs validate <spec.json>... [--json]
node bin/mock.mjs render <spec.json> --out out.html [--theme dark] [--rtl] [--viewport mobile|tablet|WxH] [--today YYYY-MM-DD] [--locale xx]
node doctype/shot-doctype.mjs out.html out.png          # 1440x900 screenshot; --full for the whole page
```

Spec shape: `{page, ctx, meta, data, overlays, view}`.
- `page`: form, list, report, query_report, workspace, dashboard, kanban, calendar, gantt, tree, image, map, inbox, dialog, blank.
- `meta`: Frappe-native JSON by name, path or inline (DocType, Workspace, Report, Workflow, ...). Never invent a parallel format.
- `data`: `doc`, `rows` (or `{"$gen": {count, seed}}` for deterministic sample rows), `total`, `charts`, `number_cards`, `events`.
- `overlays`: only what metadata cannot say: `button`, `intro`, `menu_open` (target registry in `docs/SPEC.md`), `dialog`, `row_open`, `field_open`, `list_select`, `filter_chips`, `state` (hover, focus, disabled...), `toast`.
- `ctx`: theme, locale, rtl, viewport, `today` (always set it), user roles, `perms`, `system` (number and date formats).
  - Direction: locale `ar`, `he`, `fa` or `ur` implies RTL; an explicit `ctx.rtl` (true or false) always wins, so `{"locale": "ar", "rtl": false}` stays LTR.
  - `perms` (absent = everything allowed, output unchanged): `{"<DocType>": {"write": false, "create": false, "delete": false, "export": false, "levels": {"1": {"read": false}}}, "*": {...}}`, or flat `{"write": false}` for every DocType. Hides primary and secondary actions and menu items (create, write, delete, submit, cancel, amend, print, export, email, import), makes fields read-only without write and hides fields above the readable permlevel, and drops sidebar and workspace items (shortcuts, card links, quick lists) whose DocType has `read: false`.
  - `system` (only when the spec declares it; otherwise each locale keeps its own look): `number_format` (`#.###,##` = decimal comma), `date_format`, `time_format`, `currency_precision`, `float_precision`. It formats Currency, Float, Int, Date, Datetime and Time in list, report and grid cells, form read-only values, number cards and chart axes.
  - View pages (kanban, calendar, gantt, tree, image, map, inbox) open dialogs through the same `dialog` overlay: `quick_entry` (the page's own DocType), `view_filter` `{filters: [[field, op, value]]}`, `view_sort` `{sort_by, sort_order}` and `pick_columns`.

Rules: output is deterministic (render twice, bytes match); text in cells is one line; never put doctype, app or brand names in the engine, only in specs; warnings about overlays "not drawn" mean the target does not exist on that page, so fix the spec. Exit codes: 0 ok, 1 invalid spec, 2 no renderer.

Start from a recipe: `ui-kit/docs/RECIPES.md` lists 30 specs (`ui-kit/docs/recipes/*.json`), each with a "what you see" line. Copy one, change `meta.doctype` and the data. Full reference: `ui-kit/docs/SPEC.md`; per-slice notes `ui-kit/docs/SLICE*.md`; states `ui-kit/docs/STATES.md`.
