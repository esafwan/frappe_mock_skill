# Screen: You tab, account and settings  `huf-ios-screen-you`

Full iPhone screen: You tab, account and settings

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/you.light.png.

**Slots people usually change:** `footnote` (text, e.g. "Password sign-ins are ended on"), `computers` (text, e.g. "Remote computers"), `host` (text, e.g. "preview.invalid"), `appearance` (text, e.g. "Appearance"), `add` (text, e.g. "Add server"), `sec1` (text, e.g. "Workspace"). All 22 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-you"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-tab-bar.chat`, `huf-ios-tab-bar.projects`, `huf-ios-tab-bar.agents`).

**Render:** `node tools/render.mjs huf-ios-screen-you --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
