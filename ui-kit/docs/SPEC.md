# Mock spec reference (`mock-spec/1`)

One JSON file describes one desk page. The engine validates it, resolves its metadata, hands it to a page renderer and wraps the result in the desk shell.

- Schema: `schemas/mock-spec.schema.json`
- CLI: `bin/mock.mjs`
- Samples: `samples/{blank,form,list,workspace}.json`

Paths in this document are relative to `ui-kit/`.

## CLI

```
node bin/mock.mjs validate <spec.json>... [--json]
node bin/mock.mjs render <spec.json> [--out file.html] [--theme light|dark] [--rtl]
                         [--viewport WxH|desktop|tablet|mobile] [--today YYYY-MM-DD] [--locale xx]
```

| Exit | Meaning |
|---|---|
| 0 | ok (warnings and notes do not fail) |
| 1 | invalid spec: schema error, unresolvable metadata, failed semantic check |
| 2 | no renderer for the page, or the renderer or shell threw |
| 64 | usage error |

Errors and warnings are printed as `<file>: <JSON pointer>: <message>`, for example `samples/x.json: /overlays/2/state: must be one of "hover", ...`. `--json` prints `[{file, ok, errors, warnings, notes}]`.

`render` without `--out` writes the HTML to stdout. Warnings (including overlays no renderer drew) go to stderr. The CLI options override `ctx` before validation.

`validate` runs three passes:
1. **Schema**: `schemas/mock-spec.schema.json`. The validator is built into `bin/mock.mjs` (no dependencies) and supports the keywords the schema uses: `type, enum, const, required, properties, patternProperties, additionalProperties, items, minItems, maxItems, minimum, maximum, minLength, pattern, oneOf, anyOf, $ref (#/$defs/...)`. It refuses to load a schema that uses any other keyword, so an edit to the schema cannot be silently ignored.
2. **Resolution**: every `meta` ref, `data.doc`/`data.rows` path and dialog `doctype` must load.
3. **Semantics**: the page has the metadata it needs (errors). Field names in targets, filters, sort and group-by exist on the DocType; row indexes are in range; `button_group:<g>` has buttons; at most one primary button; `view.tab` exists; workspace block types are known (warnings).

A note `no renderer yet for page "x"` is informational.

## Spec shape

```jsonc
{
  "$schema": "mock-spec/1",
  "extends": "../base.json",      // optional
  "page": "form",                 // required
  "title": "Optional <title>",
  "ctx":      { ... },            // environment as data
  "meta":     { ... },            // Frappe-native metadata, by name, path or inline
  "data":     { ... },            // sample data
  "overlays": [ ... ],            // runtime-only pieces and open/state layers
  "view":     { ... },            // which part of the page is showing
  "x-notes":  "keys starting with x- or _ are ignored"
}
```

Any other top-level key is an error, which catches typos.

### `page`

`blank | form | list | report | query_report | workspace | dashboard | kanban | calendar | gantt | tree | image | map | inbox | dialog`

| page | needs |
|---|---|
| form, list, kanban, calendar, gantt, tree, image, map, inbox | `meta.doctype` |
| report | `meta.doctype` or `meta.report` |
| query_report | `meta.report` |
| workspace | `meta.workspace` |
| dashboard | `meta.dashboard` |
| dialog | at least one `dialog` overlay |
| blank | nothing (shell with an empty main slot; built in) |

### `extends`

A path relative to the spec file. The base is loaded first (recursively; cycles are errors), then the child merges over it: objects merge deeply, arrays and scalars replace, and `null` removes a key. Relative paths inside the base resolve from the base's own folder. Only the merged result is validated, so a base may be partial.

### `ctx`

Everything environment-like is data. The engine reads no clock, locale, timezone or env var.

| key | type | default | notes |
|---|---|---|---|
| `theme` | `light \| dark` | `light` | |
| `locale` | BCP-47-ish string | `en` | |
| `rtl` | boolean | `false` | sets `dir="rtl"` |
| `viewport` | `WxH \| desktop \| tablet \| mobile` | `1440x900` | presets: 1440x900, 768x1024, 375x812 |
| `today` | `YYYY-MM-DD` | `2026-01-01` | the date the mock pretends it is (relative dates, overdue, calendar focus, gantt today line). Always set it in real specs. |
| `now` | `YYYY-MM-DD HH:mm[:ss]` | `${today} 12:00:00` | for "5 minutes ago" |
| `app` | string | | selected dock app |
| `workspace` | string | | selected Workspace Sidebar |
| `breadcrumbs` | string[] | derived | |
| `user` | `{name, full_name, email, image, roles}` | Administrator / System Manager | |
| `chrome` | `{shell, navbar, dock, sidebar}` | `true, false, true, "expanded"` | `sidebar`: `expanded \| collapsed \| hidden`; `shell: false` renders the page body alone |
| `system` | see below | | System Settings |
| `desk_settings` | `{search_bar, notifications, list_sidebar, bulk_actions, view_switcher, form_sidebar, timeline, dashboard}` | all `true` | User desk settings |
| `perms` | `{ "<DocType>": { "<ptype>": bool } }` | `{}` (all allowed) | e.g. `{"create": false, "delete": false}` |

