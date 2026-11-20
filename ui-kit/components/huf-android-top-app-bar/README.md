# Top app bar (menu, title, subtitle, optional project line, overflow)  `huf-android-top-app-bar`

Top app bar (menu, title, subtitle, optional project line, overflow)

**When to use:** Chat header. variant "two" (title+subtitle) or "three" (adds the teal "Project: …" line).

**Slots people usually change:** `subtitle` (text, e.g. "Start a conversation"), `title` (text, e.g. "New conversation"). All 4 slots are in `slots.json`.

**States:** default (none), with-project (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-top-app-bar"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-top-app-bar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
