# POS screen: tables layout  `pos-screen-tables-layout`

The Layout View of the Tables route at 1440x900 under the POS header and footer: header controls, zoom column, hint and the table floor plan.

**When to use:** Shown after pressing Layout View; used to read table status at a glance or edit the room layout.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `hint_view` (text, e.g. "Use Scroll to zoom • Drag back"), `search_placeholder` (text, e.g. "Search orders, menu items, or "), `hint_drag` (text, e.g. "• Drag tables to reposition"), `p_range` (text, e.g. "Valid range: 1-20 pax"), `p_edit` (text, e.g. "Edit Table Settings"). All 79 slots are in `slots.json`.

**States:** default (none), edit (props), selected (props), edit-selected (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-tables-layout"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-tables-layout.view.edit-toggle`).

**Render:** `node tools/render.mjs pos-screen-tables-layout --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
