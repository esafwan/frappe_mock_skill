# URY Captain menu pane  `ury-captain-menu-pane`

Touch menu browser of the captain order screen: sticky search (16px text), category chips (selected = blue-600), 2-column MenuCard grid (gap 12) with availability tags. Each card is a 240px high menu-item card (96px photo).

**When to use:** Captain order screen, Menu tab. Browse-only variant: the captain may look but not add items, so an amber note shows and the cards are disabled. Item names, prices and photos bind to data/menus via bindings.json (--menu).

**Slots people usually change:** `image_4` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_2` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_3` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_1` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `price_1` (currency, e.g. "AED 22.00"), `price_2` (currency, e.g. "AED 24.00"). All 27 slots are in `slots.json`.

**States:** default (none), untagged (props), browse-only (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-menu-pane"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-menu-pane --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
