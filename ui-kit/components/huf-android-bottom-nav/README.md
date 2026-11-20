# Bottom navigation (Chat / Projects / Agents / Account / Automations)  `huf-android-bottom-nav`

Bottom navigation (Chat / Projects / Agents / Account / Automations)

**When to use:** Five tabs. Mark the active tab by passing "on" to the matching *_on slot.

**Slots people usually change:** none. All 5 slots are in `slots.json`.

**States:** default (none), agents-pressed (props), chat-active (props), projects-active (props), agents-active (props), account-active (props), automations-active (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-bottom-nav"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-bottom-nav --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
