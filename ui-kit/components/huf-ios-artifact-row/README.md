# Artifact list row: type icon, title, mono type label  `huf-ios-artifact-row`

Row of the Artifacts sheet.

**When to use:** Use one per artifact of the conversation; pick the kind with the variant.

**Slots people usually change:** `title` (text, e.g. "Receivables dashboard"), `type` (text, e.g. "html"). All 2 slots are in `slots.json`.

**States:** default (none), active (props), mermaid (props), chart (props), markdown (props), loading (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-artifact-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-artifact-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
