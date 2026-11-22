# iOS device shell: status bar (9:41, signal, Wi-Fi, charging battery), Dynamic Island, home indicator, 402x874 pt  `huf-ios-device-shell`

iPhone 17 Pro frame at 402x874 pt: status bar, Dynamic Island and home indicator. Every huf-ios-screen-* is built on it.

**When to use:** Use as the base when composing a custom iOS screen; put content in the .hi-body layer.

**Slots people usually change:** `time` (text, e.g. "9:41"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-device-shell"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-device-shell --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
