# frappe_mock_skill: Build Plan for a Generic Frappe v16 Desk Mockup Engine

Paths are relative to the kit root `ui-kit/` (audit copy under `<scratchpad>/fms-audit/ui-kit`) unless stated. "Bench" means the live Frappe v16 bench, used only as a sanity reference. The audits read source and repo statically and did not open the bench. Anything marked "to confirm" must be checked in task T0.

---

## 1. Goal and non-goals

**Goal.** Given Frappe metadata (DocType JSON, Workspace JSON, Report/List View Settings, etc.) plus sample data and a few overlay declarations, produce a static, themeable HTML mockup of any v16 desk screen. It must be visually faithful and composable: any DocType, any child table, any tab/section/column/fold combination, and the chrome around it.

The owner's acceptance test is "can we visualize it or not". It is explicitly not pixel-perfect. Custom/action buttons, open menus and dialogs must be declarable. GST is only an example; nothing may be hard-wired to Customer, GST or Loyal Arrow.

Surfaces in scope:
- Form (body and chrome).
- Desk sidebar and dock.
- Workspace pages (all block types).
- List view (all column content types, indicators, filters, group-by, view switcher, saved views, bulk actions, list settings).
- Report view.
- Query/Script reports.
- Other views: kanban, calendar, gantt, dashboard, image, map, tree, inbox.
- Dialogs, toasts, menus, awesomebar, notifications.

**Non-goals.**
- No JS behaviour fidelity. Static states and a few tiny toggles only (tab switch, section collapse, open dropdown state).
- No runtime client-script execution (`frm.add_custom_button`, `get_indicator`, `listview_settings.formatters`). These are replaced by declarative `overlays` in the mock spec.
- No Web Forms, Setup Wizard, Role Permission Manager or Customize Form pages in v1.
- No sidebar edit mode or workspace edit mode (optional static "edit state" later).
- No importing frappe-ui (Vue/Tailwind) into the kit (see section 3.6).
- Not pixel-identical; the bench comparison is a sanity check, not a gate.

---

## 2. Coverage matrix

Status key: **generic** = metadata-driven today; **hand-built** = static capture or bespoke page only; **missing** = nothing. Targets: **G** = generic renderer driven by spec; **G+O** = generic with overlay-declared pieces.

### 2.1 Form

| Element | Now | Target |
|---|---|---|
| Body: Tab/Section/Column breaks, `depends_on`, `hidden`, collapsible (`doctype/lib/layout.mjs`) | generic | G (add Fold, section `columns`/`description`/`hide_border`, percent widths) |
| 42 of 44 fieldtypes (`doctype/fields/*.mjs`); `Custom` is not a real fieldtype | generic | G; fix `Table MultiSelect` `data-target` |
| Child table grid (read-only) | generic (partial) | G: footer ("Add Row", "Download/Upload"), row selection, row-edit form, grandchild tables, `in_list_view` columns, widths |
| Title, breadcrumbs | regex swap in `render-doctype.mjs` | G |
| Status pill (`frappe.get_indicator` order: unsaved, workflow, docstatus, `states`, submitted, `status`) | partial, wrong for docstatus | G (port the 7-step order) |
| Primary action (Save/Submit/Cancel/Amend/workflow) | missing (always "Save") | G from `is_submittable`, `docstatus`, `__unsaved`, workflow |
| "..." menu | hand-built (`components/menu-dropdown`) | G from DocType flags (`allow_rename`, `allow_copy`, etc.) |
| Custom buttons and groups (Create/View/Actions), intro/headline messages | hand-built (Customer capture) | G+O: `overlays.buttons[]`, `overlays.intro[]` |
| Prev/next, workflow action dropdown | hand-built/missing | G+O |
| Form sidebar (assign, attachments, tags, share, likes, created/modified, image, rating) | hand-built (`components/form-sidebar`, 25 text slots) | G from doc + `overlays.sidebar` |
| Timeline (comment box, versions, comments, emails), connections tab/dashboard | hand-built | G from `doc.timeline[]` and `connections[]` |
| Docstatus banners, "Not Saved", read-only banners | missing | G |
| Quick Entry dialog | missing | G (derived from layout builder, mandatory fields) |

### 2.2 Sidebar and dock

| Element | Now | Target |
|---|---|---|
| Items: Link, Section Break, one nesting level (`render-doctype.mjs` L187-230, `doctype/workspaces/*.json`) | generic (partial) | G |
| Spacer, Sidebar Item Group, top-level Section Break variant, `keep_closed`/`collapsible`/`show_arrow` | missing/partial | G |
| Suffix/badge/shortcut | missing | G |
| Active item for Report/Page/Workspace/Dashboard (only DocType today) | partial | G |
| Link types, route resolution (DocType/Page/Report/Workspace/Dashboard/URL) | `href="#"` only | G (display only, route-like `href`) |
| Header and its dropdown (Edit Sidebar, Help, switcher items) | partial / missing | G+O (open state) |
| User block, user menu dropdown, notifications panel | hand-built / missing | G+O |
| Dock (rail items, active, utilities, unread dot) | hand-built, 9 fixed items | G from Dock/Desktop Icon data |
| Collapsed rail, mobile off-canvas | missing | G (state flag) |
| Cards / promo banners | missing | Low priority (cards only) |
| `loyal-arrow/structure/sidebar.json` (flat `indent`) vs `doctype/workspaces/*.json` (nested `children`) | two shapes | normalise to one (`indent` to `children` adapter) |

### 2.3 Workspace page (nothing generic exists)

| Element | Now | Target |
|---|---|---|
| Header, Paragraph, Spacer blocks | missing | G |
| Shortcut block (all `type`/`doc_view`, count badge, colour, icon) | hand-built (`components/workspace-shortcuts`) | G |
| Card/Links block (title, description popover, `onboard` dot, link types) | hand-built data only (`loyal-arrow/structure/workspaces.json`) | G |
| Number card (all types, delta, colour, currency) | hand-built (`components/number-card`, `la-kpi-card`) | G |
| Chart (Line/Bar/Percentage/Pie/Donut/Heatmap + toolbar) | hand-built (line and bar only, `scripts/la-build-workspace.mjs`) | G, shared chart module |
| Quick List (with "Add New", empty state) | hand-built partial (`la mini-list`) | G |
| Onboarding block (progress, steps) | missing | G |
| Custom HTML Block (shadow-root, `html`/`style`) | missing | G (inline HTML + CSS) |
| Layout: block `col` 1-12, `grid-col-N` | missing (fixed CSS) | G |
| Page chrome: title/icon/indicator, public/private/role badges, header menu | missing | G |
| Empty/loading states | missing | G |

