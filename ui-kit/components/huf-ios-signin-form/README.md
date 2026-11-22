# Sign-in step 1: huf brand mark, server URL, Continue, Advanced  `huf-ios-signin-form`

Connection screen content.

**When to use:** Use first when showing onboarding.

**Slots people usually change:** `hint` (text, e.g. "The address you open Huf at. U"), `heading` (text, e.g. "Connect to your workspace."), `server_placeholder` (text, e.g. "huf.yourcompany.com"), `server_value` (text, e.g. "huf.example.com"), `cta` (text, e.g. "Continue"), `advanced` (text, e.g. "Advanced"). All 7 slots are in `slots.json`.

**States:** default (none), active (props), filled (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-signin-form"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-signin-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
