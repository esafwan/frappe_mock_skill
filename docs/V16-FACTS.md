# Frappe v16 facts (T0)

Source: `frappe/frappe`, branch `version-16`, commit `8b19f8c8e334b48e14ecee7231a1a98774c2ebd5` ("chore(release): Bumped to Version 16.61.0", 2026-11-24). Read from a sparse clone, so line numbers are exact for that commit. The live bench may run a different 16.x; the markup tests in the kit are the check against it, not this file.

Path prefix: `JS/` = `frappe/public/js/frappe/`. `DT/` = `frappe/desk/doctype/`. Every row below carries a `file:line` (or range) so a reviewer can sample it.

## 0. Corrections to the plan (read first)

| # | Plan assumption | What v16 source says | Cite |
|---|---|---|---|
| C1 | List sidebar has group-by counts, saved filters, tags, "Edit Filters" (T-L6) | There is no list sidebar in v16. `list_sidebar.js` does not exist; the body gets `no-list-sidebar`. Group-by counts survive only as quick-filter dropdown buttons inside the page-form `.standard-filter-section`. `list_sidebar_group_by.js` is legacy; its own comment says it is not used. Saved filters were replaced by saved Layouts (List Filter) in the view switcher. T-L6 must be re-scoped to the filter-bar dropdowns (section 4). | `JS/list/base_list.js:293-295`, `:847-927`; `JS/list/list_sidebar_group_by.js:4`; `frappe/public/js/list.bundle.js` (imports) |
| C2 | `get_indicator` is a 7-step order | It has 10 branches (section 6). Docstatus 0 and 2 are checked before `states`, and docstatus 1 ("Submitted") only after `listview_settings.get_indicator`. | `JS/model/indicator.js:26-125` |
| C3 | "42 of 44 fieldtypes" | DocField `fieldtype` options hold 45 values. The kit lacks exactly `Attachment Gallery` and `Vue Component` (checked by importing `ui-kit/doctype/fields/*.mjs`). The kit also defines `Date Range` and `Comment`, which are controls but not DocField options. | `frappe/core/doctype/docfield/docfield.json` (`fieldtype.options`); `JS/form/controls/attachment_gallery.js:1`, `vue_component.js:9`, `date_range.js`, `comment.js` |
| C4 | Workspace sidebar is one JSON shape | Two doctypes coexist: `Sidebar` (new, per module; fixtures under `<app>/<module>/sidebar/<name>/<name>.json`) and `Workspace Sidebar` (older, still referenced by `Desktop Icon`). The JS renders `Sidebar` items (section 9). | `DT/sidebar/sidebar.json`; `DT/workspace_sidebar/workspace_sidebar.json`; `frappe/desk/doctype/sidebar/convert_fixtures.py:1-12` |
| C5 | "Not Saved" pill colour | Two colours: `get_indicator` returns `amber`; the form toolbar's dirty state calls `page.set_indicator(..., "orange")`. The badge maps `orange` to `amber`, so both render amber. | `JS/model/indicator.js:28`; `JS/form/toolbar.js:916-918`; `JS/ui/components/badge.js:38-40` |
| C6 | Cancel is a primary action | Cancel is the page's secondary action; Save, Submit, Update, Amend are the primary action. | `JS/form/toolbar.js:855-858` vs `:894` |
| C7 | Calendar has list view | Calendar toolbar offers only Month, Week, Day. | `JS/views/calendar/calendar.js:225-228` |

## 1. List view: columns

| Fact | Detail | Cite |
|---|---|---|
| Column cap | `max_number_of_fields = 50`. Applied with `slice(0, 50)` to the column array after Subject, Status and field columns are built, then the Tag column is spliced in at index 1 (so up to 51 including Tag, plus an optional trailing ID column). | `JS/list/list_view.js:43`, `:749-753`; with layout override `:697-698` |
| Column order | 1 Subject (title field or `name` labelled "ID"); 2 Tag (hidden unless `list_view_settings.show_tags`); 3 Status (only if `frappe.has_indicator(doctype)`); then `in_list_view` fields; then, if the doctype has a `title_field` other than `name` and `settings.hide_name_column` is not set, a trailing "ID" Field column. | `JS/list/list_view.js:696-698`, `:704-720`, `:722-765`; `:624` (`tags_shown`) |
| Which fields are candidates | `frappe.model.is_value_type(fieldtype)` AND `in_list_view` AND read permission at permlevel; plus Currency fields whose `options` has no ":"; plus `status`. In `setup_columns` the extra filter drops `status` (when the doctype has an indicator), anything not `in_list_view`, virtual fields, and the title field. | `JS/list/base_list.js:98-108`; `JS/list/list_view.js:726-744` |
| Reordering and widths | `list_view_settings.fields` is a JSON array of `{fieldname, width}`; Subject stays first; Status is addressed as fieldname `status_field`. Widths are clamped to 50-400px. | `JS/list/list_view.js:869-903`; `:1821-1826` |
| Header | Subject header holds select-all checkbox + label; every other header has `data-sort-by`; resize handle only when the user can edit the layout (System Manager when no layout). Right side: `.list-count` and a "Liked by me" heart. | `JS/list/list_view.js:1455-1525` |
| Row skeleton | `.list-row-container > .level.list-row > .level-left (columns) + .level-right (meta)`. | `JS/list/list_view.js:1633-1646` |
| Page size | Default 100 on large screens, else 20; selector values `[20, 100, 500, 2500]`; "Load More" button. Virtual rows at 2000 loaded rows. | `JS/list/base_list.js:51`, `:383`, `:416-428`; `JS/list/list_view.js:51` |
| Count label | `"{0} of {1}"`; total is capped by `count_upper_bound = 1001`, displayed as `N+`; unknown shows `??`. With child rows: `"{0} of {1} ({2} rows with children)"`. | `JS/list/list_view.js:39`, `:2031-2063` |
| Empty state text | "Nothing to show" (`get_no_result_message`). | `JS/list/base_list.js:378-380` |

