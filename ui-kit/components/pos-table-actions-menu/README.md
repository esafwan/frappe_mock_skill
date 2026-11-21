# POS table actions menu  `pos-table-actions-menu`

Table actions popover (TableActionsMenu): w-48 card under the three-dot trigger with Merge tables, Transfer table, Transfer captain, plus Reserve and Unmerge tables when they apply.

**When to use:** Opened from the more button of a table card; occupied tables get transfer actions, available tables get Reserve and, when merged, Unmerge.

**Slots people usually change:** `m_captain` (text, e.g. "Transfer captain"), `m_unmerge` (text, e.g. "Unmerge tables"), `m_transfer` (text, e.g. "Transfer table"), `m_merge` (text, e.g. "Merge tables"), `m_reserve` (text, e.g. "Reserve"). All 5 slots are in `slots.json`.

**States:** default (none), available (props), available-merged (props), no-captain (props), hover-item (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-table-actions-menu"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-table-actions-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
