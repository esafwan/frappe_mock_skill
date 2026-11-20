# Apps launcher (six installed HUF apps)  `huf-apps-launcher`

HUF Apps launcher inside the main shell: one card per installed app with icon, title, category chip, open-in-new-tab action and description.

**When to use:** Fictional Northwind apps and icons from data/huf/chat.json (apps) and fixtures/chat.mjs (ICONS).

**Slots people usually change:** `app_description_1` (text, e.g. "Visit plans, order capture and"), `app_description_6` (text, e.g. "Product recipes and allergen s"), `app_description_3` (text, e.g. "Tickets from email, WhatsApp a"), `app_description_4` (text, e.g. "Suppliers confirm orders, deli"), `app_description_2` (text, e.g. "Pick lists, stock counts and i"), `app_description_5` (text, e.g. "Dashboards for margin, top cus"). All 82 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-apps-launcher"`; 36 interactive elements with measured boxes in `measurements.json` (e.g. `huf-apps-launcher.link-1`, `huf-apps-launcher.link-2`, `huf-apps-launcher.link-3`).

**Render:** `node tools/render.mjs huf-apps-launcher --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/apps` with fixtures [base, chat].
