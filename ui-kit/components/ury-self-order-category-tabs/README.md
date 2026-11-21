# Self-order category tabs  `ury-self-order-category-tabs`

Sticky horizontal category chip row (nav, bg-background/95, px-6 py-3, backdrop blur) with a leading "All" chip; rounded-full chips px-4 py-2 text-sm font-medium, active bg-primary, inactive border bg-background.

**When to use:** Use at the top of every self-order menu (tablet, kiosks, mobile). Rendered at 390 wide; it scrolls horizontally in the app so the last chips are clipped. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `cat_3` (text, e.g. "Filter & Cold Brew"), `cat_5` (text, e.g. "Tea & Others"), `cat_2` (text, e.g. "Milk Coffee"), `cat_1` (text, e.g. "Espresso"), `cat_4` (text, e.g. "Iced"), `all` (text, e.g. "All"). All 6 slots are in `slots.json`.

**States:** default (none), all-active (props), category-active (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-category-tabs"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-category-tabs.all`, `ury-self-order-category-tabs.chip-1`, `ury-self-order-category-tabs.chip-2`).

**Render:** `node tools/render.mjs ury-self-order-category-tabs --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
