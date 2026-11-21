# Self-order search bar  `ury-self-order-search`

Search field: rounded-md border-input bg-background px-3 py-2, 20px magnifier, text-sm input, and an inline clear button once text is entered.

**When to use:** Use above the menu grid. Placeholder is "Search menu...". RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `placeholder` (text, e.g. "Search menu..."), `query` (text, e.g. "Cappuccino"). All 2 slots are in `slots.json`.

**States:** default (none), filled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-search"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-self-order-search --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
