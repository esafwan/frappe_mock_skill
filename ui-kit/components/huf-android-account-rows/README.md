# Account rows (server value, saved server with confirm/remove, Add another server, Remote computers)  `huf-android-account-rows`

Account rows (server value, saved server with confirm/remove, Add another server, Remote computers)

**When to use:** Account tab content block.

**Slots people usually change:** `server` (text, e.g. "https://acme.example.com"), `saved_url` (text, e.g. "https://acme.example.com"), `saved_name` (text, e.g. "maya@example.com"). All 3 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-account-rows"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-account-rows --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