### 2.4 List view

| Element | Now | Target |
|---|---|---|
| Page head, primary "Add X", menu ⋯ | hand-built (`components/page-head`, `menu-dropdown`) | G from DocType flags |
| View switcher (List/Report/Dashboard/Gantt/Kanban/Calendar/Image/Inbox/Tree/Map), enabled-view logic | missing | G+O (spec lists enabled views) |
| Saved views / layouts, user filters | missing | G+O (`overlays.saved_views`) |
| Filter bar with chips, filter popover | hand-built state | G from `filters[]` |
| Sort selector | hand-built | G (`sort_field`/`sort_order`) |
| Quick filter row (`in_standard_filter`) | hand-built | G |
| Count label and paging (20/100/500/2500, Load more) | hand-built | G |
| Checkbox, select-all, bulk action bar ("Actions" menu, N selected) | hand-built (no bulk bar) | G+O |
| Subject cell (title field, indicator dot, like) | hand-built | G |
| Other columns from `in_list_view`, `list_view_settings.fields` and their count | missing | G (cap at max fields) |
| Tag column, meta block (assignees, modified, comments, like) | missing | G |
| Indicator pill (states, workflow, docstatus, declarative rules) | partial | G |
| Row action button / dropdown button | missing | G+O |
| Per-fieldtype cell formatters (Select badge via `guess_colour`, Currency, Percent bar, Rating, Image, Date, Check, Color, Duration, Link, Attach...) | missing (form controls only) | G |
| List settings dialog, "Customize Quick Filters", column header resize | missing | G+O (dialog) |
| List sidebar: group-by counts, saved filters, "Edit Filters", tags, attached-to | not audited (fetch failed) | G+O (to confirm in T0) |
| Empty state, no-results, skeleton, mobile card layout | hand-built (loading, empty exist) | G |

### 2.5 Report view and reports

| Element | Now | Target |
|---|---|---|
| Report view datatable (`components/report-view`, 824 slots, Sales Invoice only) | hand-built | G (columns from fields, incl. child-table columns, "Label (Child)") |
| Inline filter row, header dropdown (sort/pin/remove), alignment, totals row, resize | hand-built / missing | G |
| Group-by, chart above table, menu items, Pick Columns/Add Column/Export/Save As dialogs | missing | G+O |
| Saved report mode (title, `json` with filters/fields/order_by/column_widths/group_by/chart_args) | missing | G |
| Query/Script report: filter bar (all control types, `collapsible_filters`) | hand-built (Liability and Aging only) | G (reuse form field renderers) |
| Report chart (Bar/Line/Pie/Percentage/Donut/Axis-Mixed/Heatmap), summary cards (`report_summary`, separators), message banners | missing | G |
| Datatable with tree/indent, `Link` cols, `Currency` per-row, "Total Row" | missing | G |
| Menu (Refresh, Edit, Print, Export, Setup Auto Email, Add to Dashboard, Create Chart/Card) | missing | G |
| `loyal-arrow/structure/reports.json` has empty `columns` | no metadata | add columns via spec |

### 2.6 Other views, dialogs, global

| Element | Now | Target |
|---|---|---|
| Kanban (columns, cards, quick-add, board selector) | missing | G |
| Calendar (month/week/day/list, event colours) | missing | G (static grid) |
| Gantt (bars, header scales, today marker) | missing | G (static SVG) |
| Dashboard page (charts + number cards grid) | components only | G (reuse workspace chart/number-card) |
| Image view, Tree view (hover actions), Inbox, Map (static tile plus markers) | missing | G |
| `frappe.msgprint`/`confirm`/`prompt`, `frappe.ui.Dialog` with arbitrary fields, sizes, Quick Entry, field-list dialogs | confirm only (`components/modal-dialog`) | G (wrap existing `fields/*.mjs`) |
| Toast/alert, dropdown/popover menus | hand-built (`components/toast`, `alert`, `menu-dropdown`) | G |
| Awesomebar results, notifications dropdown (tabs) | closed state only | G+O |
| Single DocType forms ("Update", no status) | generic | G |

---

## 3. Architecture

### 3.1 The single "mock spec" JSON

One input format composes everything. A page is `{ page, meta, data, overlays, ctx }`.

```jsonc
{
  "$schema": "mock-spec/1",
  "page": "form | list | report | workspace | query_report | kanban | calendar | gantt | dashboard | tree | image | map | inbox | dialog",
  "ctx": {
    "theme": "light|dark", "locale": "en", "rtl": false, "viewport": "1440x900|mobile",
    "app": "Selling",            // dock + sidebar selection
    "workspace": "Selling",
    "user": {"name": "Jane", "email": "...", "roles": ["Sales Manager"]},
    "chrome": {"dock": true, "sidebar": "expanded|collapsed|hidden", "navbar": true}
  },
  "meta": {                       // metadata, by reference or inline
    "doctype": "Sales Invoice",   // path under doctype/fixtures or inline DocType JSON
    "custom": ["custom_fields.json"],  // existing lib/customize.mjs
    "workspace": "...", "report": "...", "workflow": "...", "states": [...]
  },
  "data": {                       // sample data (explicit, or "$gen")
    "doc": {...} | null,
    "rows": [...] | {"$gen": {"count": 20, "seed": 7}},
    "linkPools": {...}
  },
  "overlays": [                   // declarative runtime pieces and open/state layers
    {"type": "button", "group": "Create", "label": "Payment Entry", "style": "primary|default", "align": "right"},
    {"type": "intro", "text": "...", "color": "blue"},
    {"type": "menu_open", "target": "page.menu"},
    {"type": "dialog", "title": "...", "fields": [...], "actions": [...]},
    {"type": "list_select", "rows": [0,2], "bulk": ["Edit","Delete","Assign To"]},
    {"type": "filter_chips", "items": [["status","=","Paid"]]},
    {"type": "state", "target": "row:3", "state": "hover"}
  ],
  "view": {"tab": "Details", "sidebarSection": "..."}
}
```

