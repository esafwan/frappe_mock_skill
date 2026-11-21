# POS open sessions screen  `pos-screen-open-entries`

Open Sessions page (OpenEntries) inside the POS shell: gray-50 page, max-w 1152 content, 24/600 title and a white card with a User / Session Start / POS Profile table.

**When to use:** Reached from the Sessions tab to see every open POS Opening Entry for the profile.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `error_load` (text, e.g. "Failed to load open sessions"), `no_sessions` (text, e.g. "No open sessions right now"), `d1` (text, e.g. "Nov 21, 2026, 09:30 AM"), `d2` (text, e.g. "Nov 21, 2026, 10:05 AM"), `d3` (text, e.g. "Nov 21, 2026, 11:15 AM"). All 28 slots are in `slots.json`.

**States:** default (none), empty (props), error (props), loading (props), row-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-open-entries"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-footer-nav.dashboard`).

**Render:** `node tools/render.mjs pos-screen-open-entries --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-misc.css from `tokens/css/` and the desk icon sprite (inlined in preview).
