# Slice 3: form completion, dialogs, list interactions, navbar

Status of slice 3 of the desk coverage plan (`../docs/DESK-SLICES.md`). Builds on `docs/SLICE1.md` and `docs/SLICE2.md`. All new logic is generic: names come from specs, fixtures and meta, never from renderers.

## What works
- **Child grid (`kit-lib/grid.mjs`, `doctype/fields/table.mjs`).** `Table` fields draw a v16 grid: header, row checkboxes, drag handle, `in_list_view` column widths (8 units), footer (Add Row, Add Multiple, Download, Upload, Delete), paging at 50 rows, read-only grid (eye icon, no checkboxes or buttons) for submitted/cancelled docs and `read_only` fields. `doctype/fields/base.mjs` delegates `Table` to it.
- **Row form (`renderers/form/rowform.mjs`).** Overlay `row_open` opens a row as Frappe's `grid-row-open` panel over a dimmed page: "Editing Row #N", Insert Above/Below, Duplicate, Move, Delete, the child DocType's layout through the real field renderers, "Add Row" and "Edit in full page". `child` nests to open a grandchild row (stacked lower and narrower). Locked like the parent when the document is submitted or cancelled.
- **Field open states (`doctype/fields/open/*`).** Overlay `field_open` shows a Link/Dynamic Link/Autocomplete dropdown ("Create a new", "Advanced Search", "No results"), Date/Datetime/Time pickers, Color picker, Table MultiSelect, and the `error` (mandatory) and `readonly` (permlevel) states. Applied inside the form's `renderField`, so it works in dialogs too.
- **Form sidebar, timeline, connections.** `renderers/form/sidebar.mjs` (assignees, attachments, tags, share, likes, followers, created/modified), `timeline.mjs` (comment box, activity, every item type, date separators, "More"), `connections.mjs` (v16 `form_links` markup, counts, "+" buttons). Timeline shows for saved docs unless `desk_settings.timeline` is false or `view.timeline` is false.
- **Workflow.** `renderers/form/workflow.mjs`: the "Actions" dropdown lists transitions allowed for `ctx.user.roles` (System Manager sees all, self-approval rule honoured); the status pill is the workflow state.
- **Single DocTypes.** `issingle` forms show "Update" and no status pill (unless the document is unsaved).
- **Dialogs.** `kit-lib/draw.mjs` now builds every `dialog` overlay through `renderers/dialog.mjs` (real field renderers, Section/Column/Tab breaks, Table with inline `fields`, sizes), `renderers/quick-entry.mjs` (`kind: quick_entry`), the ten named form dialogs in `renderers/dialogs/form-dialogs.mjs`, and the three list dialogs in `renderers/list/dialogs.mjs` (which also go through `renderDialog`). `ctx.dialogKit` is loaded once by the engine when a spec has a dialog overlay. The saved-views menu (`menu_open` `page.views`, alias `saved_views`) is built by the list renderer and layered by `draw.mjs` (`ctx.preDialogs`, `ctx.preMenus`).
- **List.** Bulk bar and v16-ordered Actions menu (`bulk.mjs`), row actions, empty / no-results ("Nothing to show" + "Clear Filters") / skeleton states, mobile card list (below 768 px), meta block with attachments and assigned-to-me (`states.mjs`, `meta.mjs`). The Actions menu overlay (`list_select.open`) now opens the Actions menu, not the "..." menu.
- **Navbar and popovers.** `ctx.chrome.navbar: true` draws `shell/navbar.mjs` (logo, search button, bell with `ctx.notifications.count`, avatar). `navbar.search` uses `shell/awesomebar.mjs` (query, grouped results), `navbar.notifications` uses `shell/notifications.mjs` (tabs, rows, empty state), and `navbar.*` popovers anchor under their button (tested with real geometry).

