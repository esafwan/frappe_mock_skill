# Slice 4: reports, group-by, workspace depth, charts, dashboard

Builds on SLICE1 to SLICE3. All logic is generic: names come from specs, meta and data, never from renderers.

## What works
- **Datatable kit (`kit-lib/datatable/`).** `renderDatatable(columns, rows, opts)` composes head (sort indicator, resize handle, header dropdown, sticky columns), body (index lead column, "Label (Child)" names, tree indent, inline-edit cell, currency) and totals row. Header, body and totals share one width per column. Used by the report view and the query report.
- **Report view (`renderers/report/view.mjs`, `index.mjs`).** Report Builder columns from `meta.report.json.fields` (child columns, "ID", "Index"), saved-report mode, filters and chips, group-by (columns become value + Count), totals, chart toggle, states (loading, empty, no results), column dropdown (`view.column_menu {col}`), `view.resizing`, `view.editing {row,col}`. Dialogs (Pick Columns, Add Column, Export, Save As, Create Chart) come from `report/dialogs.mjs` and are claimed by overlay `kind`.
- **Query / script report (`renderers/query_report/index.mjs` re-exports `report/query.mjs`).** Filters (collapsible), summary cards, message, chart, Prepared Report states, tree rows, totals row.
- **Charts (`kit-lib/chart.mjs` facade over `kit-lib/chart/{axis,pie,heatmap}.mjs`).** "Others" bucket past 6 slices, 9-point cap, "No data" state, granularity and timespan selectors, stacked option. Proportionality tests in `kit-lib/chart/chart.test.mjs`.
- **List group-by (`renderers/list/groupby.mjs`).** Overlay `menu_open` target `group_by:assigned_to|owner|tags` draws the counts dropdown from the loaded rows (v16 rules: "Me" first, "Not Set").
- **Workspace.** Shortcuts for all `doc_view` values, card link dependencies and the onboard dot, v16 onboarding, sanitised and scoped Custom HTML Block, public/private/role badges.
- **Dashboard (`renderers/dashboard/index.mjs`).** `meta.dashboard {charts:[{chart,width}], cards:[{card}]}`; data in `data.charts` and `data.number_cards`; chart filter popover (`dashboard.chart-filter:<name>`), page menu (`dashboard.menu`).
- **Gates widened.** `tests/geometry.mjs` and `tests/determinism.mjs` cover every `samples/*.json` and write `out/slice4/`. Stacked dialogs offset diagonally.

## Commands (from `ui-kit/`)
```
node bin/mock.mjs validate samples/*.json
node bin/mock.mjs render samples/s4-report-stress.json --out out/slice4/s4-report-stress.html
node tests/determinism.mjs      # renders all samples twice, byte-compares, writes out/slice4/
node tests/geometry.mjs         # re-renders and checks out/slice4/
node tests/slice4.test.mjs      # slice 4 gate
node tests/shots.mjs out/slice4/s4-*.html
for t in $(fd -e mjs test . --exclude node_modules --exclude out); do node $t; done
```
Samples: `samples/s4-*.json` (report, query report, dashboard, workspace, list group-by).

## Gaps
- Sticky header columns do not stay sticky in the body (static render only).
- Number-card, pie and percentage charts in narrow workspace columns are not tuned; the percentage bar is thin.
- Sidebar group-by trigger deferred to the sidebar slice. v16 puts group-by in the sidebar, so there is no toolbar button; the dropdown stays overlay-only (`menu_open` target `group_by:<field>`).
- Query-report datatable columns keep their set widths, so the header band can end before the row borders do (as in frappe-datatable).
- Prepared-report progress bar does not draw the filled portion.
- `s3-form-activity-more` still warns at validate (no "connections" tab), from slice 3.
- Query-report column types beyond the common ones fall back to Data formatting.

## Decisions
1. **Renderer-owned overlay targets.** `dashboard.menu` and `dashboard.chart-filter:*` are NOT in the menu registry. The dashboard renderer draws them in place (it consumes them through `ctx.useOverlays`). `kit-lib/draw.mjs` exports `OWNED_TARGETS` / `isOwnedTarget()` and skips these targets, so two renderers never draw the same overlay. Any other `menu_open` target that neither the registry nor a renderer can draw now throws `menu_open target "<t>" is not in the menu registry and no renderer drew it` instead of quietly drawing nothing. The schema pattern still allows the owned targets. Owned list today: `dashboard.*`.
2. **Group-by is overlay-only.** No toolbar button (not v16). See Gaps.
3. **Pick Columns offers child-table columns.** One group header per doctype (parent first, then each `meta.children` table); the columns already shown in the report are pre-checked. Picker keys are `fieldname` for the parent and `<Child>.<fieldname>` for child columns. Sample: `s4-report-dialog-pick-columns`. Create Chart's Y axis now lists numeric fields first.

## Visual review (screenshots looked at, 1440x900)
All 30 `s4-*` samples: report (stress, groupby, groupby-open, chart-hidden, menu, colmenu, loading, empty, no-results), five report dialogs (pick-columns, add-column, export, save-as, create-chart), query report (plain, collapsed, menu, message, prepared, empty), dashboard (plain, filter, menu, empty), list group-by, odd-all-list, workspace (all, legacy, menu, role).
Spot-check of s1 to s3 for datatable and chart regressions: `s1-sinv-submitted`, `s2-odd-a-draft`, `s3-customer-list`, `s3-list-bulk`, `s3-list-empty`, `s3-list-quick-filters`, `s3-list-mobile` (375px), `s3-form-grid`, `s3-form-activity`, `s3-form-workflow`, `s3-dialog-confirm-stack`. No regressions.
Defects found by the review and fixed: query-report page head drew the title twice and overlapped its actions; the dashboard page menu opened but drew nothing; `layers.mjs` had lost the stacked-dialog offset numbers (`calc(5vh + px)`); Create Chart defaulted Y to a text field.

## Tests added (`tests/slice4.test.mjs`, `tests/geometry.mjs`)
- Datatable column widths equal across head, body and totals (stress, group-by, query report); report width at least 95% of the content area (also a geometry check on every report-view page).
- Chart values non-zero for child-column keys.
- Pick Columns child group header and pre-checked child column.
- Owned-target allowlist; unregistered, non-owned target errors; `dashboard.menu` drawn once, in place.
- Stacked dialogs offset 28px per level, both directions, no `+ px`.
