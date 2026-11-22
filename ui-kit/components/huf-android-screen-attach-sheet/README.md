# Attach bottom sheet over the chat  `huf-android-screen-attach-sheet`

Attach bottom sheet over the chat

**When to use:** Full Android screen composed from huf-android components (412x892 dp). Reference: systems/huf-android/ref/attach-sheet.*.png

**Slots people usually change:** `draft` (text, e.g. "Write a message…"). All 1 slots are in `slots.json`.

**States:** default (none), sheet-open (screen). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-screen-attach-sheet"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-screen-attach-sheet --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