Rules:
- `meta` is Frappe-native JSON. Never invent a parallel schema for something Frappe already defines (DocType, Workspace content blocks, Workspace Sidebar, Report JSON, Kanban Board, Calendar View).
- `overlays` exist only for what is not in metadata: client-script buttons, intros, open menus, dialogs, selections, hover/focus states. Overlay targets use stable `data-ui` ids so they work in every renderer.
- `data` may omit rows; the sample-data generator fills them deterministically (section 3.4).
- A project is a folder of specs plus assets. Specs may `extends` another spec and be validated against `schemas/mock-spec.schema.json`. This is the authoring surface the owner asked for: any doctype, any combination.

### 3.2 Shared shell

New `shell/shell.mjs` replaces the Customer capture hard-wired in `pages/desk-form.html` and the regex splicing in `doctype/render-doctype.mjs`. It renders: navbar, dock rail, sidebar panel, page head slot, main slot, optional right panel (form sidebar or list sidebar). All inputs come from `ctx` plus dock/sidebar metadata. The captured HTML in `pages/desk-form.html` and `components/{dock,sidebar,navbar}/component.html` is used as the **markup reference** (class names, `data-ui` hooks) for the generated templates, not as the runtime template. After the shell passes the parity check (T-S6), the old regex path is removed or kept behind `--legacy`.

### 3.3 Renderers per page type

`renderers/<type>.mjs`, each `(spec) -> main-slot HTML`:

`form` (refactor existing), `list`, `report-view`, `query-report`, `workspace`, `dashboard`, `kanban`, `calendar`, `gantt`, `tree`, `image`, `map`, `inbox`, `dialog`.

Shared kit in `kit-lib/`, with one function per element taking metadata properties:
- `buttons.mjs` (`es-button`, button groups, action menus).
- `menus.mjs`, `indicators.mjs` (the 7-step `get_indicator` plus `guess_colour`).
- `cells.mjs` (list/report cell formatter per fieldtype).
- `filters.mjs`, `sort.mjs`, `viewswitch.mjs`, `tags.mjs`, `avatars.mjs`.
- `chart.mjs` (SVG: line, bar, pie, donut, percentage, heatmap, axis-mixed).
- `numbercard.mjs`, `datatable.mjs` (also used by child-table grid), `timeline.mjs`, `dialog.mjs`, `toast.mjs`, `icons.mjs`.

Field-control renderers in `doctype/fields/*.mjs` are reused unchanged by dialogs, report filters, quick entry and the child-table row form.

### 3.4 Sample-data generator

`data/gen.mjs`: seeded PRNG (mulberry32), keyed by `(fieldtype, fieldname, doctype, locale)`. It uses locale/currency data from `data/universals/{locales,i18n/ar}.json`, link-value pools, status pools for Select fields, and N rows per child table. No clocks, so the output is deterministic. Dates are passed in as `ctx.today` data.

### 3.5 CLI

Extend `doctype/render-doctype.mjs` into `bin/mock.mjs`:

```
mock render <spec.json> [--out out.html] [--theme dark] [--rtl]
mock sheet  <specs-dir> [--out contact-sheet.html]   # many pages as one index
mock validate <spec.json>                             # schema and metadata resolution
mock shot   <spec.json|html> [--state ...]            # screenshot via scripts/shot.mjs
```

Back-compat: `render-doctype.mjs` stays as a thin alias to `mock render` with a form spec.

### 3.6 frappe-ui vs desk decision

**Decision: use the desk's own compiled CSS and v16 Espresso tokens. Do not use frappe-ui.**
- The `version-16` `package.json` has no `frappe-ui` dependency. The desk is jQuery/SCSS with Espresso (`frappe/public/css/espresso/*.css`, `es-*` components) for new chrome.
- frappe-ui (Vue+Tailwind) powers apps (CRM, Helpdesk), not the desk. Only Custom HTML Blocks adopt it.
- Source of CSS: the compiled bundles already captured in `tokens/css/{frappe-desk,frappe-report,erpnext-erpnext,hrms-hrms}.css` (desk bundle already contains Espresso). Icons: lucide sprite `tokens/icons/sprite.svg.html`.
- For missing components, take markup patterns from Espresso docs/source (`es-badge`, `es-tabs`, `es-stat_card`, `es-stepper`, `es-progress`, `es-popover`) and the matching desk SCSS (`list`, `report`, `kanban_v2`, `sidebar`, `dock`, `form_sidebar`).
- Housekeeping: align the lucide pin (`doctype/tools/fetch-workspaces.mjs` uses `0.468.0`, bench uses `1.47.0`), and confirm `tokens/css/theme-vars.css` exists (system.json references it; unconfirmed).
- A "frappe-ui look" for Custom HTML Blocks is a separate small optional style pack, not a dependency of the core.

---

## 4. Workstreams: dependency-mapped task graph

Size: S = under half a day, M = about a day, L = 2-3 days. Models: **haiku** = bounded and mechanical, **sonnet** = most work, **opus** = hard design only (two tasks).

### Wave 0: foundation (serial, then parallel)

| ID | Title | depends_on | Files | Inputs | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|---|
| T0 | Confirm unverified facts | none | `docs/V16-FACTS.md` (new) | v16 sources (`list_sidebar.js`, `views.js`, `bulk_operations.js`, kanban/calendar/gantt/tree/inbox/awesome_bar/notifications), bench read-only | `rg -c "to confirm" docs/V16-FACTS.md` returns 0; each unverified item has a source line cited | M | sonnet |
| T1 | Mock-spec schema and validator | none | `schemas/mock-spec.schema.json`, `bin/mock.mjs validate` | section 3.1 | `node bin/mock.mjs validate samples/*.json` exits 0; a bad spec exits non-zero with a path | S | opus (schema design) |
| T2 | Normalise metadata adapters | T1 | `adapters/{sidebar,workspace,report}.mjs` | `loyal-arrow/structure/{sidebar,workspaces,reports}.json`, `doctype/workspaces/*.json` | adapter output validates against Frappe-shaped JSON; round-trip test passes | S | haiku |
| T3 | Sample-data generator | T1 | `data/gen.mjs`, `data/gen.test.mjs` | `data/universals/*` | run twice with the same seed, `diff` of output is empty; each of the 44 fieldtypes yields a valid value | M | sonnet |
| T4 | Shared kit-lib core: buttons, menus, indicators, badges, avatars, tags, icons | T1 | `kit-lib/*.mjs` | Espresso class list, `components/menu-dropdown`, `toast`, `alert` | unit test: `get_indicator` 7-step order cases (unsaved, workflow, docstatus 0/1/2, `states`, `status`) all pass | M | sonnet |