## 2. List view: subject, indicator, meta

| Piece | Markup and rules | Cite |
|---|---|---|
| Subject cell | `div.list-row-col.ellipsis.list-subject.level` containing a checkbox span (`.list-row-checkbox`) and an `<a>` to the form. Unseen docs (`track_seen`, current user not in `_seen`) get `level-item bold ellipsis` on the wrapper span. Text = title field value, else `name`; HTML fieldtypes are converted to plain text. | `JS/list/list_view.js:1649-1810`, `:2100-2141`, `:2082-2086` |
| Status cell | `div.list-row-col.hidden-xs.ellipsis[data-fieldname=status_field]` holding one `es-badge`. A Workflow State Link field renders the same badge with the workflow colour. | `JS/list/list_view.js:1649-1664` |
| Indicator badge | `frappe.ui.badge.html({label, theme, title, css_class:"filterable ellipsis", attrs:{"data-filter": indicator[2]}})`; `title` is "Document is in draft state" / "has been submitted" / "has been cancelled" by docstatus. Output `span.es-badge[data-theme][title]>span.es-badge__label`; `data-theme` omitted for gray. | `JS/list/list_view.js:2143-2164`; `JS/ui/components/badge.js:30-76` |
| Badge themes | `gray blue green amber red violet`; `orange` becomes `amber`; legacy names accepted: `grey darkgrey yellow cyan purple pink light-blue`. Size `sm|md|lg` (default md), variant `solid|subtle|outline|ghost` (default subtle). | `JS/ui/components/badge.js:23-31`, `:36-48` |
| Indicator dot | `<span class='indicator {colour}' title='{label}'>` (used by Kanban/Gantt-style callers). | `JS/list/list_view.js:2166-2171` |
| Tag column | Up to 2 tags, coloured: `div.tag-pill.ellipsis` with `background-color:var(--X-avatar-bg); color:var(--X-avatar-color)` from `frappe.get_palette(tag)`; empty shows `div.tags-empty` "-". | `JS/list/list_view.js:1663-1673`, `:1885-1906`; `JS/utils/common.js:150-175` |
| Meta (right) block | `.level-item.list-row-activity.hidden-xs` = assignees (`avatar_group`, max `max_number_of_avatars - 1` = 2 shown, from `_assign`), `span.modified` (`comment_when`), comment count (`message-circle` icon, "99+" cap, unless `disable_comment_count`), "·" separator, `span.list-row-like`. A second `.level-item.visible-xs` carries the badge for phones. | `JS/list/list_view.js:1908-1964`, `:43` (`max_number_of_avatars = 3`) |
| Row action button | If `listview_settings.button`: `div.list-row-col.ellipsis.hidden-xs > button.btn.btn-action.btn-default.btn-xs`. If `dropdown_button`: a dropdown of `a.dropdown-item` entries. Header gets an empty column for each. | `JS/list/list_view.js:1966-2030`, `:1517-1522` |
| Selection state | Checked rows tracked in `checked_docnames`; header swaps from `.list-header-subject` to `.checkbox-actions` showing `"{0} items selected"`; the page primary button is cleared and the "Actions" menu shown. | `JS/list/list_view.js:2770-2798`, `:1031-1039`; `JS/ui/page.js:505-512` |
| Click behaviour | `.filterable` cells and badges carry `data-filter="field,op,value"`; clicking adds that filter. | `JS/list/list_view.js:1730-1790` (`data-filter`), `:2341` (`setup_list_click`) |

## 3. List view: cell formatters per fieldtype (`get_column_html`)

`field_html()` branches by fieldtype, then `frappe.format` (`JS/form/formatters.js:438-464`) picks `frappe.form.formatters[fieldtype.replace(/ /g,"")]`, falling back to `Data`. Numeric columns get `text-right`. A `listview_settings.formatters[fieldname]` function replaces the whole cell (not Subject).

| Fieldtype | List cell | Cite |
|---|---|---|
| Select | `frappe.ui.badge.html({label, theme: guess_colour(value), css_class:"filterable ellipsis", attrs:{data-filter}})`, empty string if no value | `JS/list/list_view.js:1739-1750` |
| Link | `<a class="filterable ellipsis" data-filter=...>` showing the link title (if `show_title_field_in_link`) else the name; plain text for unreadable doctypes in `formatters.Link` | `JS/list/list_view.js:1751-1755`, `:405-440`; `JS/form/formatters.js:169-221` |
| Percent | `div.progress > div.progress-bar.progress-bar-success[style=width:{round(value)}%]`; cell wrapper `title="Label: value"`; no text | `JS/list/list_view.js:1654-1674` (format), `:1761-1766` |
| Data | `escape_html(value)` then `frappe.format`; `options=URL` renders `<a target=_blank>`; `IBAN` formatted | `JS/list/list_view.js:1673-1676`; `JS/form/formatters.js:36-47` |
| Currency | `format_currency(value, currency, precision)`, right aligned (`_right`) | `JS/form/formatters.js:126-163`, `:12-18` |
| Float / Int | right aligned; Float shows `1.000000` as `1` unless `always_show_decimals`; Int with `options="File Size"` formats as `K`/`M` | `JS/form/formatters.js:55-89`, `:372-380` |
| Percent value (non-list) | `format_number(...)+"%"`, right aligned | `JS/form/formatters.js:90-105` |
| Rating | value multiplied by star count (`options` or 5) before escaping; `div.rating` of SVG stars, half-star rounding | `JS/list/list_view.js:1722-1725`; `JS/form/formatters.js:107-125` |
| Image | `<img src=doc[df.options] style="max-height:30px;max-width:100%">`; with no `options`: `div.missing-image.small` with the `ban` icon | `JS/list/list_view.js:1733-1738` |
| Date | `frappe.datetime.str_to_user(value)`; empty if invalid | `JS/form/formatters.js:222-235` |
| Datetime | `moment(convert_to_user_tz(value)).format(date_format + " " + (time_format \|\| "HH:mm:ss"))` | `JS/form/formatters.js:246-256` |
| Time | `str_to_user(value, true)` | `JS/form/formatters.js:276-282` |
| Check | `<input type=checkbox disabled class="disabled-selected|disabled-deselected">` | `JS/form/formatters.js:164-168` |
| Color | `div > div.selected-color[style=background-color:v] + span.color-value` | `JS/form/formatters.js:407-414` |
| Duration | `get_formatted_duration`, `"0s"` when empty | `JS/form/formatters.js:283-290` |
| Attach / Attach Image | `<a href target=_blank>` with the URL text | `JS/form/formatters.js:430-436` |
| Text, Small Text | newline to `<br>` unless HTML tags present; list cell wraps via the `html_fieldtypes` branch as `span.ellipsis` | `JS/form/formatters.js:257-275`, `:327-329`; `JS/model/model.js:114-122`; `JS/list/list_view.js:1756-1759` |
| Text Editor | `div.ql-editor.read-mode`; in list, HTML stripped (`strip_html`) | `JS/form/formatters.js:330-345`; `JS/list/list_view.js:1714-1717` |
| Code | `<pre>` with escaped text | `JS/form/formatters.js:346-348` |
| Icon | emoji as text, else icon svg + `span.icon-value` | `JS/form/formatters.js:415-429` |
| Table MultiSelect | comma-joined formatted link values | `JS/form/formatters.js:381-406` |
| Dynamic Link | formatted as Link using the sibling field for `options` | `JS/form/formatters.js:449-453` |
| Tags `_user_tags` | `Tag` formatter: `span.data-pill` per tag | `JS/form/formatters.js:298-313`, `:446` |
| Assign `_assign` | `span.label.label-warning` per user | `JS/form/formatters.js:317-326` |

