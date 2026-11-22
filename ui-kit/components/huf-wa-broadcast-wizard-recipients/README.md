# Broadcast wizard step 2: recipients (saved list of 1,240 + pasted numbers)  `huf-wa-broadcast-wizard-recipients`

Broadcast wizard step 2: the "Restaurant buyers (opted in)" saved list with tag filters and the count badges (Selected 1240, Opted out 18, Will receive 1222), plus three numbers pasted for this broadcast only.

**When to use:** Counts come from data/huf/whatsapp.json (broadcast.preview).

**Slots people usually change:** `tracking_wide_2` (number, e.g. "1240"), `tracking_wide_10` (number, e.g. "1222"), `tracking_wide_8` (number, e.g. "18"), `text_steel_14` (text, e.g. "Columns: phone, then one colum"), `font_medium_6` (text, e.g. "Recipients (one phone number p"), `disabled_opacity_50` (text, e.g. "+1 555 0118 +1 555 0127 +1 555"). All 85 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-broadcast-wizard-recipients"`; 25 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-broadcast-wizard-recipients.button-1`, `huf-wa-broadcast-wizard-recipients.link-2`, `huf-wa-broadcast-wizard-recipients.link-3`).

**Render:** `node tools/render.mjs huf-wa-broadcast-wizard-recipients --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/broadcasts/new` with fixtures [base, whatsapp].
