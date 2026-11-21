# POS dashboard screen  `pos-screen-dashboard`

Full 1440x900 POS Dashboard route: 48px header without the search pill, page header with the Ask pill and Live badge, Act now and Needs attention feeds, KPI strip, Service Line, then the 1fr / 340px grid (Tonight vs Baseline, Running Low | Floor Load, Open Sessions, Shift Brief, Notifications) above the footer navigation.

**When to use:** The Dashboard tab of the POS. The page scrolls inside the content area; this capture is the top of the page.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `k1_value` (currency, e.g. "AED 18,420.00"), `m1_value` (currency, e.g. "AED 18,420.00"), `m1_against` (currency, e.g. "AED 16,450.00"), `k3_value` (currency, e.g. "AED 129.72"), `m3_value` (currency, e.g. "AED 57.92"). All 130 slots are in `slots.json`.

**States:** default (none), scrolled (props), scrolled-dark (props), scrolled-rtl (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-dashboard"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-dashboard.ask`).

**Render:** `node tools/render.mjs pos-screen-dashboard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
