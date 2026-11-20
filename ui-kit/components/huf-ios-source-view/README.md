# Artifact source view (monospace)  `huf-ios-source-view`

Monospace source of an artifact, shown by the Show source menu item.

**When to use:** Use inside the artifact detail sheet.

**Slots people usually change:** `source` (text, e.g. "<h1&gt;Receivables</h1&gt;
<p&"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-source-view"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-source-view --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
