# URY desk shortcut  `ury-desk-shortcut`

Workspace shortcut: .widget.shortcut-widget-box, 60px high, padding 10 12, 1px border, 16px title.

**When to use:** Use for a link to a list, report or page in a workspace column (col-3 on URY Home).

**Slots people usually change:** `sc_kitchen` (text, e.g. "Kitchen Orders"). All 1 slots are in `slots.json`.

**States:** default (none), hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-shortcut"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-desk-shortcut --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
