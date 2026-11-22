# Chat overflow menu (Artifacts, Rename, Fork, Delete, Move to project, switch agent)  `huf-android-overflow-menu`

Chat overflow menu (Artifacts, Rename, Fork, Delete, Move to project, switch agent)

**When to use:** Dropdown anchored under the app bar overflow button.

**Slots people usually change:** `agent` (text, e.g. "Finance Reviewer"). All 2 slots are in `slots.json`.

**States:** default (none), closed (props), open (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-overflow-menu"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-overflow-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
