# Workspace shortcut widgets  `workspace-shortcuts`

Workspace page body with shortcut and link cards.

**When to use:** Use when showing a module landing page (Selling, Stock …).

**Slots people usually change:** `number_3` (currency, e.g. "₹ 0.00"), `max_w_sm` (text, e.g. "Sales orders still waiting to "), `link_text_27` (text, e.g. "Sales Partner Target Variance "), `link_text_25` (text, e.g. "Sales Person Target Variance B"), `link_text_26` (text, e.g. "Territory Target Variance Base"), `link_text_16` (text, e.g. "Customers Without Any Sales Tr"). All 118 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="workspace-shortcuts"`; 44 interactive elements with measured boxes in `measurements.json` (e.g. `workspace-shortcuts.button-1`, `workspace-shortcuts.div-7`, `workspace-shortcuts.link-8`).

**Render:** `node tools/render.mjs workspace-shortcuts --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