### `guess_colour` / `guess_style`

`guess_colour(text)` = `guess_style(text, null, true)`, default `gray`. Test is substring (`has_words` uses `indexOf`, case sensitive; an empty text returns true so it never reaches here), first match wins in this order:

| Order | Words | Colour (style) |
|---|---|---|
| 1 | Pending, Review, Medium, Not Approved | amber (warning) |
| 2 | Open, Urgent, High, Failed, Rejected, Error | red (danger) |
| 3 | Closed, Finished, Converted, Completed, Complete, Confirmed, Approved, Yes, Active, Available, Paid, Success | green (success) |
| 4 | Submitted | blue (info) |
| else | | gray (default) |

Cite: `JS/utils/utils.js:522-562`, `:564-566`; `has_words` at `JS/utils/datatype.js:66-73`. Note: "Open" is red and "Closed" is green here; do not "fix" this. Tag and avatar colours use a separate hash: `frappe.get_palette` = `palette[floor((hex(md5(txt)[4:6]) + 1) / 5.33) % 8]` over 9 entries (`orange pink blue green dark-green red yellow purple gray`) (`JS/utils/common.js:150-175`). A deterministic kit must use an md5 implementation to match.

## 4. List view: filter bar, group-by, sort, menus, bulk

| Element | Fact | Cite |
|---|---|---|
| Filter area structure | `div.standard-filter-section.flex` (standard filter boxes + group-by buttons) appended to the page form, then `div.filter-section.flex` (filter button with count, sort selector). | `JS/list/base_list.js:662-685` |
| Standard filter boxes | An "ID" Data box (unless `settings.hide_name_filter`), then fields where `fieldname == title_field` OR (`in_standard_filter` OR user-chosen group-by field) AND value type AND permitted. Text-like types become Data with `like`; Select gets an empty first option. | `JS/list/base_list.js:1166-1300` |
| Group-by buttons | From user setting `group_by_fields`; only `assigned_to`, `owner` ("Created By"), `tags` are rendered as buttons here: `div.group-by-field.list-link > a.btn.btn-default.btn-sm.list-sidebar-button` with label and `chevrons-up-down` icon. Other chosen fields appear as standard filter boxes. | `JS/list/base_list.js:716-727`, `:847-889` |
| Group-by dropdown | Search input, then applied item first (with `check` icon, class `selected`), then items; each `div.group-by-item > a.dropdown-item > span.group-by-value + span.group-by-count`. Labels: null = "Not Set", current user = "Me", Check = "No"/"Yes". Zero counts removed; current user moved to top; Guest and Administrator removed. Empty list shows an empty state. | `JS/list/base_list.js:958-1010`, `:1064-1088`, `:1116-1122` |
| Tags dropdown | `list_sidebar_stat` template, "No Tags" item. | `JS/list/base_list.js:1012-1062`; `frappe/public/js/frappe/list/list_sidebar_stat.html` |
| "Customize Quick Filters" | List menu item (group "List View", hidden on mobile) opening dialog "Select Filters" with a MultiCheck (2 columns) of Select/Link/Data/Int/Check fields plus Assigned To, Created By, Tags; Save reloads. | `JS/list/list_view.js:2859-2866`, `:2944-3020` |
| Sort | `frappe.ui.SortSelector` in `.filter-section`. | `JS/list/base_list.js:328-339` |
| List menu (page `...`) | Order: Customize Quick Filters; List Settings (System Manager only, group "List View"); then if user can create Custom Field and Property Setter and doctype is not core: `Settings - {DocType}` and `Customize` (Ctrl+Y) in group "Customize"; `Edit DocType` (System Manager + developer mode); `User Permissions` and `Role Permissions Manager` (System Manager, group "Permissions"); `Documentation` if the doctype has a safe `documentation` URL. | `JS/list/list_view.js:2856-2940`, `:3022-3029`; `JS/list/base_list.js:250-282` |
| Secondary action | A `refresh-cw` icon button titled "Reload List", unless the view supplies its own secondary action. | `JS/list/base_list.js:226-248` |
| Primary action | Shown when `can_create && !read_only`: label "Add {DocType}" (short label "Add" below md; icon `plus`); label falls back to "Add" if it would overflow. Chevron options appear only when there is more than one create path: "Add manually" (+ "Upload" if `enable_upload_first_workflow`) in a hidden-label group "Create", plus "Import" in group "Import" when the user can import. Otherwise a plain button. Cleared while rows are selected. | `JS/list/list_view.js:488-582`, `:1031-1039` |
| Actions menu (bulk) order | Copy to Clipboard; Edit (if the doctype has editable fields and bulk edit allowed: no workflow, or `list_view_settings.allow_edit`); Export (`can_export`); Assign To; Clear Assignment; Apply Assignment Rule; Add Tags; Print (`can_print`); Submit (submittable, submit perm, no workflow); Cancel (`can_cancel`, no workflow); Delete (`can_delete` and bulk edit allowed). Workflow actions are appended after these. | `JS/list/list_view.js:3098-3552`, labels at `:3135`, `:3150`, `:3167`, `:3186`, `:3201`, `:3210`, `:3250`, `:3283`, `:3311`, `:3367`, `:3380`; push order `:3506-3548` |
| Selected-count label | `"{0} items selected"`; as a mobile sheet title with one row selected it shows the document title. | `JS/list/list_view.js:2788-2789`, `:351-355` |
| Saved views | Saved Layouts (List Filter doctype) are rows in the view switcher's List submenu; the trigger shows the active layout label. `default_layout` is the unnamed default. | `JS/list/list_view_select.js:60-66`, `:181-245`; `DT/list_filter/list_filter.json` |
| Mobile | `frappe.is_mobile()` swaps in `mobile-layout` columns (id, date, up to 2 more) and `phone_card` amount. | `JS/list/list_view.js:1549-1625` |