### Wave 1: shell (parallel with form refactor)

| ID | Title | depends_on | Files | Inputs | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|---|
| T-S1 | Shell skeleton: navbar, page-head slot, main slot, right-panel slot | T1, T4 | `shell/shell.mjs` | `pages/desk-form.html`, `components/navbar` | `mock render samples/blank.json` yields valid HTML with all `data-ui` slots | M | sonnet |
| T-S2 | Dock renderer (Dock Item / Desktop Icon, unread dot, utilities, active) | T-S1 | `shell/dock.mjs` | `components/dock/component.html`, `doctype/workspaces/icons.json` | 3 specs (3, 9, 15 items) render; active marker follows `ctx.app`; no fallback "Selling" icon for unknown workspaces | S | haiku |
| T-S3 | Sidebar renderer: Link, nested Section, Spacer, Item Group, suffix/shortcut, `keep_closed`, collapsed rail, active for any link type | T-S1, T2 | `shell/sidebar.mjs` | `render-doctype.mjs` L187-230, `components/sidebar` | `node doctype/depends.test.mjs`-style unit: 3-level nesting, Spacer, Section variants all produce expected class names; screenshot `sidebar-3level.png` shows chevrons and indent | M | sonnet |
| T-S4 | Sidebar header dropdown, user block, user menu, notifications panel (open states) | T-S3 | `shell/menus.mjs` | `components/menu-dropdown` | specs with `overlays: menu_open` render the open menu | S | haiku |
| T-S5 | Mobile / collapsed variants of shell | T-S3 | `shell/shell.mjs` | `components/*` | `ctx.viewport=mobile` produces off-canvas sidebar with overlay | S | haiku |
| T-S6 | Shell parity vs old Customer capture | T-S2, T-S3, T-S4 | `tests/parity-shell.mjs` | `pages/desk-form.html` | the existing 25+ fixtures render and `pixdiff.py` first-viewport diff is no worse than current 1.4-4.3% | S | sonnet |

### Wave 2: form (parallel with Wave 1 after T4)

| ID | Title | depends_on | Files | Inputs | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|---|
| T-F1 | Indicator pill and primary action logic | T4 | `renderers/form/head.mjs` | `odd_a.doc.json` (docstatus 1) | `ODD-001` shows "Submitted" blue; no "Save"; amended/cancelled variants asserted by test | M | sonnet |
| T-F2 | Menu "..." generated from DocType flags, plus custom button groups from overlays | T4, T1 | `renderers/form/menu.mjs`, `kit-lib/buttons.mjs` | `components/menu-dropdown`, spec `overlays.buttons` | spec with 2 groups and a right-aligned primary renders `.inner-group-button` markup; menu items match flag set (e.g. no Rename when `allow_rename=0`) | M | sonnet |
| T-F3 | Layout gaps: Fold, section `columns`/`description`/`hide_border`, percent column widths, `insert_after` ordering | none | `doctype/lib/layout.mjs`, `doctype/fixtures/test/layout_test*` | Frappe `form/layout.js` | existing layout test (3/6/11/12 counts) still passes; new fixtures `odd_fold`, `odd_pct` pass | M | sonnet |
| T-F4 | Child-table grid v2: footer, row-select, `in_list_view` widths, row-edit form (via `fields/*.mjs`), grandchild | T-F3 | `doctype/fields/table.mjs` (or equivalent), `kit-lib/datatable.mjs` | `odd_child.json`, `odd_grand.json` | `odd_a` now renders `sub` and `note`; grid shows footer; row-form overlay opens | L | sonnet |
| T-F5 | Form sidebar generic (assign, attachments, tags, share, likes, creation/modified, image, rating) | T4 | `renderers/form/sidebar.mjs` | `components/form-sidebar` | spec with 0 and 5 attachments, 0 and 3 assignees renders correct counts and empty states | M | sonnet |
| T-F6 | Timeline and connections | T4 | `renderers/form/timeline.mjs` | `components/comment-timeline` | version-diff, comment, email, "You created this" items from `doc.timeline[]` | M | sonnet |
| T-F7 | Workflow actions and docstatus banners | T-F1 | `renderers/form/workflow.mjs` | Workflow doc JSON | transitions render as "Actions" dropdown; role-filtered | S | haiku |
| T-F8 | Form integration; replace regex shell splicing | T-S6, T-F1, T-F2, T-F5, T-F6 | `doctype/render-doctype.mjs`, `renderers/form/index.mjs` | all above | `bash doctype/render-all.sh` completes; zero `[Custom]` strings; synthetic `odd_a/b/c` pass | M | sonnet |
| T-F9 | Dialog renderer and Quick Entry | T4 | `renderers/dialog.mjs` | `components/modal-dialog`, `fields/*.mjs` | `frappe.ui.Dialog` spec with Section/Column/Table fields in sizes small/large/extra-large; quick entry shows mandatory fields + "Edit Full Form" | M | sonnet |

### Wave 3: lists, reports, workspaces (parallel after T3, T4, T-S1)

