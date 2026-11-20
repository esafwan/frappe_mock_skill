# Screen: Remote computers list  `huf-ios-screen-computers`

Screen: Remote computers list

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `last_seen` (text, e.g. "Last seen: Oct 29, 2026 at 12:"), `detail` (text, e.g. "Remote control enabled"), `title` (text, e.g. "Remote computers"), `mode` (text, e.g. "Full access"), `name` (text, e.g. "Office Mac"), `status_offline` (text, e.g. "OFFLINE"). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-computers"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-screen-computers --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