## 5. View switcher: enabled-view logic

One `es-dropdown` button (`.custom-btn-group.view-switcher`) in the page header; created only when `frappe.boot.desk_settings.view_switcher` is on and the doctype has no `force_re_route_to_default_view`. Trigger label is the view name ("List View", ...) or the active variant (layout name, kanban board, calendar, inbox account, saved report). Items follow `view_modes` order and appear only when `condition` is truthy. Rows with variants carry a submenu always.

| View | Icon | Label | Enabled when | Cite |
|---|---|---|---|---|
| List | `list` | List View | always (`File` labels it "File") | `JS/list/list_view_select.js:127-130`; icons `JS/list/base_list.js:1443-1453`; labels `:1455-1467` |
| Report | `sheet` | Report View | `frappe.boot.user.can_get_report` includes doctype | `JS/list/list_view_select.js:131-134`; `JS/model/model.js:366-368` |
| Dashboard | `layout-dashboard` | Dashboard View | always | `JS/list/list_view_select.js:136-139` |
| Gantt | `square-chart-gantt` | Gantt View | `frappe.views.calendar[doctype]` set or meta `is_calendar_and_gantt` | `JS/list/list_view_select.js:146-151` |
| Kanban | `square-kanban` | Kanban View | doctype is not `File` | `JS/list/list_view_select.js:171-174` |
| Calendar | `calendar` | Calendar View | same as Gantt | `JS/list/list_view_select.js:140-145` |
| Image | `image` | Image View | meta `image_field` set | `JS/list/list_view_select.js:157-160` |
| Inbox | (none in icon map, falls back to `list`) | Inbox View | doctype is `Communication` and boot has email accounts | `JS/list/list_view_select.js:152-156` |
| Tree | `list-tree` | Tree View | `treeview_settings[doctype]` or meta `is_tree` | `JS/list/list_view_select.js:161-166` |
| Map | `map` | Map View | `settings.get_coords_method`, or fields `latitude`+`longitude`, or a `location` Geolocation field | `JS/list/list_view_select.js:175-185` |

Order list: `JS/list/base_list.js:1469-1480`. Selected row has `selected: true`; a row without a submenu switches on click; a row with variants opens its panel. Submenu content: List gets saved layouts (only if `show_saved_layout_menu`; from other views it queries List Filter, `:200-245`), Report gets saved reports, Calendar gets calendars, Inbox accounts, Kanban boards (`:119-135`). Trigger button: `icon_right: "chevrons-up-down"` (`:84-91`). The deprecated badge (`red`) shows next to the title when the DocType is deprecated (`JS/list/base_list.js:198-210`).

## 6. `frappe.get_indicator` order (docs, forms, lists)

Returns `[label, colour, filter]` or nothing. First match wins:

| # | Condition | Result | Cite |
|---|---|---|---|
| 1 | `doc.__unsaved` | `["Not Saved", "amber"]` | `JS/model/indicator.js:27-29` |
| 2 | Doctype has a workflow with a state field, and (`override_status` is not set on the workflow, or `show_workflow_state` is true), and the state is not in `avoid_status_override`, and the doc has a value | `[state, colour, "<field>,=,<state>"]`; colour from Workflow State `style`: Success green, Warning orange, Danger red, Primary blue, Inverse black, Info light-blue; none gives gray | `JS/model/indicator.js:40-69` |
| 3 | submittable, `docstatus == 0`, no `has_indicator_for_draft` | `["Draft", "red", "docstatus,=,0"]` | `JS/model/indicator.js:71-74` |
| 4 | submittable, `docstatus == 2`, no `has_indicator_for_cancelled` | `["Cancelled", "red", "docstatus,=,2"]` | `JS/model/indicator.js:76-79` |
| 5 | `doc.status` matches a DocType `states` row title | `[status, scrub(state.color,"-"), "status,=,<status>"]` | `JS/model/indicator.js:81-86` |
| 6 | `listview_settings.get_indicator(doc)` returns something | that value | `JS/model/indicator.js:88-91` |
| 7 | submittable, `docstatus == 1` | `["Submitted", "blue", "docstatus,=,1"]` | `JS/model/indicator.js:93-96` |
| 8 | `doc.status` | `[status, guess_colour(status), "status,=,<status>"]` | `JS/model/indicator.js:98-105` |
| 9 | doctype has an `enabled` field | `Enabled` blue (`enabled,=,1`) or `Disabled` gray (`enabled,=,0`) | `JS/model/indicator.js:107-114` |
| 10 | doctype has a `disabled` field | `Disabled` gray (`disabled,=,1`) or `Enabled` blue (`disabled,=,0`) | `JS/model/indicator.js:116-124` |

