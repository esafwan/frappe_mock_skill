# Sidebar and workspace shortcuts  `sidebar`

Left workspace sidebar: app switcher, search, notifications, workspace links and shortcuts.

**When to use:** Use as the persistent left rail for every desk page.

**Slots people usually change:** `message_4` (relative-time, e.g. "Today's sales plan is locked f"), `frappe_timestamp` (relative-time, e.g. "3 months ago"), `message_2` (text, e.g. "Draft sales plan for 2026-10-2"), `message_5` (text, e.g. "Stock count correction posted "), `message_6` (text, e.g. "Daily P&L for 2026-10-21 has b"), `message_3` (text, e.g. "Yield below standard on a prep"). All 149 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="sidebar"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `sidebar.link-1`, `sidebar.button-2`, `sidebar.link-3`).

**Render:** `node tools/render.mjs sidebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
