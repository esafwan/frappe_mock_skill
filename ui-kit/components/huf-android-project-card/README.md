# Project card (name, description) and projects empty state  `huf-android-project-card`

Project card (name, description) and projects empty state

**When to use:** Projects tab list item.

**Slots people usually change:** `description` (text, e.g. "Ageing, reminders and collecti"), `name` (text, e.g. "Receivables"). All 3 slots are in `slots.json`.

**States:** default (none), active (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-project-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-project-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
