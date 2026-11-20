# Channels app: Set up WhatsApp, step 1 (choose how to connect)  `huf-channels-setup`

WhatsApp setup wizard step 1 of 6 (Choose how to connect, Credentials, Webhook, Test, Who answers, Access policy): Connect with Facebook or "I have a Meta app", plus the Ask Hub card.

**When to use:** Start of the "connect WhatsApp" story.

**Slots people usually change:** `text_steel_13` (text, e.g. "Prefer to chat? Hub can walk y"), `text_steel_8` (text, e.g. "Recommended. Log in to Meta an"), `text_steel_12` (text, e.g. "Paste the IDs and keys from yo"), `text_steel_2` (text, e.g. "Pick a number above to open th"), `underline` (text, e.g. "Settings › Facebook signup"), `text_ink_3` (text, e.g. "Choose how to connect"). All 71 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-channels-setup"`; 12 interactive elements with measured boxes in `measurements.json` (e.g. `huf-channels-setup.link-1`, `huf-channels-setup.link-2`, `huf-channels-setup.link-3`).

**Render:** `node tools/render.mjs huf-channels-setup --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/setup` with fixtures [base, agents, whatsapp, gateway].