`frappe.has_indicator(doctype)` (decides whether the Status column exists): true if submittable; or `listview_settings.get_indicator` or a workflow state field exists; or the doctype has `enabled` or `disabled`; or it has `status` and at least one `states` row. `JS/model/indicator.js:3-24`.

DocType `states` colour options (Kanban column and DocType State share the pattern): Kanban column `indicator` Select values are `Blue, Cyan, Gray, Green, Light Blue, Orange, Pink, Purple, Red, Yellow` (`DT/kanban_board_column/kanban_board_column.json:30-36`).

## 7. Form: page chrome, primary actions, menu

Page header: title (`New {DocType}` for new docs, else title field or name, with the name as a sub-title when different), indicator badge via `page.set_indicator(label, colour)` which writes `<span>label</span>` and `data-theme=colour` onto the page indicator (`JS/form/toolbar.js:43-81` set_title, `:313-329` set_indicator; `JS/ui/page.js:257-267`). Dirty state: "Not Saved", `orange`, plus `data-state="dirty"` on the wrapper (`JS/form/toolbar.js:913-921`).

Primary action decision (`get_action_status`, first match wins) at `JS/form/toolbar.js:814-835`:

| Order | Condition | Status | Where it is drawn |
|---|---|---|---|
| 0 | print view or form hidden | "Edit" (pencil) | primary |
| 1 | `can_submit`: submittable, docstatus 0, not local, not `__unsaved`, perm submit, no workflow (`:729-738`) | "Submit" | primary |
| 2 | `can_save`: docstatus 0 (`:726-728`), and not `save_disabled`, and (with a workflow: only when `__unsaved`; without: always) | "Save" | primary |
| 3 | `can_update`: docstatus 1, not local, perm submit, `__unsaved` (`:739-746`) | "Update" (pencil icon) | primary |
| 4 | `can_cancel`: docstatus 1, perm cancel, not read-only (`:747-749`) | "Cancel" | secondary action; with a workflow shown only if `can_cancel_document` is true (`:855-871`) |
| 5 | `can_amend`: docstatus 2, perm amend, not read-only (`:750-752`) | "Amend" | primary; if the doc was already amended it becomes a disabled secondary "Amend" with tooltip "Already amended as {0}" (`:781-805`) |

Permission gate before drawing: `Save->write, Submit->submit, Update->submit, Cancel->cancel, Amend->amend` (`JS/form/form.js:103-112`, `JS/form/toolbar.js:836-845`). Every dirty event re-runs the decision (`:899-911`).

Form menu (`...`) order and conditions, from `make_menu_items` (`JS/form/toolbar.js:364-386`):

| Item | Condition | Cite |
|---|---|---|
| Print | `can_print_doc`; hidden on xl screens | `:489-500` |
| Discard | submittable, docstatus 0, no workflow | `:388-402` |
| Toggle Sidebar | page has a sidebar and `desk_settings.form_sidebar` | `:502-513` |
| Email (Ctrl+E) | `can_email` and docstatus < 2 | `:404-418` |
| Rename | `can_rename` (write perm, `allow_rename`, ...) | `:107-115`, `:477-487` |
| Reload | always | `:515-524` |
| Delete (Shift+Ctrl+D) | docstatus != 1, not local, not single, `can_delete` | `:526-546` |
| Duplicate (Shift+D) | user can create and `!meta.allow_copy` | `:464-475` |
| New {DocType} (Ctrl+B) | create perm, not single, not `in_create` | `:627-643` |
| Request via Web Form | saved doc, write perm, a web form request form exists | `:421-438` |
| divider | | `:361` |
| View Audit Trail | doc has `amended_from` and DocType `track_changes` | `:645-658` |
| Jump to field (Ctrl+J) | always | `:440-450` |
| Show Links | not single | `:452-462` |
| Copy to Clipboard | always | `:575-584` |
| Remind Me (Shift+R) | always | `:548-561` |
| Follow / Unfollow | `track_changes` and user setting `document_follow_notify` | `:563-573` |
| Undo (Ctrl+Z), Redo (Ctrl+Y) | not form builder | `:586-612` |
| Repeat | `can_repeat` (`allow_auto_repeat`, saved, no `auto_repeat`) | `:723-725`, `:614-625` |
| divider | | `:372` |
| Settings, Customize | user can create Custom Field and Property Setter; doctype not core and not single | `:660-692` |
| Edit DocType | can create DocType, developer mode, not the DocType form | `:694-703` |
| Documentation | safe `documentation` URL | `:706-720` |

The whole menu is hidden for new docs (`__islocal`) and when `meta.hide_toolbar` (`:25-45`). Prev/next icons (`chevron-left`/`chevron-right`, titles "Previous Document"/"Next Document") are action icons shown when `desk_settings.form_navigation_buttons` and the doc is saved and not single (`:342-361`). Note the DocType flag named `allow_copy` hides Duplicate when set.

## 8. Workspace page: block JSON shapes

`Workspace.content` is a JSON string holding an Editor.js block array `[{"id": "<10 chars>", "type": "<name>", "data": {...}}]`. Parsed with a fallback to `[]` on error (`JS/views/workspace/workspace.js:26-33`). Block registry: `JS/views/workspace/blocks/index.js:18-29`. `col` is 1-12 (default per block below), mapped to bootstrap classes by `set_col_class` (`JS/views/workspace/blocks/block.js:311-338`): 7-12 gives `col-xs-N`; 5-6 gives `col-xs-12 col-sm-N`; 4 gives `col-xs-12 col-sm-6 col-md-4`; 2-3 gives `col-xs-12 col-sm-6 col-md-4 col-lg-N`; anything else `col-xs-12`.