`ctx.system` (System Settings):

| key | values | default |
|---|---|---|
| `number_format` | `#,###.##`, `#.###,##`, `# ###.##`, `# ###,##`, `#'###.##`, `#, ###.##`, `#,##,###.##`, `#,###.###`, `#.###`, `#,###` | `#,###.##` |
| `date_format` | `dd-mm-yyyy`, `dd.mm.yyyy`, `dd/mm/yyyy`, `mm/dd/yyyy`, `mm-dd-yyyy`, `yyyy-mm-dd` | `dd-mm-yyyy` |
| `time_format` | `HH:mm:ss`, `HH:mm` | `HH:mm:ss` |
| `currency_precision` | integer 0..9 or `null` | `null` = decimals from `number_format` |
| `float_precision` | integer 0..9 | `3` |
| `currency` | ISO code | `USD` (used when a doc has none) |
| `first_day_of_the_week` | `Sunday` .. `Saturday` | `Sunday` |
| `time_zone` | string | display only |

### `meta`

Frappe-native JSON only. Never invent a parallel format for something Frappe already defines. Each value is a **ref**:

- an **inline object**: the Frappe JSON itself;
- a **path** (contains `/` or ends in `.json`): relative to the spec file, then to `ui-kit/`;
- a **name**: looked up as `<snake_case(name)>.json` in the spec's folder, then `<spec folder>/meta/`, then the kind's default dir:

| key | Frappe JSON | default lookup dir |
|---|---|---|
| `doctype` | DocType | `doctype/fixtures/**` |
| `children` | `{ "<DocType>": ref }` for child/linked DocTypes not found by name | `doctype/fixtures/**` |
| `custom` | custom fields / property setters (one ref or a list), as read by `doctype/lib/customize.mjs` | none |
| `sidebar` | Workspace Sidebar | `doctype/workspaces` |
| `workspace` | Workspace (`content`, `shortcuts`, `links`, `charts`, `number_cards`, `quick_lists`, `custom_blocks`) | none |
| `report` | Report | none |
| `workflow` | Workflow | none |
| `list_view_settings`, `kanban_board`, `calendar_view`, `dashboard` | the matching DocType record | none |
| `states` | DocType State rows `[{title, color}]` (inline only) | |

Other keys are allowed (for new page types) and resolve the same way, with no default dir.

After resolution every ref is replaced by its JSON, and `meta.workspace.content` is always an array (Frappe stores it as a JSON string; both are accepted).

### `data`

| key | type | notes |
|---|---|---|
| `doc` | object, path, `{"$gen": {...}}`, `null` | the form's document. Absent or `null` = a new, unsaved form. Paths are loaded. |
| `rows` | array, path to a JSON array, `{"$gen": {...}}` | rows for list, report and other collection views |
| `total` | integer | total count for paging ("20 of 1,284"); defaults to `rows.length` |
| `linkPools` | `{ "<Link target>": [names] }` | values the generator uses for Link fields |

`$gen` = `{count, seed, locale, child_rows}`. The engine passes it through untouched; renderers expand it with `data/gen.mjs` (seeded, deterministic). Page renderers may read further keys (`events`, `number_cards`, `chart`, `counts`, ...); document them in the renderer's README.

### `view`

| key | notes |
|---|---|
| `tab` | form tab, by label or 0-based index. The implicit first tab is `Details`. |
| `sidebarSection` | sidebar section to show open |
| `collapsed` | collapsible section labels to show collapsed (or expanded, if collapsed by default) |
| `sort` | `{field, order: asc\|desc}` |
| `group_by` | fieldname |
| `page_length` | `20 \| 100 \| 500` |
| `state` | whole-page state: `normal \| empty \| no_results \| loading \| error` |

Page renderers may read further keys.

## Overlays

Overlays carry what Frappe has no metadata for: client-script buttons, intros, open menus, dialogs, selections, toasts and hover/focus states. They are discriminated by `type`. A renderer draws the ones that belong to its page; an overlay nobody drew is reported as a warning, never silently dropped.

