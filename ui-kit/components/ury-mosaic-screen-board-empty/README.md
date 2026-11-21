# Mosaic Screen: KOT Board Empty  `ury-mosaic-screen-board-empty`

mosaic KOT board with no tickets.

**When to use:** The unit has no active KOTs in the time window. Modes: light and rtl only; dark is not applicable (mosaic defines one light palette).

**Slots people usually change:** `empty_msg` (text, e.g. "No active orders for Kitchen"), `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"), `user_email` (text, e.g. "sara@example.com"), `c_1` (text, e.g. "Gulf Hospitality"). All 18 slots are in `slots.json`.

**States:** default (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-screen-board-empty"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-header-refresh`, `ury-mosaic-header-user`).

**Render:** `node tools/render.mjs ury-mosaic-screen-board-empty --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css, ury-v16/components/mosaic-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
