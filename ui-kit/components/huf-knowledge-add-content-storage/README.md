# Add content dialog, Connect storage picker (Amazon S3 / Cloudflare R2, SFTP server, Server folder)  `huf-knowledge-add-content-storage`

Add content dialog on Connect storage: three option cards for bulk import from Amazon S3 / Cloudflare R2, an SFTP server or a server folder.

**When to use:** Use to show bulk import of a whole document store.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Add documents so your agents c"), `text_steel_2` (text, e.g. "Import files from a server you"), `text_steel` (text, e.g. "Import everything under a buck"), `text_steel_3` (text, e.g. "Import from a folder on this s"), `tracking_tight_2` (text, e.g. "to "Northwind Support Handbook"), `font_medium` (text, e.g. "Amazon S3 / Cloudflare R2"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-add-content-storage"`; 13 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-add-content-storage.div-1`, `huf-knowledge-add-content-storage.button-2`, `huf-knowledge-add-content-storage.button-3`).

**Render:** `node tools/render.mjs huf-knowledge-add-content-storage --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