**Layers**, low to high: `page` (button, intro, list_select, filter_chips, state) < `popover` (menu_open) < `modal` (dialog) < `toast`. Inside a layer, later overlays draw on top. Dialogs stack in array order (the last is on top, earlier ones are dimmed behind its backdrop). Toasts stack bottom-up.

### `button`
`frm.add_custom_button`, `page.add_inner_button`, `page.set_primary_action`.
```json
{"type": "button", "label": "Payment Entry", "group": "Create", "style": "default", "align": "right"}
```
`style`: `default | primary | secondary | danger`. `align`: `left | right` (default right). `group`: buttons sharing a group collapse into one dropdown button labelled with the group. `primary_action: true` replaces the page's primary action (Save/Submit). `icon`: lucide name. `target`: default `page.actions` (page head); also `row_actions:<n>` or `field:<fieldname>`.

### `intro`
`frm.set_intro`. `{"type": "intro", "text": "...", "color": "blue"}`. Colours: `blue green red orange yellow gray grey darkgrey purple pink cyan light-blue`.

### `menu_open`
Draw one dropdown or popover in its open state.
```json
{"type": "menu_open", "target": "page.menu", "items": ["Print", "---", {"label": "Delete", "danger": true}], "highlight": 0}
```
`items` replaces the generated items, `extra_items` appends. A string item is a label; `"---"` is a divider; an object is `{label, icon, shortcut, danger, disabled, checked, group}`. `query` is the typed text for search-like targets. `highlight` is the keyboard-highlighted index.

**Target registry** (also exported as `MENU_TARGETS` from `bin/mock.mjs`):

| target | what |
|---|---|
| `page.menu` | page head "..." menu (form, list, report, workspace) |
| `page.actions` | "Actions" dropdown (workflow transitions; list bulk actions) |
| `page.primary` | split primary button dropdown |
| `page.view_switcher` | List / Report / Kanban / ... switcher |
| `page.sort` | sort selector |
| `page.group_by` | group-by selector (page head or report toolbar) |
| `page.filter` | filter popover (rows from `filter_chips`) |
| `page.settings` | list settings / column picker |
| `page.page_length` | paging size |
| `navbar.search` | awesomebar results (`query`) |
| `navbar.notifications` | notifications panel |
| `navbar.help` | help dropdown |
| `navbar.user` | user avatar menu |
| `sidebar.header` | sidebar header (workspace/app switcher) |
| `sidebar.user` | sidebar user block |
| `dock.more` | dock overflow |
| `workspace.menu` | workspace page menu |
| `workspace.block_picker` | workspace "+" block picker |
| `button_group:<group>` | a custom button group's dropdown |
| `row_actions:<n>` | list row action dropdown (0-based row) |
| `column:<fieldname>` | datatable column header dropdown |
| `field:<fieldname>` | field popover: Link results (with "Create a new ..." and "Advanced Search"), Select, date/time picker, colour, icon |
| `chart:<name>` | chart toolbar menu |
| `group_by:<fieldname>` | list sidebar group-by dropdown (`assigned_to`, `owner`, `tags` allowed) |
| `ui:<id>` | escape hatch: any element with `data-ui="<id>"` |

A renderer that owns a target must render it in the open state when asked; adding a target means adding it to the schema pattern, `MENU_TARGETS` and this table.

### `dialog`
`frappe.ui.Dialog`, `frappe.confirm`, `frappe.msgprint`, Quick Entry.
```json
{"type": "dialog", "kind": "dialog", "title": "New Task", "size": "large",
 "fields": [{"fieldname": "subject", "fieldtype": "Data", "label": "Subject", "reqd": 1},
            {"fieldtype": "Column Break"},
            {"fieldname": "due", "fieldtype": "Date", "label": "Due"}],
 "values": {"subject": "Call back"}, "primary_action": "Create", "secondary_action": "Cancel"}
```
`kind`: `dialog | confirm | msgprint | quick_entry`. `size`: `small | default | large | extra-large`. `message`: text for confirm/msgprint (lines split on `\n`). `indicator`: title colour (msgprint). `fields` are DocField-shaped and rendered with `doctype/fields/*.mjs` (Section Break and Column Break allowed). For `quick_entry`, `doctype` is a ref (name, path or inline) and the mandatory fields plus "Edit Full Form" are shown. Actions are a label or `{label, style}`.

### `list_select`
`{"type": "list_select", "rows": [0, 2, 5], "bulk": ["Edit", "Delete"], "open": true}`. `rows` are 0-based indexes or `"all"`. Shows checked rows, "3 selected" and the Actions menu (`bulk` replaces its items; `open` shows it open).

