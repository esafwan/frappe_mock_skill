# POS user menu  `pos-user-menu`

The open user dropdown: name, email, Close Shift, Switch to Dashboard, Switch To Desk, Clear Cache and Logout.

**When to use:** Shown after clicking the user button in the header.

**Slots people usually change:** `menu_dashboard` (text, e.g. "Switch to Dashboard"), `user_email` (text, e.g. "sinan@example.com"), `menu_desk` (text, e.g. "Switch To Desk"), `user_name` (text, e.g. "Sinan Khalid"), `menu_close_shift` (text, e.g. "Close Shift"), `menu_clear_cache` (text, e.g. "Clear Cache"). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-user-menu"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-user-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
