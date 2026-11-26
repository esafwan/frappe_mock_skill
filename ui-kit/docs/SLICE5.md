# Slice 5: other views, cross-cutting variants, integration

## What works
- Pages `kanban`, `calendar`, `gantt`, `tree`, `image`, `inbox`, `map` render from specs (`renderers/<page>/index.mjs`). Samples: `samples/s5-<page>*.json` (default, empty or loading, dark, RTL, mobile; kanban menu and composer; calendar month, week, day; gantt day, week, month).
- Every page type has dark, RTL (Arabic locale) and mobile (375) samples. RTL is a layout mirror plus a translated fixed vocabulary, not a production-grade localisation (see Known RTL gaps) (`s5-<page>-dark|rtl|mobile.json`, built with `extends`).
- `kit-lib/base.css` is inlined into every document (`data-ui="kit.base"`); it is the only place raw colours live. `kit-lib/empty.mjs` draws `view.state` = empty, loading, error or no-results for kanban, calendar, tree, image.
- `$gen` rows are expanded for the new view pages. `applyFormMobile` runs for form pages.
- Slice-4 carry-overs fixed: report chart x-axis (every row up to `MAX_POINTS` = 60), totals alignment, workspace padding, query-report header width, prepared-report progress fill, number-card spacing.

## RTL rule
Direction comes from `ctx.rtl` when the spec sets it (true or false), otherwise from the language: `ar`, `he`, `fa` and `ur` imply RTL (Frappe derives direction from language). So `{"locale": "ar"}` is RTL, `{"locale": "ar", "rtl": false}` is LTR and `{"locale": "en", "rtl": true}` is RTL. `kit-lib/i18n.mjs` translates the fixed vocabulary from `data/universals/i18n/<lang>.json` (exact text nodes, placeholder, title, aria-label). Gantt mirrors its SVG in RTL (shapes through a `scale(-1 1)` group, text positions computed so glyphs stay upright); the time axis runs right to left. Tested in `tests/slice5.test.mjs`.

## Perms contract (`kit-lib/perms.mjs`)
- `ctx.perms` is read from the spec once in `normalizeCtx` (`bin/mock.mjs`) and passed to every renderer on `ctx`. Absent or empty means everything is allowed and the output is byte-identical to a spec without it (`permsOn(ctx)` is false, every gate returns early).
- Shapes: `{"<DocType>": {"read|write|create|delete|submit|cancel|amend|print|export|email|share|report|import": bool, "levels": {"<permlevel>": {...}}}, "*": {...}}`, or flat ptype booleans for every DocType. With perms on and a non-admin user, `meta.permissions` DocPerm rows are also honoured; explicit overrides win.
- Wired in: form head (primary and secondary action, "..." menu items: `renderers/form/menu.mjs perm()`), list head, bulk Actions menu and report menu (`renderers/list/head.mjs listPerm()`), form fields (`fieldsFor` in `renderers/form/index.mjs`: read-only without write, hidden when the permlevel is not readable), list columns (`fieldReadable`), the sidebar (`shell/sidebar.mjs`: items whose DocType has `read: false`, plus `item.roles`) and the workspace (`renderers/workspace/index.mjs`: shortcuts, card links, quick lists).
- Samples: `s5-perms-readonly` (form, Settings tab: no Save, no Delete or Duplicate, no permlevel-1 fields, no Quotation in the sidebar) and `s5-perms-readonly-list` (no Add button, bulk menu without Export and Delete).
- Not covered: child-table row fields and dialog fields by permlevel, per-row permissions, `if_owner`.

## Locale contract (`kit-lib/format.mjs`)
- `ctx.system` (System Settings: `number_format`, `date_format`, `time_format`, `currency_precision`, `float_precision`) drives `ctx.formatSystem`, which exists only when the spec itself declares `ctx.system`. Without it every renderer keeps its legacy per-locale formatting, so specs that never set `system` render exactly as before.
- Routed through the formatter: Currency, Float, Int, Date, Datetime, Time in `kit-lib/cells.mjs formatCell` (list, report, query report and datatable cells, totals row), form read-only values and grid cells (`doctype/lib/control.mjs formatValue`, currency field), number cards (dashboard and workspace) and chart axes and legends (decimal separator); `first_day_of_the_week` sets the calendar and gantt week start.
- Specs that declare an Indian format (`#,##,###.##`) now group lakhs and crores in cells and number cards; below 1,00,000 nothing changes. Percent cells draw a progress bar, only the tooltip text is formatted.
- Sample: `s5-locale-de` (decimal comma, dot grouping, `dd.mm.yyyy`).

