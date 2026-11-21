# Mosaic Screen: KOT Board  `ury-mosaic-screen-board`

mosaic KOT board for one production unit, masonry result pre-computed statically as 4 columns of 256+24 cards.

**When to use:** Opened from a production card. masonry-layout positions are computed in JS in the source; this mock fixes the column pitch at 284px (282px card + 2px). Arabic item and waiter names are sample translations. Modes: light and rtl only; dark is not applicable (mosaic defines one light palette).

**Slots people usually change:** `dup_note` (text, e.g. "Duplicate KOT ( CHECK WITH CAP"), `disp_done` (text, e.g. "Disposition: Returned to Stock"), `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"), `type_label_8` (text, e.g. "Partially cancelled"). All 131 slots are in `slots.json`.

**States:** default (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-screen-board"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-header-refresh`, `ury-mosaic-header-user`).

**Render:** `node tools/render.mjs ury-mosaic-screen-board --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css, ury-v16/components/mosaic-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
