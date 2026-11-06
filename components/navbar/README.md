# Navbar and search bar  `navbar`

Top bar of the desk home: logo, global search (Ctrl/⌘K), notifications bell, avatar.

**When to use:** Use on desk landing / app-launcher scenes and any shot that needs the global search bar.

**Slots people usually change:** `search_widget_icon` (text, e.g. "Search"), `search_widget_shortcut` (text, e.g. "⌘K"). All 12 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="navbar"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `navbar.logo`, `navbar.search`, `navbar.button-2`).

**Render:** `node tools/render.mjs navbar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
