# Assistant message text (no bubble)  `huf-android-assistant-text`

Assistant message text (no bubble)

**When to use:** Plain body text on the canvas.

**Slots people usually change:** `text` (text, e.g. "I can send the promo_nov Whats"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-assistant-text"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-assistant-text --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
