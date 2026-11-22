# Switch agent bottom sheet  `huf-android-agent-switcher-sheet`

Switch agent bottom sheet

**When to use:** Modal sheet listing agents; the current one shows a check.

**Slots people usually change:** `current` (text, e.g. "Finance Reviewer"). All 2 slots are in `slots.json`.

**States:** default (none), closed (props), open (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-agent-switcher-sheet"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-agent-switcher-sheet --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