| ID | Title | depends_on | Files | Inputs | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|---|
| T-L1 | Cell formatter table per fieldtype (Select via `guess_colour`, Currency, Percent bar, Rating, Image, Date/Datetime, Check, Color, Duration, Link, Attach, Text Editor) | T3, T4 | `kit-lib/cells.mjs`, `cells.test.mjs` | `list_view.js` L1680-1790 (to confirm), `frappe.format` | test covers all fieldtypes; same value yields same colour on repeat | M | sonnet |
| T-L2 | List page head, view switcher (enabled-view logic), filter bar/chips, sort selector, quick filters, count/paging | T-S1, T4 | `renderers/list/head.mjs`, `kit-lib/{filters,sort,viewswitch}.mjs` | `components/list-view`, `components/page-head` | spec enabling 3 extra views shows 4 entries; `desk_settings.view_switcher=false` hides it | M | sonnet |
| T-L3 | List rows: checkbox, subject cell, columns from `in_list_view` / `list_view_settings.fields` with cap, tag column, meta block | T-L1 | `renderers/list/rows.mjs` | `components/list-view` (613 slots as markup reference) | 5 specs: 1, 4, 8, 12 columns, with and without `title_field`, all render; no hard-wired doctype | L | sonnet |
| T-L4 | Indicator column rule table (`states`, workflow, docstatus, declarative `rules`) | T4 | `kit-lib/indicators.mjs` | `DocType State` JSON | fixtures covering each branch assert the colour class | S | haiku |
| T-L5 | Bulk actions bar, selection state, row action button/dropdown, hover/focus states via overlays | T-L3 | `renderers/list/bulk.mjs` | `list_view.js` L1968-2020 (to confirm) | `list_select` overlay shows "3 selected" + Actions menu | S | haiku |
| T-L6 | List sidebar: group-by counts, saved filters, tags, "Edit Filters" | T0, T-L2 | `renderers/list/sidebar.mjs` | `list_sidebar*.js` (T0 notes) | group-by on Select field shows counts that sum to row count | M | sonnet |
| T-L7 | Saved views / list settings dialog / "Customize Quick Filters" dialog | T-L2, T-F9 | `renderers/list/dialogs.mjs` | `list_settings.js` | dialogs open via overlay; "Reset Fields" present | M | sonnet |
| T-L8 | Empty, no-results, skeleton, mobile card variants | T-L3 | `renderers/list/states.mjs` | `components/list-view/states.json` | each state is a spec flag and renders | S | haiku |
| T-R1 | Datatable component shared by report view and query reports (header dropdown, sort indicator, resize, alignment, totals row, tree indent, child-column naming) | T-L1 | `kit-lib/datatable.mjs`, `renderers/report/` | `components/report-view`, `tokens/css/frappe-report.css` | column "Label (Child)" and `idx` as "Index" asserted; numeric right-aligned | L | sonnet |
| T-R2 | Report view page: inline filters, group-by, chart toggle, menu, saved-report mode | T-R1, T-L2 | `renderers/report/view.mjs` | Report JSON | saved report spec shows its name as title and applies `json` | M | sonnet |
| T-R3 | Query/Script report page: filter bar via `fields/*.mjs`, `collapsible_filters`, summary cards, chart, message banner | T-R1, T-C1 | `renderers/report/query.mjs` | `la-rpt-pages.mjs` as a reference | 14 filter control types render; `report_summary` separators render | M | sonnet |
| T-R4 | Report dialogs: Pick Columns, Add Column, Export, Save As, Create Chart | T-F9, T-R1 | `renderers/report/dialogs.mjs` | | each opens from an overlay | S | haiku |
| T-C1 | Chart module (line, bar, pie, donut, percentage, heatmap, axis-mixed) with cap rules (6 slices / 9 points), toolbar | T4 | `kit-lib/chart.mjs` | `components/dashboard-chart` | 7 chart types render from one `data` shape; legends and tooltips present | L | sonnet |
| T-C2 | Number card (all types, delta, currency, colour) | T4 | `kit-lib/numbercard.mjs` | `components/number-card` | up/down delta and 4 colours | S | haiku |
| T-W1 | Workspace renderer: block registry (header, paragraph, spacer, card, shortcut, number_card, chart, quick_list, onboarding, custom_block), 12-col layout | T-C1, T-C2, T-S1 | `renderers/workspace/index.mjs`, `blocks/*.mjs` | Workspace `content` JSON; `scripts/la-build-workspace.mjs` as the old reference | a spec with every block type renders; `col` values 3/4/6/12 produce right grid classes | L | sonnet |
| T-W2 | Shortcut variants (type, doc_view, count badge, colour map), Card links (description popover, onboard dot) | T-W1 | `renderers/workspace/blocks/{shortcut,card}.mjs` | `shortcut_widget.js` | 8 `doc_view` variants render; count `format` template substituted | M | sonnet |
| T-W3 | Onboarding and Custom HTML block (shadow-style isolation with scoped CSS), quick list | T-W1 | `renderers/workspace/blocks/{onboarding,custom_block,quick_list}.mjs` | | steps accordion, progress "N of M"; custom HTML renders sanitised | M | sonnet |
| T-W4 | Workspace page chrome: icon/indicator, public/private/role badge, header menu, empty state | T-W1 | `renderers/workspace/head.mjs` | | private vs public asserted by badge | S | haiku |

### Wave 4: other views and global surfaces (parallel, after T-L2, T-C1, T4)

| ID | Title | depends_on | Files | Inputs | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|---|
| T-V1 | Kanban | T-L2, T4 | `renderers/kanban.mjs` | Kanban Board JSON, `kanban_v2.scss` | columns from `columns[]`; cards with assignees/due/colour bar; add-card and "Add column" | M | sonnet |
| T-V2 | Calendar (month/week/day) | T-L2 | `renderers/calendar.mjs` | Calendar View JSON | month grid with events of 3 colours | M | sonnet |
| T-V3 | Gantt | T-L2 | `renderers/gantt.mjs` | | bars with progress, header scales, today marker | M | sonnet |
| T-V4 | Dashboard page | T-C1, T-C2 | `renderers/dashboard.mjs` | Dashboard JSON | chart + number-card grid | S | haiku |
| T-V5 | Tree, Image, Inbox, Map | T-L2 | `renderers/{tree,image,inbox,map}.mjs` | `treeview.js` etc. (T0) | each renders from a 1-page spec | L | sonnet |
| T-G1 | Awesomebar results, notifications dropdown (tabs), toast gallery | T-S4 | `shell/{awesomebar,notifications}.mjs` | `components/navbar`, `toast` | open states from overlays | S | haiku |
| T-G2 | Single DocType, Settings forms (verify "Update" button, no status) | T-F8 | specs only | `doctype/fixtures/*/gst_settings.json` | renders without status pill | S | haiku |

### Wave 5: integration and polish (serial)

| ID | Title | depends_on | Files | Acceptance check | Size | Model |
|---|---|---|---|---|---|---|
| T-X1 | `mock sheet`: contact sheet of every spec | all renderers | `bin/mock.mjs` | one HTML with all specs; no errors | S | haiku |
| T-X2 | Docs and skill rewrite: `SKILL.md`, spec reference, cookbook (30 recipes) | all | `SKILL.md`, `docs/SPEC.md`, `docs/RECIPES.md` | each recipe renders (`mock render docs/recipes/*.json` exits 0) | M | sonnet |
| T-X3 | One-time adversarial review of spec and renderer boundaries | T-X2 | review notes | no hard-coded doctype/brand strings: `rg -n "Customer\|Loyal\|GST" renderers kit-lib shell` returns nothing | S | opus |

