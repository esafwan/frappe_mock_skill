# Sign-in step 2: Password / API key segmented form  `huf-ios-login-form`

Sign-in step 2: Password / API key segmented form

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `help_key` (text, e.g. "For service accounts or script"), `help_password` (text, e.g. "Use the username or email and "), `p2_key` (text, e.g. "15-character secret"), `l1_password` (text, e.g. "Username or email"), `p1_password` (text, e.g. "name@company.com"), `p1_key` (text, e.g. "15-character key"). All 15 slots are in `slots.json`.

**States:** default (none), api-key (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-login-form"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-login-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
