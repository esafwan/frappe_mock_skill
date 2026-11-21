# POS tables legend  `pos-tables-legend`

Status legend bar of the Tables route: Available, Occupied, Merged and Reserved with 16px swatches in colours that match the cards.

**When to use:** Pinned 72px above the footer navigation; the Reserved entry appears only when the branch enables reservations.

**Slots people usually change:** `b_available` (text, e.g. "Available"), `b_occupied` (text, e.g. "Occupied"), `b_reserved` (text, e.g. "Reserved"), `b_merged` (text, e.g. "Merged"). All 4 slots are in `slots.json`.

**States:** default (none), no-reservations (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-tables-legend"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-tables-legend --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-tables.css from `tokens/css/` and the desk icon sprite (inlined in preview).
