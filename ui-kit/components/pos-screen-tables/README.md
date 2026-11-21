# POS screen: tables grid  `pos-screen-tables`

The Tables route at 1440x900: POS header, room tabs with occupied counts and the Layout View button, the gray-50 grid of five columns with a merged T6 + T7 group, the status legend and the footer navigation.

**When to use:** Default landing of the Tables tab in the POS for waiters and cashiers.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `search_placeholder` (text, e.g. "Search orders, menu items, or "), `res_for` (text, e.g. "Reserved for 7:30 PM"), `m_captain` (text, e.g. "Transfer captain"), `m_unmerge` (text, e.g. "Unmerge tables"), `m_transfer` (text, e.g. "Transfer table"). All 69 slots are in `slots.json`.

**States:** default (none), no-reservations (props), menu-open (props), hover-card (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-tables"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-tables.footer.dashboard`).

**Render:** `node tools/render.mjs pos-screen-tables --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
