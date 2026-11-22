# Composer with a file attached (upload row, Send enabled)  `huf-android-screen-composer-attachment`

Composer with a file attached (upload row, Send enabled)

**When to use:** Full Android screen composed from huf-android components (412x892 dp). Authored from the Compose source; no emulator reference.

**Slots people usually change:** `draft` (text, e.g. "Summarise this invoice"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-screen-composer-attachment"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-screen-composer-attachment --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
