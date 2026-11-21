# POS spotlight search  `pos-spotlight`

Command palette dialog (Ctrl+K): search input, results grouped under Menu / Orders / Customers headings with 48px thumbnails, and a keyboard hint.

**When to use:** The source marks Spotlight as not currently used and draws menu rows only; the section headings and the order and customer rows come from the task spec. The Customers label is an author translation in RTL.

**Slots people usually change:** `sp_i2_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `sp_i1_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `sp_i3_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `sp_i1_price` (currency, e.g. "AED 22.00"), `sp_i2_price` (currency, e.g. "AED 24.00"), `sp_i3_price` (currency, e.g. "AED 24.00"). All 25 slots are in `slots.json`.

**States:** default (none), second-selected (props), query (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-spotlight"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-spotlight --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