### Parallel waves summary

- **Wave 0:** T1 first; T0, T3, T4 in parallel with T2 right after T1.
- **Wave 1 and Wave 2** run in parallel once T4 and T1 are done (shell and form are independent, apart from T-F8 needing T-S6).
- **Wave 3** has four independent tracks (list, report, chart/card, workspace) after T4 and T-S1. Chart and number card (T-C1, T-C2) should land first since workspace, dashboard and report depend on them.
- **Wave 4** is fully parallel.
- **Wave 5** is serial.

File-scope rule (per project convention): tasks in a wave must not share files. The only shared files are `kit-lib/*.mjs` (add per-element files rather than editing a shared one) and `bin/mock.mjs` (owned by T1 first, then T-X1 only). Where two tasks touch the same file, serialise them or use worktrees.

---

## 5. Verification strategy

1. **Unit/structural (every task).** `node <test>.mjs` for generators and formatters: indicator order, `guess_colour` determinism, layout counts, 44-fieldtype coverage. Regression: `node doctype/depends.test.mjs` and the existing layout test (3/6/11/12) must stay green.
2. **Synthetic stress DocTypes (the main gate).** Keep `odd_a/b/c` plus `odd_child/odd_grand` in `doctype/fixtures/test/` and add:
   - `odd_fold`, `odd_pct` (column widths).
   - A 25-column list doctype with every fieldtype in `in_list_view`.
   - A doctype with `title_field`, `states`, workflow and submittable (docstatus 0/1/2).
   - A 3-level nested sidebar, plus a workspace spec with every block type and every `col` width.
   - A report with child-table columns, totals, group-by and a chart.
   Pass condition: renders without throwing, and structural assertions hold (tab/section/column counts, no `[Custom]`, no unresolved `{{...}}`, no empty icon).
3. **Screenshot review.** `scripts/shot.mjs` renders every spec at 1440x900 light and dark, plus mobile for the shell and list. A human or Sonnet reviews a contact sheet (`mock sheet`) for obvious breakage (overlap, missing icon, unstyled control). This is the "can we visualize it" check.
4. **Bench comparison (sanity, not a gate).** For the canonical samples (Sales Invoice form/list/report, Selling workspace, sidebar), capture the real route with `scripts/capture.mjs` (set `BASE=http://localhost:8002`; read-only login handled by `lib.mjs`), then `doctype/tools/pixdiff.py`. Record scores per region in `reports/parity.json`. Flag anything above about 8% for a look; do not fail the build.
5. **Determinism.** Run every render twice and `diff`; byte-identical output required (seeded PRNG, `ctx.today`, no clocks).
6. **Genericity guard.** `rg -n "Customer|Loyal|GST|Selling" renderers kit-lib shell` must return nothing (names live only in fixtures and specs).

---

## 6. Risks and open questions