### `filter_chips`
`{"type": "filter_chips", "items": [["status", "=", "Paid"], ["Item", "item_group", "in", ["A", "B"]]], "open": false}`. Frappe filter tuples `[fieldname, op, value]` or `[doctype, fieldname, op, value]`. Operators: `= != > < >= <= like, not like, in, not in, is, between, timespan, descendants of, descendants of (inclusive), not descendants of, ancestors of, not ancestors of` (case-insensitive). `open: true` shows the filter popover.

### `state`
Pin one element in an interaction state. `{"type": "state", "target": "row:3", "state": "hover"}`.

States: `hover | focus | active | disabled | loading`.

| target | element |
|---|---|
| `row:<n>` | list/report row (0-based) |
| `cell:<n>:<fieldname>` | one cell of a list/report/grid row |
| `field:<fieldname>` | form or dialog field control |
| `button:<label>` | a button by label; `button:primary` = the page primary action |
| `tab:<label>` | form tab |
| `link:<label>` | sidebar link or workspace card link |
| `card:<label>` | workspace shortcut, number card or chart widget |
| `column:<fieldname>` | datatable column header |
| `ui:<id>` | any element with `data-ui="<id>"` |

Renderers mark the element with the class Frappe uses for that state where one exists, and always with `data-state="<state>"`, so the shell can style it.

### `toast`
`frappe.show_alert`. `{"type": "toast", "message": "Saved", "indicator": "green"}`.

## Renderer contract

This is the stable interface. Keep it small.

**Location.** `renderers/<page>/index.mjs`. Its **default export** is

```js
export default function render(spec, ctx) { return html; }   // may be async
```

**Return.** One of:
- a string: the main-slot HTML;
- `{ main, head?, aside?, title? }`: slot HTML (`head` = page head, `aside` = right panel such as the form or list sidebar, `title` = document title);
- `{ document }`: a complete HTML document, written as is (no shell).

The engine wraps slots with `shell/shell.mjs` (default export `(slots, spec, ctx) => html`). Until the shell exists, or when `ctx.chrome.shell` is `false`, it uses a plain fallback document with the same `data-ui` slots: `desk, navbar, dock, sidebar, page, page-head, main, right-panel, layer-popover, layer-modal, layer-toast`. `blank` has a built-in renderer (empty main slot) that is used while `renderers/blank/index.mjs` does not exist.

**`spec`** is the merged, validated and resolved spec: `extends` applied, every `meta` ref replaced by its JSON, `data.doc`/`data.rows` paths loaded, `meta.workspace.content` parsed. `$gen` objects are left in place. Overlay objects are frozen; do not mutate the spec.

**`ctx`** is `spec.ctx` with schema defaults applied, plus derived values and helpers:

| member | |
|---|---|
| `theme, locale, rtl, app, workspace, today, now, user, chrome, system, desk_settings, perms, breadcrumbs` | as in the spec, defaults filled |
| `viewport` | `{width, height, device: "desktop"\|"tablet"\|"mobile"}` (an object here, not the spec string) |
| `dir` | `"ltr"` or `"rtl"` |
| `overlays` | all overlays in spec order (read-only) |
| `useOverlays(type, pred?)` | the overlays of `type` matching `pred`, marked as drawn. Call it for every overlay you draw; undrawn overlays are reported. |
| `resolve(ref, kind = "doctype")` | load a ref (name, path or inline) the same way `meta` is resolved; `meta.children` is consulted for doctypes. Returns JSON or `null`. |
| `href(kitPath)` | URL from the output file to a file in `ui-kit/` (CSS, sprite, fonts) |
| `warn(msg)` | report a problem without failing |
| `kit, specFile, specDir` | absolute paths |

**Rules for renderers**
- Deterministic: no `Date`, `Math.random`, env, network or file mtimes. Use `ctx.today`/`ctx.now`, and `data/gen.mjs` for sample values.
- Generic: never hard-code a doctype, app or brand name. Names come from `spec` only.
- Format numbers, dates and currency from `ctx.system`.
- Mark addressable elements with `data-ui` ids so overlays and screenshots can find them.
- Throwing is fine for bugs (exit 2); use `ctx.warn` for missing optional data.

**Programmatic use.** `bin/mock.mjs` also exports `loadSpec(file, ctxOverrides)`, `buildCtx(loaded, {outFile})`, `renderSpec(loaded, {outFile})`, `validateSchema(data)`, `normalizeCtx(specCtx)`, `mergeSpec(base, over)`, and the registries `PAGES`, `OVERLAY_TYPES`, `OVERLAY_LAYER`, `MENU_TARGETS`, `STATE_TARGETS`, `STATES`, `FILTER_OPERATORS`, `WORKSPACE_BLOCKS`, `STANDARD_FIELDS`. The CLI runs only when the file is executed directly.
