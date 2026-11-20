# Account list: profile, workspace, app and server rows, sign out  `huf-ios-account-rows`

Grouped settings rows of the You tab.

**When to use:** Use for account scenes.

**Slots people usually change:** `footnote` (text, e.g. "Password sign-ins are ended on"), `computers` (text, e.g. "Remote computers"), `host` (text, e.g. "preview.invalid"), `appearance` (text, e.g. "Appearance"), `add` (text, e.g. "Add server"), `sec1` (text, e.g. "Workspace"). All 17 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-account-rows"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-account-rows --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
