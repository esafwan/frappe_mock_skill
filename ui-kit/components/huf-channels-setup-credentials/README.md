# Channels app: Set up WhatsApp, step 2 (credentials, filled)  `huf-channels-setup-credentials`

WhatsApp setup wizard step 2: gateway name and the Meta IDs and keys (phone number ID, WABA, app ID, access token, app secret) with where to find each.

**When to use:** Secret fields are masked; all values are fictional.

**Slots people usually change:** `text_steel_15` (text, e.g. "Prefer to chat? Hub can walk y"), `text_steel_12` (text, e.g. "A permanent system user token "), `text_steel_14` (text, e.g. "Huf also generates a webhook v"), `text_steel_13` (text, e.g. "Meta app dashboard > App setti"), `text_steel_9` (text, e.g. "Meta app > WhatsApp > API setu"), `text_steel_8` (text, e.g. "Only you see this. It labels t"). All 82 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-channels-setup-credentials"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-channels-setup-credentials.link-1`, `huf-channels-setup-credentials.link-2`, `huf-channels-setup-credentials.link-3`).

**Render:** `node tools/render.mjs huf-channels-setup-credentials --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/setup` with fixtures [base, agents, whatsapp, gateway].
