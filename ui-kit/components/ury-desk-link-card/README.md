# URY desk link card  `ury-desk-link-card`

Workspace link card: .widget.links-widget-box with a 13px medium title and one 13px ink-gray-6 row per Link (Card Break from the workspace JSON).

**When to use:** Use for grouped navigation on a workspace such as Operate (col-4).

**Slots people usually change:** `lk_tx` (text, e.g. "Terminal Transactions"), `lk_title1` (text, e.g. "Kitchen and Billing"), `lk_term` (text, e.g. "Payment Terminals"), `lk_subpos` (text, e.g. "Sub POS Closing"), `lk_kot` (text, e.g. "Kitchen Orders"). All 5 slots are in `slots.json`.

**States:** default (none), hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-link-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-desk-link-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
