# URY desk dock  `ury-desk-dock`

URY app dock: 57px pinned column with the URY mark in a 49px band, Search and Notification utilities, the two URY dock tiles (URY, Analytics) in 34px r8 tiles with 22px icons, and the 28px user avatar at the foot.

**When to use:** Use beside the sidebar on every URY desk page; the tiles are the apps in ury/dock/ury/ury.json. Icons are the lucide glyphs named in that file (it names no soft module icon).

**Slots people usually change:** `nav_user_name` (text, e.g. "Administrator"), `nav_notification` (text, e.g. "Notification"), `nav_dock_analytics` (text, e.g. "Analytics"), `nav_dock_all_apps` (text, e.g. "All apps"), `nav_search` (text, e.g. "Search"), `nav_title` (text, e.g. "URY"). All 7 slots are in `slots.json`.

**States:** default (none), analytics-active (props), floating (props), tooltip (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-dock"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-dock --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css from `tokens/css/` and the desk icon sprite (inlined in preview).
