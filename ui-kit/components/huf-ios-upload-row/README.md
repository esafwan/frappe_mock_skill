# Composer attachment row: uploading progress / upload failed  `huf-ios-upload-row`

Composer attachment row: uploading progress / upload failed

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `error` (text, e.g. "Upload failed — file over 25 M"), `filename` (text, e.g. "invoice.pdf"). All 2 slots are in `slots.json`.

**States:** default (none), failed (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-upload-row"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-upload-row.remove`).

**Render:** `node tools/render.mjs huf-ios-upload-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
