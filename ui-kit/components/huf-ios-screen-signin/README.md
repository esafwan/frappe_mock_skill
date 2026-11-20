# Screen: connection step 1, server URL  `huf-ios-screen-signin`

Screen: connection step 1, server URL

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `hint` (text, e.g. "The address you open Huf at. U"), `heading` (text, e.g. "Connect to your workspace."), `server_placeholder` (text, e.g. "huf.yourcompany.com"), `cta` (text, e.g. "Continue"), `advanced` (text, e.g. "Advanced"), `server_label` (text, e.g. "Server"). All 6 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-signin"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-screen-signin --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
