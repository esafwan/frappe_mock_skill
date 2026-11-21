# URY Captain send bar  `ury-captain-send-bar`

Sticky primary action of the captain order screen: "Total" (14/600) with the amount (18/600) and a full width 48px default button (16px text): Send Order, Update Order, or the in-flight Loader2 state.

**When to use:** Bottom of the captain order screen on mobile (390px).

**Slots people usually change:** `total` (currency, e.g. "AED 78.00"), `button` (text, e.g. "Send Order"), `total_label` (text, e.g. "Total"). All 3 slots are in `slots.json`.

**States:** default (none), update (props), sending (props), loading (props), updating (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-send-bar"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-send-bar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
