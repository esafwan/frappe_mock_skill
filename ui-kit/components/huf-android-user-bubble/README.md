# User message bubble  `huf-android-user-bubble`

User message bubble

**When to use:** Right-aligned warm bubble (userBubble token).

**Slots people usually change:** `text` (text, e.g. "Send the November promo to my "). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-user-bubble"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-user-bubble --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
