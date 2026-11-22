# Outlined text field (label/placeholder, supporting text, trailing icon, focus/error)  `huf-android-text-field`

Outlined text field (label/placeholder, supporting text, trailing icon, focus/error)

**When to use:** Material 3 outlined field. state: "" | "focus" | "err" | "floated" | "floated focus".

**Slots people usually change:** `support` (text, e.g. "Example: https://your-workspac"), `label` (text, e.g. "Server"). All 5 slots are in `slots.json`.

**States:** default (none), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-text-field"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-text-field --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
