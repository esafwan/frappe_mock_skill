# Upload row (file icon, filename, status, progress bar, remove) above the composer  `huf-android-upload-row`

Upload row (file icon, filename, status, progress bar, remove) above the composer

**When to use:** Compose UploadRow: mono filename + mono status line, 2 dp accent progress while uploading. state: "uploading" | "queued" | "uploaded" | "failed" (red icon/text, no bar).

**Slots people usually change:** `progress` (html, e.g. "<i class="bar"><b style="width"), `filename` (text, e.g. "invoice-INV-2041.pdf"), `detail` (text, e.g. "Uploading…"). All 4 slots are in `slots.json`.

**States:** default (none), queued (props), uploaded (props), failed (props), error (props), half-done (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-upload-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-upload-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
