# Chat thread fixture: user prompt, pending + sending approval cards, receivables table  `huf-android-screen-dashboard`

Chat thread fixture: user prompt, pending + sending approval cards, receivables table

**When to use:** Full Android screen composed from huf-android components (412x892 dp). Reference: systems/huf-android/ref/dashboard.*.png

**Slots people usually change:** none. All 0 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-screen-dashboard"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-screen-dashboard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
