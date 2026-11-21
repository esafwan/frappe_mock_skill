# Self-order option row  `ury-self-order-option-row`

Variant or add-on option row from the product detail: flex justify-between rounded-lg border px-4 py-3; selected = border-primary bg-primary/10; rate in muted text, an em dash when the rate is null.

**When to use:** Use in the product detail screen under a "Variants" / "Add-ons" heading. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `o1_rate` (currency, e.g. "AED 12.00"), `o2_rate` (currency, e.g. "AED 16.00"), `o3_rate` (currency, e.g. "AED 18.00"), `label` (text, e.g. "Variants"), `o1_name` (text, e.g. "Espresso"), `o3_name` (text, e.g. "Cortado"). All 7 slots are in `slots.json`.

**States:** default (none), none-selected (props), multi-selected (props), no-rate (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-option-row"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-option-row.row-1`, `ury-self-order-option-row.row-2`, `ury-self-order-option-row.row-3`).

**Render:** `node tools/render.mjs ury-self-order-option-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
