# POS table card (v16)  `pos-table-card-v16`

Table card of the POS Tables grid (TableCard): shape icon, name, status badge, actions trigger, room, started-at and seats rows, reservation strip and the Preview / Print footer, min-height 248 with a 2px state border.

**When to use:** One card per table in the Tables route; green when available, amber when occupied, primary blue when held by a reservation lock.

**Slots people usually change:** `res_for` (text, e.g. "Reserved for 7:30 PM"), `m_captain` (text, e.g. "Transfer captain"), `m_unmerge` (text, e.g. "Unmerge tables"), `m_transfer` (text, e.g. "Transfer table"), `merge_label` (text, e.g. "With T6 + T7"), `m_merge` (text, e.g. "Merge tables"). All 53 slots are in `slots.json`.

**States:** default (none), occupied (props), reserved (props), occupied-reserved (props), take-away (props), merged (props), shape-circle (props), shape-square (props), shape-rectangle (props), menu-available (props), menu-occupied (props), printing (props), hover-available (props), hover-reserved (props), hover-footer-button (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-table-card-v16"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-table-card-v16 --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
