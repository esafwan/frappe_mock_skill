# Attach bottom sheet (Photo library, Files, Camera, project knowledge, Record audio)  `huf-android-attach-sheet`

Attach bottom sheet (Photo library, Files, Camera, project knowledge, Record audio)

**When to use:** Composer + button sheet. Unavailable rows show the dimmed label.

**Slots people usually change:** none. All 1 slots are in `slots.json`.

**States:** default (none), closed (props), open (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-attach-sheet"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-attach-sheet --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
