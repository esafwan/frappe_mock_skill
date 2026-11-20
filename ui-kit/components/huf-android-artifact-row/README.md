# Artifact browser row (kind icon, title, kind, chevron arrow)  `huf-android-artifact-row`

Artifact browser row (kind icon, title, kind, chevron arrow)

**When to use:** Row of the Artifacts list. icon: chart | markdown | html.

**Slots people usually change:** `icon` (html, e.g. "<svg class="ha-ico " viewBox=""), `name` (text, e.g. "Ageing by bucket"), `kind` (text, e.g. "chart"). All 4 slots are in `slots.json`.

**States:** default (none), active (props), pressed (props), markdown (props), html (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-artifact-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-artifact-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
