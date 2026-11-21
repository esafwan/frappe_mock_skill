# POS layout view  `pos-layout-view`

Floor-plan layout of one room (LayoutView): header with the Grid View button, the Room | Layout title and the Edit Layout toggle, the zoom column, the pan/zoom hint and the grid canvas with circle, square and rectangle tables sized by seat count.

**When to use:** Opened from the Layout View button of the Tables route to see or rearrange tables.

**Slots people usually change:** `hint_view` (text, e.g. "Use Scroll to zoom • Drag back"), `hint_drag` (text, e.g. "• Drag tables to reposition"), `p_range` (text, e.g. "Valid range: 1-20 pax"), `p_edit` (text, e.g. "Edit Table Settings"), `hint_save` (text, e.g. "• Changes autosave"), `finish_editing` (text, e.g. "Finish Editing"). All 67 slots are in `slots.json`.

**States:** default (none), edit (props), terrace (props), selected (props), selected-available (props), edit-selected (props), hover-edit (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-layout-view"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-layout-view.edit-toggle`).

**Render:** `node tools/render.mjs pos-layout-view --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
