# Channels rail (WhatsApp selected, number picker, sections)  `huf-channels-rail`

Left rail of the Channels app: channel switcher (WhatsApp, Telegram, Slack, Teams), the number picker and the WhatsApp sections (Home active, Activity, Broadcasts, Templates, Commerce, Automations, Analytics, Connections, Numbers, Settings).

**When to use:** Compose beside any Channels section.

**Slots people usually change:** `text_micro` (text, e.g. "Northwind Sales"), `hover_bg_paper_deep_8` (text, e.g. "Automations"), `hover_bg_paper_deep_10` (text, e.g. "Connections"), `hover_bg_paper_deep_14` (text, e.g. "Back to Huf"), `hover_bg_paper_deep_5` (text, e.g. "Broadcasts"), `hover_bg_paper_deep_6` (text, e.g. "Templates"). All 20 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-channels-rail"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-channels-rail.link-1`, `huf-channels-rail.link-2`, `huf-channels-rail.link-3`).

**Render:** `node tools/render.mjs huf-channels-rail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/home` with fixtures [base, agents, whatsapp, gateway].
