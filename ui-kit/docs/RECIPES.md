# Recipes

Thirty ready specs for `mock-spec/1` (`docs/SPEC.md`). Each lives in `docs/recipes/<id>.json`. Run from `ui-kit/`:

```
node bin/mock.mjs render docs/recipes/<id>.json --out out/recipes/<id>.html
node doctype/shot-doctype.mjs out/recipes/<id>.html out/recipes/<id>.png
```

The line under each title says what the picture shows. All thirty render (`bash tests/determinism-all.sh` covers `samples/`; render the recipes the same way into `out/recipes/`). The kanban, calendar and gantt recipes use the slice-5 renderers; their data keys are checked against the renderer code: kanban reads `meta.kanban_board` (or `meta.kanban`) for `name`, `field_name` and `columns`, and `data.cards` (or `data.rows` with `field_name` / `title_field`); calendar reads `meta.calendar_view` (`start_date_field`, `end_date_field`, `subject_field`) and `data.rows`, falling back to `data.events`.

To adapt one: change `meta.doctype` (name, path or inline Frappe JSON), the `data`, and the overlays. Never add layout; add metadata or overlays.

## 1. Plain form, new document

`docs/recipes/form-basic.json`

What you see: A saved form titled ODD-0001 with a Draft pill, Save primary button, two columns (Title, Status), an Items grid with two rows and the Note field.

## 2. Unsaved new form

`docs/recipes/form-new.json`

What you see: Same layout with a "Not Saved" indicator, empty fields and no timeline.

## 3. Submitted document (read-only)

`docs/recipes/form-submitted.json`

What you see: All fields read-only, a Submitted pill and a Cancel action instead of Save.

## 4. Cancelled document

`docs/recipes/form-cancelled.json`

What you see: Read-only fields with a red Cancelled pill and the Amend action.

## 5. Custom buttons and group

`docs/recipes/form-custom-buttons.json`

What you see: Page head with a "Create" dropdown group (Payment Entry, Delivery Note) and a standalone secondary "Send Reminder" button.

## 6. Open custom button group

`docs/recipes/form-button-group-open.json`

What you see: The "Create" dropdown open, showing its two entries under the button.

## 7. Form with intro banner

`docs/recipes/form-intro.json`

What you see: A blue intro line under the page head: "Items are locked once the order ships."

## 8. Page "..." menu open

`docs/recipes/form-page-menu.json`

What you see: The head menu open with Print, Email, Duplicate and Delete (danger) items.

## 9. Link field dropdown

`docs/recipes/form-link-open.json`

What you see: The Customer link on a Sales Invoice open for query "ac" with three results, "Create a new Customer" and "Advanced Search".

## 10. Mandatory error and read-only field

`docs/recipes/form-field-errors.json`

What you see: Title outlined red with "Value missing" and the Note field greyed read-only.

## 11. Child table row form open

`docs/recipes/form-child-row.json`

What you see: The first Items row expanded into its row form with Item, Qty, Rate and Amount fields over a dimmed page.

## 12. Field focus and disabled button

`docs/recipes/form-field-focus.json`

What you see: The Title field in its focus ring and the primary action drawn disabled.

## 13. Share dialog over a form

`docs/recipes/form-dialog-share.json`

What you see: A Share dialog listing Maria Garcia with read and write ticks over the dimmed form.

## 14. Custom dialog with fields

`docs/recipes/form-dialog-fields.json`

What you see: A large "Update Items" dialog with Section, Column Break, Link, Date, Float, Check fields and a Cancel/Update footer.

## 15. Confirm dialog with toast

`docs/recipes/form-confirm-toast.json`

What you see: A small "Delete this document?" confirm dialog and a green "Saved" toast at the bottom.

## 16. List with 5 columns

`docs/recipes/list-basic.json`

What you see: A Customer list with ten generated rows, subject column first, status indicators, "10 of 1,284" count and paging.

## 17. Wide list, 12 columns

`docs/recipes/list-12-cols.json`

What you see: A 12-column list that fits the width with no horizontal overflow; the ID column stays first.

## 18. List with filter chips

`docs/recipes/list-filters.json`

What you see: Two filter chips (status = Paid, territory in two values) under the standard filters and a reduced count.

## 19. List with selected rows and Actions menu

`docs/recipes/list-bulk.json`

What you see: Rows 1, 3, 4 checked, "3 selected" bar and the Actions menu open with Edit, Assign To, Delete.

## 20. Empty list

`docs/recipes/list-empty.json`

What you see: The empty state illustration with "You haven't created a Customer yet" and a primary Create button.

## 21. List row hover and sort menu

`docs/recipes/list-row-hover.json`

What you see: Row 3 in hover state and the sort selector open.

## 22. List group-by dropdown

`docs/recipes/list-groupby.json`

What you see: The Group By dropdown open with counts per value.

## 23. Report view with group-by

`docs/recipes/report-view.json`

What you see: A report-view datatable of generated rows grouped by status with group headers.

## 24. Script report with filters and total row

`docs/recipes/query-report.json`

What you see: A report with Company, From Date, To Date and Status filters, a datatable and a Total row.

## 25. Workspace with header, shortcuts, number card and chart

`docs/recipes/workspace-blocks.json`

What you see: A workspace page with a header, three shortcut tiles, a number card and a line chart in the grid.

## 26. Workspace menu open

`docs/recipes/workspace-menu.json`

What you see: The workspace "..." menu open under the page head.

## 27. Dashboard of charts and number cards

`docs/recipes/dashboard.json`

What you see: A dashboard grid with number cards on top and Line, Donut and Axis-Mixed charts below.

## 28. Kanban board

`docs/recipes/kanban.json`

What you see: Columns Open, In Progress, Done with five fixed cards carrying a title, a Territory field, assignee avatars, tags, a comment count and an indicator pill (`data.cards`).

## 29. Calendar month view

`docs/recipes/calendar.json`

What you see: A month grid for the ctx.today month with coloured event bars from data.events.

## 30. Gantt view

`docs/recipes/gantt.json`

What you see: Task bars along a day axis with a today line at 27 Nov.