## View dialogs
View pages open dialogs through the existing overlay path (`{"type": "dialog", "kind": ...}`, drawn by `kit-lib/draw.mjs`; `bin/mock.mjs` claims them for view pages through `ctx.preDialogs`, code in `renderers/dialogs/view-dialogs.mjs`): `quick_entry` (kanban "Add a card", calendar slot; the page's own DocType unless `doctype` is set), `view_filter` (Field / Condition / Value rows), `view_sort`, `pick_columns`. Query reports now claim the report dialogs (Pick Columns, Export, ...). Samples: `s5-<page>-dialog-*.json`.

## Commands (run from `ui-kit/`)
```
node bin/mock.mjs validate samples/*.json
bash tests/determinism-all.sh          # renders every sample twice into out/slice5/, compares bytes
node tests/geometry.mjs; node tests/output-hygiene.mjs; node tests/determinism.mjs
node tests/rtl-dark.mjs; node tests/viewports.mjs; node tests/parity-shell.mjs
node tests/rtl-ascii.mjs            # ar pages: no new Latin-only text outside <bdi> beyond tests/rtl-ascii-allowlist.json
node tests/slice5.test.mjs             # perms, locale, RTL from locale, view dialogs, coverage reasons
node bin/mock.mjs coverage --strict    # out/coverage/index.html, exit 1 on red cells, prints every n/a skip with its reason
node bin/mock.mjs sheet                # contact sheet
node tests/shots.mjs out/slice5/*.html # 1440x900 screenshots
rg -n "Customer|Loyal|GST|Selling|Sales Invoice|URY|Huf|Acme|Northwind|Territory|Pipeline|Harbor|Atlas|Meridian" renderers kit-lib shell bin adapters schemas data/gen.mjs -g '!*.test.mjs'   # genericity: must print nothing (code and string literals; samples and recipes are data and may use ERPNext names)
```

## Not applicable cells
`bin/coverage.mjs` `NOT_APPLICABLE` is `{page: {column: reason}}`; grey in the matrix, never red, and `coverage --strict` prints the list. Remaining entries: `menu_open` on calendar, gantt, tree, image, map and inbox (Frappe has no row context menu there), `dialog` on workspace (dialogs only open from edit mode, descoped) and dashboard (chart filters are popovers), and the whole `dialog` page row. `dialog` is no longer skipped on any view page.

## Recipes are examples, not defaults
`docs/recipes/*.json` mostly use ERPNext names (Selling, Customer) because the kit mirrors ERPNext screens; they are examples. The kit itself is doctype-agnostic: `kanban-custom-doctype`, `calendar-custom-doctype` and `gantt-custom-doctype` use an inline non-ERPNext DocType (`Maintenance Job`, app `Fleet`). `tests/determinism-all.sh` renders `samples/` and `docs/recipes/` (into `out/slice5/recipes/`) twice and compares bytes; screenshot them with `node tests/shots.mjs out/slice5/recipes/*.html`. `data.rows.$gen` on view pages works with inline or referenced `meta.doctype` and never mutates the loaded spec.

## Known RTL gaps
Frozen in `tests/rtl-ascii-allowlist.json` (checked by `tests/rtl-ascii.mjs`; new gaps fail, fixed ones should be removed with `--update`):
- Untranslated meta labels: workspace and app names, view names ("Calendar View", "Gantt View"), toolbar vocabulary ("Day", "Week", "Month", "Add manually"), many form and report strings.
- Calendar and gantt vocabulary: weekday and month names, "+N more", "Today" are not localised.
- Bidi of counts, IDs, shortcuts and mixed Latin names: not wrapped in `<bdi>` everywhere, so punctuation can land on the wrong side.
- Chart mirroring: gantt mirrors; chart axes and map tiles do not.
- Data values (record titles, names) are left as supplied.

## Known debt
- Hex colours: kit-lib, renderers, shell, bin and adapters are clean except the six files in `tests/hex-allowlist.txt` (`path | max count | reason`). That list is frozen: `tests/rtl-dark.mjs` fails if an entry is added, if a file gets a new hex, or if a reason is missing. Follow-up ticket: "ui-kit: move allowlisted hex colours to --kit-* tokens" (chart axis/heatmap/pie, numbercard, workspace block colour map, navbar). Map tile and tool-page colours are `--kit-map-*` and `--kit-ok-bg` style tokens in `base.css`.
- Doctype-fixture renderers under `doctype/` (render-all.sh) do not receive `ctx.system` and keep their Intl formatting.
- Kanban, tree and map popups use fixture-free static data. Menu overlays are not drawn on calendar, gantt, tree, image, map and inbox.
- Perms: no child-table or dialog-field permlevels, no `if_owner`.
- Column fit in the list renderer truncates long formatted currency (for example `EUR 123.456,50` at 100px); the locale sample uses shorter values.
