# Empty state (icon, title, helper)  `huf-android-empty-state`

Empty state (icon, title, helper)

**When to use:** No projects / no scheduled automations / No messages yet.

**Slots people usually change:** `text` (text, e.g. "No messages yet."). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-empty-state"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-empty-state --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
