# Chat composer: attach, message pill, mic / send / stop  `huf-ios-composer`

Bottom composer bar of a chat thread (safe area included).

**When to use:** Use under every thread; switch states with the variants.

**Slots people usually change:** `draft` (text, e.g. "Summarize the overdue invoices"), `placeholder_disabled` (text, e.g. "Choose an agent to chat"), `placeholder` (text, e.g. "Message"). All 3 slots are in `slots.json`.

**States:** default (none), active (props), draft (props), busy (props), loading (props), whitespace (props), disabled (props), no-files (props), error (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-composer"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-composer.attach`).

**Render:** `node tools/render.mjs huf-ios-composer --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