| `type` | `data` keys | Default `col` | Backing child table (resolved by name) | Cite |
|---|---|---|---|---|
| `header` | `text` (HTML, size via `<span class="h1..h6">` and `<b>`), `col` | 12 | none | `JS/views/workspace/blocks/header.js:11`, `:68-76`, `:119`, `:131`; tune `header_size.js` |
| `paragraph` | `text` (HTML), `col` | 12 | none | `JS/views/workspace/blocks/paragraph.js:28`, `:162-168` |
| `spacer` | `col` | 12 | none | `JS/views/workspace/blocks/spacer.js:16`, `:52-56` |
| `shortcut` | `shortcut_name`, `col` (+ `new` while editing) | 3 | `shortcuts` (Workspace Shortcut) matched by label | `JS/views/workspace/blocks/shortcut.js:16`, `:74-80` |
| `card` | `card_name`, `col` | 4 | `links` rows from the Card Break named `card_name` until the next Card Break | `JS/views/workspace/blocks/card.js:17`, `:55-61` |
| `chart` | `chart_name`, `col` | 12 | `charts` (Workspace Chart, Link to Dashboard Chart) | `JS/views/workspace/blocks/chart.js:16`, `:62-68` |
| `number_card` | `number_card_name`, `col` | 4 | `number_cards` (Workspace Number Card) | `JS/views/workspace/blocks/number_card.js:17`, `:61-67` |
| `onboarding` | `onboarding_name`, `col` | 12 | Module Onboarding | `JS/views/workspace/blocks/onboarding.js:17`, `:129-135` |
| `quick_list` | `quick_list_name`, `col` | 4 | `quick_lists` (Workspace Quick List) | `JS/views/workspace/blocks/quick_list.js:16`, `:56-62` |
| `custom_block` | `custom_block_name`, `col` | 12 | `custom_blocks` (Custom HTML Block) | `JS/views/workspace/blocks/custom_block.js:16`, `:55-61` |

Real example (Build workspace, `frappe/build/workspace/build/build.json` `content`): shortcuts at `col 3`, a `spacer` at 12, `card` blocks at 4.

Workspace doc fields: `label, title, icon, indicator_color (green|cyan|blue|orange|yellow|gray|grey|red|pink|darkgrey|purple|light-blue), public, for_user, parent_page, module, sequence_id, is_hidden, hide_custom, content, type (Workspace|Link|URL), link_type, link_to, external_link, roles[], charts[], shortcuts[], links[], number_cards[], quick_lists[], custom_blocks[], module_onboarding`. Cite `DT/workspace/workspace.json`.

Child shapes (all `DT/<name>/<name>.json`):

| Child | Fields |
|---|---|
| Workspace Shortcut | `type (DocType|Report|Page|Dashboard|URL), link_to, doc_view (|List|Report Builder|Dashboard|Tree|New|Calendar|Kanban|Image), label, icon, stats_filter (JSON), color, format, url, kanban_board, report_ref_doctype` |
| Workspace Link | `type (Link|Card Break), label, icon, hidden, link_type (DocType|Page|Report), link_to, dependencies, only_for, onboard, is_query_report, link_count, description (HTML Editor), report_ref_doctype` |
| Workspace Number Card | `number_card_name, label` |
| Workspace Chart | `chart_name, label` |
| Workspace Quick List | `document_type, label, quick_list_filter (JSON)` |
| Workspace Custom Block | `custom_block_name, label` |

Shortcut widget rules: an `arrow-up-right` icon in `action_area`; for DocType shortcuts that are not `New` and not Single types, a count badge is fetched with `stats_filter`; count 0 shows nothing; label is `format` with `{}` replaced by the count (else the bare count); badge colour map `Grey->gray, Green->green, Red->red, Orange->amber, Pink->violet, Yellow->amber, Blue->blue, Cyan->blue`, default gray. Box is `shortcut-widget-box` with `role=link`. Cite `JS/widgets/shortcut_widget.js:73-133`.

## 9. Sidebar and dock JSON shapes

`Sidebar` doctype (`DT/sidebar/sidebar.json`): `module (Link Module Def), title, header_icon, app, items (Table Sidebar Item), standard, merged_from`. Shipped fixtures live at `<app>/<module>/sidebar/<name>/<name>.json` with `"doctype": "Sidebar"` (example `frappe/automation/sidebar/automation/automation.json`).

`Sidebar Item` fields (`DT/sidebar_item/sidebar_item.json`): `type (Link|Section Break|Spacer), label, link_type (DocType|Page|Report|Workspace|Dashboard|URL), link_to (Dynamic Link), route, icon, child, indent, collapsible, keep_closed, show_arrow, url, filters (JSON), route_options (JSON), navigate_to_tab, open_in_new_tab, is_default_module, hidden, added, key`.

Older `Workspace Sidebar Item` (`DT/workspace_sidebar_item/workspace_sidebar_item.json`) has the same fields minus `route` and `key`, adds type `Sidebar Item Group` and `default_workspace`. `Sidebar Item Group` holds a `sidebar` Link and `links` rows of `report` (`DT/sidebar_item_group/`, `DT/sidebar_item_group_link/`).

Flat to nested: items are a flat list; `nest_section_items` walks it: a `Section Break` becomes the current section; later items with `child = 1` nest under it (`item.parent` set); other items stay top level (`JS/ui/sidebar/sidebar.js:221-240`). This is the plan's `indent` to `children` adapter, except that the flag is `child`, and `indent` means something else (below).

Rendering rules from `JS/ui/sidebar/sidebar_item.html` and `sidebar_item.js`:

| Rule | Cite |
|---|---|
| Container `.sidebar-item-container` (+ `.section-item` for Section Break); inner `.standard-sidebar-item` gets `indent` class when `item.indent` | `sidebar_item.html:1-9` |
| `Section Break` with `indent != 1`: `div.divider.hidden` + `div.item-anchor.section-break > span.sidebar-item-label + div.sidebar-item-control`. A Section Break with `indent = 1` falls through and renders as an ordinary link row | `sidebar_item.html:10-15` |
| `Spacer`: `div.item-anchor` with `pointer-events:none`, empty | `sidebar_item.html:16-19` |
| Link: `a.item-anchor[data-link-type]` with optional `href`/`target=_blank` for URL; `span.sidebar-item-icon[item-icon]` (icon rendered at size `sm`) unless `show_arrow` or hidden; `span.sidebar-item-label`; optional `span.sidebar-item-suffix`; `div.sidebar-item-control` unless `show_arrow` | `sidebar_item.html:20-38` |
| Icon hidden for items nested under an indented section (`child && parent.indent`); default icon `list` if none | `JS/ui/sidebar/sidebar_item.js:177-185` |
| `collapsible`: chevron-down button in the control; `show_arrow`: leading chevron-right button instead of the icon; `keep_closed`: starts collapsed; per-module collapsed state stored in `localStorage["section-breaks-state"]` | `JS/ui/sidebar/sidebar_item.js:296-340`, `:238-247` |
| Suffix: only `{keyboard_shortcut}` is rendered, as `span.keyboard-shortcut` | `JS/ui/sidebar/sidebar_item.js:202-212` |
| An item with no resolvable route and not `standard` is skipped (except Section Break); a Section Break with no nested items is skipped | `JS/ui/sidebar/sidebar_item.js:171-173`, `:236-240` |
| Section expand/collapse on rail collapse | `JS/ui/sidebar/sidebar_item.js:262-294` |

Dock: `Dock` (`app, user, standard, mount_on, items[]`) with `Dock Item` (`link_type (|Sidebar|Workspace|URL), link_to, url, icon, title, added, hidden`) (`DT/dock/dock.json`, `DT/dock_item/dock_item.json`). `Desktop Icon` (`label, link, icon, icon_type (Link|Folder|App), app, link_type (Workspace Sidebar|External), parent_icon, hidden, bg_color (gray|blue), roles[]`) feeds the Desktop screen (`DT/desktop_icon/desktop_icon.json`). The Dock manager treats `link_type == "Sidebar"` rows as module entries (`JS/ui/sidebar/dock_manager.js:164`, `:380-384`, `:455-467`; `JS/ui/sidebar/sidebar.js:11`, `:1013`, `:1083`).

## 10. Views other than list

| View | Facts | Cite |
|---|---|---|
| Kanban engine | Two engines: classic (`KanbanView`) and v2 (`KanbanV2View`, bundle `kanban.bundle.js`), chosen per board by `Kanban Board.use_kanban_v2`; unknown boards use classic. | `JS/list/list_factory.js:21-36`, `:107-122`; `DT/kanban_board/kanban_board.json:19` |
| Kanban board (classic) markup | `.kanban` containing columns plus `.kanban-column.add-new-column` with `+ Add Column` link and hidden form; empty state "Loading..." | `JS/views/kanban/kanban_board.html:1-12` |
| Kanban column | `.kanban-column[data-column-value]` > header (`.kanban-column-title` with `badge(circle icon, theme=indicator)`, `.kanban-title`, `.kanban-column-count.es-badge[data-variant=subtle][data-size=sm]`), options dropdown (`ellipsis` icon; item "Archive"), `.add-card` "+ Add {DocType}", `.new-card-area` textarea, `.kanban-cards` | `JS/views/kanban/kanban_column.html:1-24` |
| Kanban card | `.kanban-card-wrapper[data-name] > .kanban-card.content > .kanban-card-body` with `.kanban-title-area` (header: optional square `lg` avatar from image field, then `a.kanban-card-title-link > .kanban-card-title.ellipsis`; optional `.kanban-card-doc.text-muted` field lines) and `.kanban-card-meta` (tags, comment count with `message-circle`, `.kanban-assignments` avatar group of 3, like). A valid hex `color` adds `.has-color` with `--kanban-card-accent` left border. | `JS/views/kanban/kanban_card.html:1-24`; `JS/views/kanban/kanban_board.bundle.js:1405-1445`, `:1507-1540` |
| Kanban title field | First `title_field`, else first visible Data/Text/Small Text/Text Editor field, else `name`; quick-entry card form if more than one mandatory field or any mandatory table | `JS/views/kanban/kanban_view.js:514-556` |
| Kanban column colours | Column `indicator` values listed in section 6 end; fields on cards come from the board's `fields`/`show_labels` | `JS/views/kanban/kanban_board.bundle.js:1439-1475`, `:1710-1716` |
| Kanban v2 | Card fields show Select values as badges from `SELECT_STYLES` (low gray, medium amber, high/urgent red, draft gray, submitted blue, ...) with icon names | `JS/views/kanban_v2/kanban_page.js:7-33` |
| Calendar | Own toolbar (FullCalendar `headerToolbar:false`): prev, ghost title button with date-jump popover, next, spacer, `Today` button (disabled when range contains today), tab buttons Month/Week/Day (default `dayGridMonth`). Event fields default `start,end,allDay,convert_to_user_tz`. Colour names `danger->red, success->green, warning->orange, default->blue`; families `red green blue orange amber yellow gray purple pink cyan teal violet`; hex colours rendered as `color-mix(in oklab, hex 14%, var(--surface-base))` with text `color-mix(... 55%, var(--ink-gray-9))`. Footnote button "Hide Weekends"/"Show Weekends". `nowIndicator`, 12-hour times. | `JS/views/calendar/calendar.js:118-131`, `:205-262`, `:289-299`, `:318-380`, `:554-625` |
| Gantt | frappe-gantt `^1.1.0`; `bar_height 35`, `bar_corner_radius 4`, `hover_on_date`; default `view_mode` "Day"; mode tab buttons from the library list (frappe-gantt 1.0.3 `defaults.js` names: Hour, Quarter Day, Half Day, Day, Week, Month, Year; the 1.1.0 file was not in the sparse clone, so confirm the list against the bench if exact modes matter); "Today" button `$today_button`; field map defaults `start,end,progress,id,title,color,is_milestone,depends_on`; milestone bars use class `bar-milestone`; progress disabled when no row has progress. | `JS/views/gantt/gantt_view.js:5-60`, `:96-140`, `:190-245`, `:275-285`; `package.json:57` |
| Tree | Toolbar row with an "ID" filter, an "Expand/Collapse" button (items "Expand All", "Collapse All"), "Show all (including disabled)" check; node toolbar buttons: Edit/Details, Add Child (only if `can_create` and node expandable), Move to..., Rename, Delete (dialog primary "Move"). Root is expandable. | `JS/views/treeview.js:156-237`, `:283`, `:389`, `:517-604`, `:655-670` |
| Image view | `.image-view-container` of `.image-view-item.ellipsis` cards: header (checkbox), body (`image-field` or `.placeholder-text`), footer `.image-title`, info list `ul.image-view-info`; zoom view overlay. Page title gets " Images" suffix. | `JS/views/image/image_view.js:17`, `:63-175` |
| Inbox | Email accounts from `frappe.boot.email_accounts`; route `list/communication/inbox/<account>`; columns Subject, From (or To for "Sent"); Spam/Trash accounts filter `email_status`. | `JS/views/inbox/inbox_view.js:7-30`, `:52-75`, `:136-150` |
| Map | Leaflet map in `#<id>.map-view-container` with street, satellite and label tile layers. | `JS/views/map/map_view.js:44-70` |
| Dashboard view | Charts and number cards from user dashboard settings via `WidgetGroup`; page menu items "Customize Dashboard" and "Reset Dashboard Customizations". | `JS/views/dashboard/dashboard_view.js:38-40`, `:152-190` |

