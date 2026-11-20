# WhatsApp templates page, no templates yet  `huf-wa-templates-empty`

Channels app, WhatsApp > Templates for the fictional supplier Northwind Trading: channel rail with number picker, template list (search, status/category/language filters, status and quality badges) and the empty state ("No templates yet" card with New template).

**When to use:** Establishing shot for any WhatsApp template story; text comes from data/huf/whatsapp.json.

**Slots people usually change:** `text_steel_2` (text, e.g. "Create your first message temp"), `gap_1_5_5` (text, e.g. "Drafts awaiting approval"), `text_ink_3` (text, e.g. "No templates yet"), `text_micro` (text, e.g. "Northwind Sales"), `sr_only` (text, e.g. "Toggle sidebar"), `text_micro_3` (text, e.g. "New template"). All 40 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-templates-empty"`; 21 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-templates-empty.button-1`, `huf-wa-templates-empty.link-2`, `huf-wa-templates-empty.link-3`).

**Render:** `node tools/render.mjs huf-wa-templates-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates` with fixtures [base, whatsapp].
