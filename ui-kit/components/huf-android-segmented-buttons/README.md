# Segmented buttons (Appearance / Language)  `huf-android-segmented-buttons`

Segmented buttons (Appearance / Language)

**When to use:** Three-option single choice; selected segment shows a check and the accent tint.

**Slots people usually change:** `a_chk` (html, e.g. "<svg class="ha-ico " viewBox=""), `a` (text, e.g. "System"), `b` (text, e.g. "Light"), `c` (text, e.g. "Dark"). All 9 slots are in `slots.json`.

**States:** default (none), light-selected (props), dark-selected (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-segmented-buttons"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-segmented-buttons --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