## 11. Awesomebar and notifications

| Element | Facts | Cite |
|---|---|---|
| Awesomebar | A modal with input `#navbar-search`, placeholder "Search or type a command", search icon, results as Awesomplete `li > a` with label and optional muted description; footer hints: arrows "to navigate", enter "to select", `⌘K`/`Ctrl+K` "to close", `⌘G`/`Ctrl+G` "to open Global Search". Default entries added for any text: "Search for {text}" (global), "Find {text} in {Doctype}" (when on a list/form route), Calculator result `"{expr} = {result}"`, "Generate Random Password". Typed lookups pull creatables ("New ..."), search-in-list, doctypes, reports, pages, workspaces. | `JS/ui/toolbar/awesome_bar.js:36-66`, `:104-168`, `:280-290`, `:373-500` |
| Notifications panel | Header "Notifications" with settings button (`Notification Settings` form) and "Mark all as read"; segmented tab buttons "All" and "Events" (aria label "Notification categories"); items `a.recent-item.notification-item` (+ read class) with `.message` and `.notification-timestamp.text-muted`; footers "View Full Log" / "See all Activity"; empty state "No New Notifications" / "You have no new notifications"; disabled state "Notifications Disabled"; Events tab groups by day: `.event-date` (month, day), `.event-dot`, `.event-subject`, `.event-time` ("All Day", "Rest of the day"); empty "No Upcoming Events" / "There are no upcoming events for you."; unread badge aria "{0} unread notifications". | `JS/ui/notifications/notifications.js:38-60`, `:93-145`, `:147-176`, `:300-390`, `:425-440`, `:488-580` |

## 12. Fieldtype inventory (for T3 and T-F3)

DocField `fieldtype` options (45, `frappe/core/doctype/docfield/docfield.json`): Autocomplete, Attach, Attach Image, Attachment Gallery, Barcode, Button, Check, Code, Color, Column Break, Currency, Data, Date, Datetime, Duration, Dynamic Link, Float, Fold, Geolocation, Heading, HTML, HTML Editor, Icon, Image, Int, JSON, Link, Long Text, Markdown Editor, Password, Percent, Phone, Read Only, Rating, Section Break, Select, Signature, Small Text, Tab Break, Table, Table MultiSelect, Text, Text Editor, Time, Vue Component.

Kit coverage: 43 of 45. Missing: `Attachment Gallery` (control `JS/form/controls/attachment_gallery.js`, renders a photoswipe gallery of attachments filtered by `link_filters`) and `Vue Component` (control `JS/form/controls/vue_component.js`; no static render is meaningful, so a labelled placeholder box is the sensible mock). Extras in the kit (`Date Range`, `Comment`) are controls, not DocField types.

Value-type test used by list and filters: `html_fieldtypes = [Text Editor, Text, Small Text, Long Text, HTML Editor, Markdown Editor, Code]` (`JS/model/model.js:114-122`); `numeric_fieldtypes = [Int, Float, Currency, Percent, Duration]` (`:142`); `table_fields = [Table, Table MultiSelect]` (`:146`). Standard list fields: `name, owner, idx, creation, modified, modified_by, _user_tags, _liked_by, _assign, docstatus` (`:124-140`).

## 13. List View Settings doctype

`disable_count, disable_sidebar_stats, disable_auto_refresh, fields (JSON), disable_comment_count, allow_edit, disable_automatic_recency_filters, disable_scrolling, show_tags` (`DT/list_view_settings/list_view_settings.json`). `disable_sidebar_stats` has no effect in the current list view because the sidebar no longer exists (section 0, C1).

## 14. Open points

- The Gantt mode list for frappe-gantt 1.1.0 was read from 1.0.3 (the 1.1.0 file was not fetched); everything else above is from the pinned frappe commit.
- Version drift: facts match `version-16` at 16.61.0. If the bench is older (for example a 16.0-16.2 build), the sidebar doctype (`Sidebar` vs `Workspace Sidebar`), the Espresso `es-*` classes, Kanban v2 and the saved-Layouts switcher may not exist there.
- The Workspace `onboarding` block, number card widget colour rules, chart widget types and the Dashboard Chart doctype were not re-derived here; they were outside the list asked for in T0.
