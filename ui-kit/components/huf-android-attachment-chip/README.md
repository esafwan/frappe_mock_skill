# Attachment chip (file name, upload state, remove)  `huf-android-attachment-chip`

Attachment chip (file name, upload state, remove)

**When to use:** Shown above the composer once a file is attached; states uploading / uploaded / failed.

**Slots people usually change:** `name` (text, e.g. "invoice-INV-2041.pdf"). All 3 slots are in `slots.json`.

**States:** default (none), active (props), uploading (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-attachment-chip"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-attachment-chip --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
