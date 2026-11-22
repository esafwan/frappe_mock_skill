# Computer (desktop host) row: status, detail, last seen, permission mode  `huf-ios-computer-row`

Row of Remote computers.

**When to use:** Use in the computers list.

**Slots people usually change:** `last_seen` (text, e.g. "Last seen: Oct 29, 2026 at 12:"), `detail` (text, e.g. "Remote control enabled"), `mode` (text, e.g. "Full access"), `name` (text, e.g. "Office Mac"), `status_offline` (text, e.g. "OFFLINE"), `status_online` (text, e.g. "ONLINE"). All 6 slots are in `slots.json`.

**States:** default (none), offline (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-computer-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-computer-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
