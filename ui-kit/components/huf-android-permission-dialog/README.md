# Android permission dialog (Allow HUF to record audio?)  `huf-android-permission-dialog`

Android permission dialog (Allow HUF to record audio?)

**When to use:** System dialog shown on first microphone use.

**Slots people usually change:** `question` (text, e.g. "HUF"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-permission-dialog"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-permission-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
