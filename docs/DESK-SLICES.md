# Remaining desk coverage work: slices 2 to 5

Ordering by Opus (low effort) after slice 1 (PR #9). It is based on `docs/DESK-COVERAGE-PLAN.md`; `#N` refers to an item in that plan's critique appendix. Rules:

- Each agent owns its files alone.
- New logic goes in new `kit-lib/*.mjs` files.
- `bin/mock.mjs` and `kit-lib/base.css` have one named owner per slice.

## Slice 2: fix slice 1, overlays and states, finish the shell

| Task | Owned files | Notes |
|---|---|---|
| FIX-RO | `renderers/form/readonly.mjs`, `doctype/fields/_ro.mjs` | Submitted (docstatus 1) or cancelled (docstatus 2) makes every field read-only unless `allow_on_submit`. Also covers the Cancelled and amended-from banners. |
| FIX-TITLE | `renderers/form/title.mjs` | Title is `doc.name`, or `title_field` when `show_title_field_in_link` is set. Matrix test for docstatus 0/1/2, unsaved, workflow and amended. |
| FIX-DOCK | `shell/dock.mjs`, `shell/icons.mjs` | Resolve the app logo and icons from the full lucide set and warn on a miss. A blank square fails the test. |
| FIX-DATA | `data/gen.mjs`, `data/pools/*.json` | Realistic pools per Link target instead of "Customer Group 0". Text in cells is one line, so rows keep a fixed height. |
| FIX-COLS | `renderers/list/fit.mjs`, `kit-lib/colwidth.mjs` | Fit column widths and cap the number of fields; the subject column always comes first. No horizontal overflow at 12 columns. |
| FIX-WS | `renderers/workspace/layout.mjs`, `renderers/workspace/blocks/chart.mjs` | Honour block `col`. Charts take the full width with a minimum height. Fix the onboarding layout. Highlight the active sidebar item. |
| T-S4 + #18 | `shell/menus.mjs`, `kit-lib/menu-registry.mjs`, `tests/menu-registry.test.mjs` | A registry of `menu_open` targets; a test renders every id. |
| STATE #17 | `kit-lib/states.mjs`, `docs/STATES.md` | States hover, focus, active, disabled and loading. Targets `row:N`, `cell:r,c` and `button:id`. Applied on form, list and workspace. |
| LAYERS #19 #20 | `kit-lib/layers.mjs` | Layers page, popover, modal and toast. Backdrop, dialog over dialog, toast stacking. |
| T-S5 + T-S6 | `shell/mobile.mjs`, `tests/parity-shell.mjs` | Mobile and collapsed shell. Parity checks a structural diff plus the pixel diff. |
| T2 | `adapters/{sidebar,workspace,report}.mjs` | Nested `children` is the canonical shape. |
| GATE | `tests/geometry.mjs`, `tests/output-hygiene.mjs` | Every `[data-ui]` slot has nonzero area. No horizontal overflow. No `undefined`, `NaN`, `[object Object]` or `{{` in the output. |

**Gate:**
- All slice-1 samples render byte-identical twice.
- The geometry and hygiene tests pass.
- Every menu id and every state draws.
- None of the 7 issues seen in slice 1 remains.

## Slice 3: form completion, dialogs, list interactions

| Task | Owned files | Notes |
|---|---|---|
| T-F4a | `kit-lib/grid.mjs`, `doctype/fields/table.mjs` | Grid footer, row-select, `in_list_view` widths, read-only grid, drag handle, paging at 50 rows. |
| T-F4b | `renderers/form/rowform.mjs` | Row-edit form, grandchild tables, "Edit in full page". |
| T-F5 | `renderers/form/sidebar.mjs` | Form sidebar driven by data: attachments, assignees, tags, share, likes. |
| T-F6 | `renderers/form/timeline.mjs`, `renderers/form/connections.mjs` | All timeline types, date separators, "More". Connections with counts and "+" buttons. |
| T-F7 | `renderers/form/workflow.mjs` | "Actions" dropdown filtered by role. |
| T-F9 | `renderers/dialog.mjs`, `renderers/quick-entry.mjs` | Dialog sizes, Section, Column and Table fields, "Edit Full Form". |
| FORM-DLG | `renderers/dialogs/form-dialogs.mjs` | Assign To, Share, Attach, Add Tag, Rename, Email composer, missing-mandatory, modified-conflict and server-error dialogs. |
| FIELD-OPEN | `doctype/fields/open/*.mjs` | Link dropdown ("Create a new", "Advanced Search", "No results"), date and color pickers, mandatory error highlighting, permlevel read-only. |
| T-L5 | `renderers/list/bulk.mjs` | Bulk bar with Actions menu, row action button. |
| T-L7 | `renderers/list/dialogs.mjs` | List settings, Customize Quick Filters, saved views. |
| T-L8 | `renderers/list/states.mjs`, `renderers/list/meta.mjs` | Empty, no-results, skeleton and mobile card states. Meta block. |
| T-G1 + T-G2 | `shell/{awesomebar,notifications}.mjs`, `samples/s3-single-*.json` | Awesomebar and notifications. Single DocTypes show "Update" and no status pill. |

**Gate:**
- `odd_child` and `odd_grand` render rows, the grid footer and the row form.
- Every dialog id opens from an overlay.
- The docstatus × workflow matrix passes.
- Geometry and hygiene tests stay green.

## Slice 4: reports, group-by, workspace depth, charts, dashboard

| Task | Owned files | Notes |
|---|---|---|
| T-R1a | `kit-lib/datatable/head.mjs` | Header dropdown, sort indicator, resize, alignment. |
| T-R1b | `kit-lib/datatable/body.mjs` | Tree indent, "Label (Child)" column names, `idx` shown as "Index", Currency, inline-edit state. |
| T-R1c | `kit-lib/datatable/totals.mjs` | Totals row, "Add Total Row", "Show Totals". |
| T-R2 | `renderers/report/view.mjs` | Inline filters, group-by, chart toggle, saved-report mode, Report Builder. |
| T-R3 | `renderers/report/query.mjs` | 14 filter controls, summary cards, banner, Prepared Report states. |
| T-R4 | `renderers/report/dialogs.mjs` | Pick Columns, Add Column, Export, Save As, Create Chart. |
| T-L6 (re-scoped) | `renderers/list/groupby.mjs` | v16 has no list sidebar. Instead: group-by dropdown with counts, tag filter, "Assigned To" and "Created By" pickers. |
| T-C1 | `kit-lib/chart/{axis,pie,heatmap}.mjs` | Proportionality tests. "Others" bucket at 6 slices / 9 points. "No data" state. Granularity selector. |
| T-W2 | `renderers/workspace/blocks/{shortcut,card}.mjs` | The 8 `doc_view` variants and the onboard dot. |
| T-W3 | `renderers/workspace/blocks/{onboarding,custom_block,quick_list}.mjs` | Onboarding, Custom HTML Block and quick list blocks. |
| T-W4 | `renderers/workspace/head.mjs` | Public, private and role badges, header menu, empty state. |
| T-V4 | `renderers/dashboard.mjs` | Chart and number-card grid, chart filter popover. |
| T-LEG | `ui-kit/samples/*.json` (legacy, no `[st]N-` prefix), `ui-kit/tests/{geometry,determinism}.mjs` | Delete a legacy sample that duplicates an `[st]N-*` sample; rename the sole cover of a surface into the gated scheme (e.g. `s4-workspace-legacy.json`) and fix it. For `samples/workspace.json` find why `link.onboard` has zero area (empty onboarding link with no label, or a hidden container): drop it from the sample data or render its label. Then widen the geometry and determinism globs to `samples/*.json`. |

**Gate:**
- A stress report with child columns, totals, group-by and a chart passes.
- The chart proportionality tests pass.
- A workspace with every block type, `col` value and `doc_view` renders cleanly.
- Every file in `samples/*.json` passes geometry and determinism (no legacy sample left ungated).

## Slice 5: other views, cross-cutting variants, integration

| Task | Owned files | Notes |
|---|---|---|
| T-V1 | `renderers/kanban.mjs` | Kanban board. |
| T-V2 | `renderers/calendar.mjs` | Calendar view. |
| T-V3 | `renderers/gantt.mjs` | Gantt view. |
| T-V5a | `renderers/{tree,image}.mjs` | Tree and Image views. |
| T-V5b | `renderers/{inbox,map}.mjs` | Inbox view. Map is a static tile with markers. |
| PERMS | `kit-lib/perms.mjs`, schema `ctx.perms` | Hide actions by role, fields by permlevel, and sidebar or shortcut items by role. |
| LOCALE | `kit-lib/format.mjs` | `ctx.system`: number, date and time formats, precision. |
| RTL/DARK | `tests/rtl-dark.mjs`, `kit-lib/base.css` (sole owner) | Arabic RTL acceptance spec. No hex colours in kit-lib. |
| MOBILE | `renderers/form/mobile.mjs`, `tests/viewports.mjs` | Form, report, workspace and dialogs at 375 and 768 px. |
| EMPTY | `kit-lib/empty.mjs` | Empty, loading and error states for every view. |
| T-X1 + T-X4 | `bin/mock.mjs` (sheet), `bin/coverage.mjs` | Contact sheet and coverage matrix page. |
| T-X2 | `SKILL.md`, `docs/RECIPES.md`, `docs/recipes/*.json` | Recipes with their screenshots. |
| T-X3 | review notes, `tests/genericity-allowlist.txt` | Final review by Opus. Genericity guard over all code directories. |

**Gate:**
- Every view renders in light, dark, RTL and mobile.
- The coverage matrix has no red cells.
- The genericity guard is clean.
- Every spec renders byte-identical twice.

## Descoped

- **Login, signup, 403 and 404 pages:** they have no desk chrome.
- **Print view, Print Format builder and PDF:** a separate rendering domain. Only the Print menu entry is kept.
- **Workspace and sidebar edit mode:** a non-goal in the plan.
- **Bespoke Customize Form, Role Permission Manager and Web Form pages:** Customize Form is still supported through the generic form renderer.
- **Help dropdown, keyboard-shortcut dialog, Apps grid, Dock "More":** can be added later as overlays.
- **The v16 list sidebar panel:** v16 has no list sidebar.
- **Extracting client-script buttons:** too fragile, so overlays stay the only input.
