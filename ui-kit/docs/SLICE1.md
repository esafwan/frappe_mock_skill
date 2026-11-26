# Slice 1: form, list, workspace, blank

Status of the first end-to-end slice of the desk coverage plan (`docs/DESK-COVERAGE-PLAN.md`).

## What works
- `bin/mock.mjs validate|render` over mock-spec/1 (`docs/SPEC.md`).
- Shell (dock, sidebar, page head, main, right panel) from `shell/`; its default export serves slot-returning pages (workspace, blank). Form and list build their own document through the same `renderShell`.
- Form: head (breadcrumb, status pill, custom button groups, "..." menu, primary and secondary actions), intro overlay, odd layouts (fold, column widths, insert_after), sidebar panel.
- List: standard filters, filter chips, selection bar, 1 to 12 columns, sort, paging, indicators, avatars.
- Workspace: all 10 block types on a 12-column grid, real Selling and Accounts samples.
- Blank: shell only.
- Navbar is off by default (`chrome.navbar`: false); set it to `true` to draw it.

## Commands (from `ui-kit/`)
```
node bin/mock.mjs validate samples/*.json
node bin/mock.mjs render samples/s1-sinv-submitted.json --out out/slice1/s1-sinv-submitted.html
node doctype/shot-doctype.mjs out/slice1/s1-sinv-submitted.html out/slice1/s1-sinv-submitted.png   # 1440x900; add --full for the whole page
bash doctype/render-all.sh                                   # legacy fixtures still render
for t in $(fd -e mjs test . --exclude node_modules); do node $t; done
```
Slice samples: `samples/s1-*` to `s7-*` (data in `samples/data/`, workspace records in `samples/workspaces/`). Output and screenshots: `out/slice1/`.
Two renders of every sample are byte-identical.

## Gaps
- Overlays not drawn yet: `menu_open` (`button_group:*`, `page.sort`), `state` (hover/focus) on form, list and workspace. They are reported as warnings.
- A 12-column list overflows the page width slightly and truncates the ID column; column width fitting is not done.
- Workspace pages do not highlight the active sidebar item.
- Workspace charts and number cards need `data.charts` and `data.number_cards`; without them an empty state or 0 is drawn.
- List "12 of 1000+" count style follows v16 for totals above 1000.
- `guess_colour` in `kit-lib/indicators.mjs` uses a local word table, not Frappe's list.
- Legacy regex renderer now lives in `doctype/legacy/legacy.mjs` (`--legacy`), outside the generic-name guard.