## Decisions (review of the slice 3 gate)
- **Dialogs on `renderDialog`.** `renderDialog` takes a raw `body` slot (pre-rendered html, before `fields`), `custom_actions` and `attrs`. The ten named form dialogs build through it: one frame, a uniform `data-ui="dialog.N"` (+ `.primary`, `.secondary`) hook, and `data-ui="dialog:<id>"` as an alias on `.modal-content` (one `data-ui` per element). Field-made bodies (assign_to, add_tag, rename) use the real field renderers; share, attach, email, msgprint lists keep bespoke `body` html.
- **Connections is a tab (v16).** With connections data and no connections tab in the layout, a "Connections" tab is appended after the layout's tabs (the implicit first tab is "Details"). No data, no block; never above the tabs. `view.tab` (label, fieldname or index, case-insensitive, `_tab` optional) picks the active tab, e.g. `"connections"` in `s3-form-activity-more`.
- **Legacy samples: slice 4.** A legacy sample that duplicates an `[st]N-*` sample is deleted; the only cover of a surface is renamed into the gated scheme and fixed (`samples/workspace.json`: find why `link.onboard` has zero area, drop or label it). Then geometry and determinism globs widen to `samples/*.json`. Tracked in `../docs/DESK-SLICES.md` slice 4.

## Spec additions
- Overlays `row_open`, `field_open`; dialog `kind` values `assign_to share attach add_tag rename email msgprint_list missing_mandatory modified_conflict server_error list_settings quick_filters save_view`; dialog `fields` may be plain strings for the named dialogs; `menu_open.current`; `ctx.notifications.count`; `ctx.navbar`; menu target `page.views`.
- Data: `data.doc.timeline[]` (item shapes in `renderers/form/timeline.mjs`), `data.connections[]` (or `meta.connections`), `view.timeline_more` (items shown before "More"), `view.timeline: false`. A workflow is `meta.workflow` (Workflow JSON with `transitions`, `states`, `workflow_state_field`) or an inline `meta.doctype.workflow`; roles come from `ctx.user.roles`.
- Named dialog keys: `assign_to {assign_to, myself, description, date, priority}`, `share {users, everyone}`, `attach {tab: device|link|camera, files, private, url}`, `add_tag {tag, tags}`, `rename {name, new_name, merge}`, `email {to, subject, message, attachments, template}`, `msgprint_list {intro, messages}`, `missing_mandatory {doctype, fields}`, `modified_conflict {message, modified}`, `server_error {message, traceback}`.

## Commands (from `ui-kit/`)
```
node bin/mock.mjs validate samples/*.json
node bin/mock.mjs render samples/s3-form-rowform.json --out out/slice3/s3-form-rowform.html
node tests/shots.mjs out/slice3/*.html        # 1440x900 PNG next to each (375x812 when the name has "mobile"); --h=1800 for a tall shot
node tests/determinism.mjs                    # every [st]N-*.json twice, byte-identical, zero warnings
node tests/slice3.test.mjs                    # slice 3 gate (grid, dialogs, matrix, single, navbar geometry)
node tests/geometry.mjs out/slice3/*.html; node tests/output-hygiene.mjs out/slice3/*.html
for t in $(fd -e mjs test . --exclude node_modules --exclude out); do node $t; done
bash doctype/render-all.sh; git checkout -- doctype/out   # the rewrites are not kept
rg -n "Customer|Loyal|GST|Selling|Sales Invoice|URY|Huf" renderers kit-lib shell bin adapters schemas
```
Slice-3 samples are `samples/s3-*.json` (39). Output and screenshots are in `out/slice3/` (all samples rendered, including slice 1 and 2).

## Gaps
- `samples/workspace.json` (legacy slice-1 sample) fails the geometry gate on `link.onboard` (zero area). It does so on the slice-2 commit too; the workspace renderer is untouched. Geometry runs clean on every `s*`/`t*` sample.
- Row forms use the real v16 CSS (`position: fixed` panel). A nested grandchild form is offset by the `data-depth` stacking rules in `shell/kit.css`.
- The dialog stack draws dialogs at the same position; the lower one is dimmed and mostly hidden, as in the desk.
- Timeline items are shown in the given order (newest first is the data author's job). Date labels are the first 10 characters of `creation`; nothing reads a clock.
- The comment box is a static editor shell; "Comment" is hidden like v16 until text is typed.
- Picker layout and the nested row form stacking are rules in `shell/kit.css` (inlined by `shell.mjs`, source noted "not in captured CSS"), not inline styles. `data-depth` on `.form-in-grid` drives offset and z-index (1 to 3 levels).
- Not covered: Table MultiSelect inside a grid row form, grid inline-edit state (slice 4 datatable), real saved-view contents beyond a menu, link-preview popovers.