1. **Unverified v16 internals (largest risk).** The list sidebar, view-switch logic, bulk operations and kanban/calendar/gantt/tree/inbox/awesomebar/notifications source were not fetched or read in the audits. T0 must pin each against `version-16` source before the dependent tasks start, so those tasks (T-L6, T-V1..V5, T-G1) should not begin until T0 closes their items.
2. **Capture drift.** The compiled CSS was captured from the bench at `localhost:8001`, while the working bench for this effort is `:8002`. They may differ in version or apps. Re-run `scripts/tokens.mjs` against the :8002 bench and compare `tokens.json` before relying on it. Also confirm `tokens/css/theme-vars.css` exists.
3. **Runtime-only behaviour has no metadata.** Custom buttons, `get_indicator`, `formatters`, row buttons and `set_query` live in JS. Mitigation: the `overlays` model. Open question: should the skill also offer a helper that extracts button labels from a client script by regex (e.g. `frm.add_custom_button("X", ..., "Create")`) to pre-fill overlays? Useful but fragile; keep it a convenience only.
4. **Duplicate sidebar shapes.** `loyal-arrow/structure/sidebar.json` (flat `indent`) vs `doctype/workspaces/*.json` (`children`). T2 adapters handle it; decide which is canonical (recommend nested `children`, matching the renderer).
5. **Icon coverage.** A name not in `doctype/workspaces/icons.json` or the sprite renders blank. T-S3 should resolve icons from the full lucide set and warn on a miss. Align lucide pin (0.468.0 vs 1.47.0): renamed icons may break.
6. **Two shells coexisting.** During migration the old Customer-capture path and the new shell can diverge. T-S6 parity test and a `--legacy` flag limit the risk; remove the legacy path after T-F8 passes.
7. **Typst/other-engine concerns do not apply.** This is a separate kit; HTML-only. (No cross-mode renderer parity is required, unlike the proposal engine's hard rule 8.)
8. **Chart fidelity.** Pie/donut/heatmap in SVG by hand is the single biggest custom drawing effort. Accept approximate look; use frappe-charts' visible conventions (colour order, caps) rather than copying its code. Check the licence if any code is borrowed.
9. **Scope creep on dialogs.** "Arbitrary dialog" is unbounded. Limit v1 to fields already supported by `fields/*.mjs` plus buttons and sizes; add dialog types on demand through specs.
10. **Open question for the owner.** Which first three real apps/doctypes should be the acceptance showcase (suggest one submittable doc with workflow, one with 3-level child tables, one list with 12+ columns)? The plan needs them for the Wave 5 recipes.
11. **Model choice.** Per the owner's note, Sonnet 5.5 low steers this plan. Opus is reserved for T1 (spec schema) and T-X3 (final adversarial review). Everything bounded and mechanical (adapters, dock, menus, small block renderers, states) goes to haiku.

### Suggested first slice (about one week, proves the whole idea)

T1, T0, T3, T4 in parallel, then T-F1, T-F2, T-F3, T-S1..S3, then T-F8 and one list (T-L1..T-L3) and one workspace (T-C1, T-C2, T-W1). The result is a form with real status pill and custom buttons, a data-driven sidebar, one list, and one workspace page, all from specs, with the synthetic stress doctypes passing.

---

## Appendix: completeness critique

COMPLETENESS CRITIQUE: additions and corrections

A. Missing surfaces
1. Print view and Print Format builder, and PDF preview. Frappe forms, lists and reports all have a Print action, and none is in the plan.
2. Login, signup and forgot-password pages, plus the 403, 404 and "not permitted" pages. These are standalone pages with no desk chrome.
3. Global search results page, user profile and settings dropdown, and a "My Settings" form. Also the Help dropdown and keyboard-shortcuts dialog.
4. Form-level dialogs: Assign To, Share, Attach (upload dialog, camera, link), Add Tag, Reminder, Customize, Rename, Duplicate/Copy, Merge, Version diff, Email composer, and the Link-field "Advanced Search" dialog.
5. Link/Dynamic Link field open states: the awesomplete dropdown with "Create a new X" and "Advanced Search" rows. Date, Datetime and Time pickers, the Color picker, the Icon picker, the Rating hover, Table MultiSelect chips, Attach Image preview, Signature, Geolocation and Barcode as open or populated states.
6. Form states: new/unsaved ("Not Saved"), read-only, locked, amended-from banner, "Cancelled" overlay, `allow_on_submit` fields, permission-driven read-only or hidden fields (permlevel), and mandatory-field error highlighting (red labels, invalid state). The plan has `docstatus` only in the status pill.
7. Form validation errors (`msgprint` with a list), "missing mandatory" dialog, "Document has been modified" conflict dialog, and server error dialog with traceback.
8. List view: "Assigned to me" and "Liked by me" filters, the Like heart, the comment-count and attachment icons in the meta block, the "Load more" and "Last Modified" sort-direction toggle, a list refresh and auto-refresh indicator, and the tag-picker in the list sidebar.
9. Report view: a "Show Totals" toggle, "Hide Cols", "Toggle Sidebar", per-column filter popups, and the datatable cell-edit state (report view allows inline edit).
10. Workspace: "Edit workspace" mode with drag handles, block toolbar (undo/redo, add block menu), the "+" block picker, and a Workspace Sidebar edit state. The plan defers edit mode to "optional later"; at least a static edit-state is cheap and visible to users.
11. Setup/config forms the user will clearly want mocked: Customize Form, Custom Field, Property Setter, Role Permission Manager, and Web Form. All are declared out of scope in section 1, but the owner said "any doc types". Customize Form and Role Permission Manager are ordinary DocType forms or pages and should be called out as supported through the generic form renderer, not excluded.
12. Navbar variants: breadcrumbs vs. page title, the search bar focused state, and a global "Desk" error banner (e.g. "Developer mode", "Session expired", "Maintenance"). Offline indicator.

B. States and variants under-specified
13. Empty, loading and error states are listed only for list and workspace. Add them for report, kanban, calendar, gantt, dashboard, form timeline, link dropdown ("No results"), and charts ("No data").
14. RTL and dark mode are only in `ctx`. There are no tasks, fixtures or acceptance checks for them. Add: logical-property CSS audit, a mirrored-arrows/icons list, and Arabic sample data (the plan mentions `i18n/ar.json` but nothing uses it for an RTL acceptance spec). Dark mode needs a check that every hard-coded colour in `kit-lib` uses a token (grep for `#[0-9a-f]{3,6}`).
15. Mobile and tablet widths: the plan covers only the shell (T-S5) and list card layout (T-L8). Form, report, workspace, kanban and dialogs at 375px and 768px have no task. The form on mobile (sticky bottom action bar, collapsed sections, bottom sheet menus) is a distinct layout.
16. Permissions-driven hiding has no task: hide Create/Delete/Export/Print based on `ctx.user.roles` plus DocPerm, hide fields by permlevel, hide sidebar items and workspace shortcuts by role, hide list view menu items. Add `ctx.perms` (or derive it from DocPerm in `meta`) and one task that threads it through the form, list, sidebar and workspace.
17. Keyboard and focus: focus rings, focused-field style, hover and active states on rows, and `:focus-visible` on buttons. The `state` overlay exists but has no defined vocabulary (hover, focus, active, disabled, loading). Define the set and the cell/row/button target syntax.
18. Open-menu coverage is unsystematic. Provide one `menu_open` target registry (every menu id: page.menu, form.menu, list.menu, group-by, sort, view-switcher, user, help, notifications, field-link-dropdown, row-actions, bulk-actions, column-header, report-menu, etc.) and a test that each id in the registry renders.
19. Modals over pages: define dialog stacking (backdrop, dimmed page, focus trap markup, multiple dialogs, dialog over dialog, `frappe.confirm` over a form). The `dialog` overlay sits in `overlays`, but the render order and z-index layering are not specified. Add a `z` layer model: page, popover, modal, toast.
20. Toasts and alerts: the `alert` (bottom-right indicator toast), `msgprint` (modal), and `show_alert` need their stack positioning and multiple-toast stacking.
21. Timeline variants beyond the list given: Info/Communication/Comment/Like/Assignment/Attachment/Share/Workflow/Label/Edit-comment/Reaction types, the "More" collapse, email with attachments and "Reply/Reply All", timeline date separators, and the "Show all activity" toggle.
22. Connections dashboard: internal links with counts, "+" buttons, non-standard fieldname connections, and the heatmap and charts at the top of a form dashboard (`dashboard` section of the DocType).
23. Child-table: the Table MultiSelect, "Edit in full page" row view, row-level colouring, row reordering handle (drag handle), `in_place_edit`, read-only grid, frozen first column, and the "Bulk Edit" and "Upload" dialogs. Grandchild is listed; "table with 30+ rows" pagination (grid pages at 50) is not.
24. Number formatting and locale: number format (`#,###.##` vs `#.###,##`), currency symbol position, date formats (`dd-mm-yyyy`, `mm/dd/yyyy`), first day of week, time zone. `ctx.locale` alone does not cover System Settings values; add `ctx.system` (number_format, date_format, time_format, currency_precision, float_precision).
25. Fieldtype count claim "42 of 44" needs a named list of the two missing ones in T0, otherwise T3 and T-F3 cannot prove complete coverage.
26. Report types: Script Report with `onload`-driven filters, "Custom Report" (user-saved), and the Report Builder mode are distinct. Prepared Report ("Queued/Generating/Completed" banner) and "Add Total Row" are missing.
27. Dashboards: Dashboard Chart "Group By" and "Custom" source types, chart filters popover, "Refresh/Reset Chart" dropdown, time-series granularity selector (Daily/Weekly/Monthly), and the dashboard "Edit" mode.
28. Desk-level pages commonly asked for: Home/Desktop (icons grid), "Apps" screen, Setup and System Settings landing pages, and the Dock "More" overflow popover.
29. Email-style and content widgets inside forms: Text Editor (Quill toolbar), HTML Editor, Markdown Editor (split preview), Code field, JSON field, and Comment editor with @mentions. T-F3/F4 do not list them; confirm `fields/*.mjs` covers the toolbars.

C. Weak acceptance checks
30. Several checks are "renders without throwing" or "valid HTML". These pass with an ugly page. Add a baseline: for each wave, store golden screenshots (not fixtures from the real bench) and a nonzero-area, non-overlap assertion in Playwright (`getBoundingClientRect` on `[data-ui]` slots, no horizontal overflow, no element with zero size where content exists). Add an axe or contrast pass for dark mode.
31. T0: "`rg -c 'to confirm'` returns 0" can be satisfied by deleting the phrase. Replace with: every row in a table has a cited path:line in the v16 source, and a reviewer samples five.
32. T-S6: "no worse than current 1.4-4.3%" is a ratchet on a metric the plan says it does not trust. Keep it as a regression guard but add a structural diff (same `data-ui` ids and class names as the capture).
33. T-F8 "zero `[Custom]` strings" is a proxy. Add a check that every `odd_*` fixture build leaves no unresolved `{{`, no `undefined`, no `NaN`, no `[object Object]` in output.
34. T-L3 "5 specs render" does not assert the column cap (the plan itself says cap at max fields) or that the subject column is always first. Add exact column count and order assertions.
35. T-L6 "counts sum to row count" is wrong for multi-value fields (tags, `_assign`), where a row appears in several groups. Constrain the test to single-value Select/Link.
36. T-C1 "7 chart types render" has no data-correctness check. Assert that bar heights and slice angles are proportional to input (compute from SVG attributes), and the cap rules (6 slices / 9 points) with an "Others" bucket.
37. T-X3 genericity guard greps only `renderers kit-lib shell`. Add `bin`, `adapters`, `data/gen.mjs`, and `schemas`; and add "Selling" and "Sales Invoice" exclusions only in fixtures. Note that the guard will false-positive on legitimate Frappe core strings (e.g. "Customer" appears in `Link` placeholder examples); keep an allowlist file.
38. T-F1 only exercises `odd_a` docstatus 1. Add explicit matrix tests for docstatus 0/1/2 x unsaved x workflow x `is_submittable` x amended.
39. T-S3 names a test, `depends.test.mjs`, that tests field-dependency logic, not sidebars. Wrong reference; create `sidebar.test.mjs`.
40. T-X2 "mock render docs/recipes/*.json exits 0" proves rendering, not that recipes are useful. Require each recipe to include the expected screenshot in the docs (generated) and the human-readable "what you see".

D. Dependency and sequencing errors
41. T-L1 lists `T3, T4` but T-L4 (indicators) is also an input to cell rendering for status columns and depends on T4 only; T-L3 needs T-L4 and should list it. T-L3 currently depends only on T-L1.
42. T-R3 depends on T-C1 but not on T-F9/`fields/*.mjs` filter controls or on T-L4 (indicator in report cells); add.
43. T-W1 depends on T-S1 but also needs T2 (workspace adapter). Add T2.
44. T-F2 depends on T4 and T1 but custom button groups need the `overlays` schema from T1 to be final. Mark T1 as a hard gate with a "schema freeze" milestone; otherwise every renderer is rewritten when overlay types change. Add an explicit review of the overlay vocabulary before Wave 1.
45. T-F8 does not depend on T-F3 or T-F4 (layout and grid) although it replaces the regex splicing that renders them. Add them.
46. T-G2 depends on T-F8 only; Single DocType requires T-F1 (no status pill) and T-F2 (Update button). Fine, but the check "renders without status pill" should be an assertion, not "verify".
47. T-V1..V5 depend on T-L2 for the view switcher but kanban/calendar/gantt also need T-L1 (cell colour logic) and T-C1 (gantt/calendar do not, but kanban cards use indicators). Add T-L4 to T-V1.
48. T0 is a prerequisite for T-V*, T-L5, T-L6, T-G1 per section 6, but the task table lists no T0 dependency for T-V1..V5, T-G1 or T-L5. Add them.
49. The "Wave 1 and 2 parallel" claim conflicts with the file-scope rule: T-F8 edits `doctype/render-doctype.mjs` while T-S* replace the shell that file splices. Serialise T-F8 strictly after T-S6 (already stated), but also forbid T-F1/F2/F5/F6 from touching `render-doctype.mjs`.
50. `kit-lib/datatable.mjs` is claimed by both T-F4 (child grid) and T-R1 (report datatable). Two owners on one file. Split into `grid.mjs` and `datatable.mjs`, or put T-R1 first and make T-F4 depend on it.
51. `kit-lib/indicators.mjs` is claimed by T4 and T-L4. Also `bin/mock.mjs` is claimed by T1 and T-X1 (acknowledged). Resolve the indicators clash by assigning T-L4's rule table to a new file.

E. Process and risk
52. No task to extract Frappe v16 CSS and verify the Espresso (`es-*`) markup actually matches the bench DOM per component. The plan reuses a Customer-capture and "markup reference" for everything else. Add a "markup harvest" task per surface: capture the real DOM of an open menu, dialog, filter popover and so on from the bench (read-only) as the reference, because hand-reconstructed class names are the main source of visual drift.
53. T2 normalises to nested `children`, but the owner already has the `frappe-desk` skill (`fdesk`) that edits Sidebar, Dock and Workspace. Reuse its schema for those inputs instead of inventing adapters. Same for the Workspace Sidebar doctype shape.
54. Cost and size: 40+ tasks with three L-sized items rated for Sonnet low. T-C1 (7 chart types by hand), T-F4, T-L3, T-R1 and T-W1 are underspecified for one Sonnet-low pass. Split each (charts per type; datatable into header, body, totals).
55. Section 3.3 forbids duplicate logic but no one owns the shared CSS. Add a `kit-lib/base.css` ownership rule (new tokens go through one task) to avoid colliding edits.
56. The owner's own framing ("can we visualize it or not") suggests a single coverage dashboard: a generated coverage matrix HTML (surface x state x renderer) with a pass/fail per cell, so the question "do we have complete coverage of sidebar, workspace, list, report" is answered by a page, not by prose. Add as T-X4 and have each task register its cells.
