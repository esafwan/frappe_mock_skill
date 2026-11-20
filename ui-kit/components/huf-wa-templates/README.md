# WhatsApp templates page (list + approved template detail with live preview)  `huf-wa-templates`

Channels app, WhatsApp > Templates for the fictional supplier Northwind Trading: channel rail with number picker, template list (search, status/category/language filters, status and quality badges) and the approved "order_shipped" template open: badges, status hint, details list, Send / Edit and resubmit / Delete and the WhatsApp preview.

**When to use:** Establishing shot for any WhatsApp template story; text comes from data/huf/whatsapp.json.

**Slots people usually change:** `text_steel_3` (relative-time, e.g. "18 h ago"), `text_steel_14` (time, e.g. "09:00"), `text_steel_12` (text, e.g. "left in the next 30 days. Appr"), `text_ink_18` (text, e.g. "left our Rotterdam warehouse t"), `text_steel_13` (text, e.g. "Northwind Trading · Wholesale"), `text_ink_13` (text, e.g. "Order #NW-4812 is on its way"). All 124 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-templates"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-templates.button-1`, `huf-wa-templates.link-2`, `huf-wa-templates.link-3`).

**Render:** `node tools/render.mjs huf-wa-templates --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates/TPL-0001` with fixtures [base, whatsapp].
