# Agent card (name, status dot, description, provider/model/runs/last run, badges, provider logo)  `huf-agent-card`

One agent card: name, status dot, two-line description, provider/model/runs/last-run ledger, capability badges, settings/logs buttons and provider logo.

**When to use:** Use for close-ups or to compose custom agent grids; change text via slots (agent_name, description, status, meta_value_*).

**Slots people usually change:** `meta_value_4` (relative-time, e.g. "14 hours ago"), `meta_value_3` (number, e.g. "1284"), `description` (text, e.g. "Classifies inbound WhatsApp an"), `agent_name` (text, e.g. "Support Triage"), `meta_value_2` (text, e.g. "gpt-4.1-mini"), `meta_label_1` (text, e.g. "Provider"). All 17 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-card"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-card.button-1`, `huf-agent-card.button-2`).

**Render:** `node tools/render.mjs huf-agent-card --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BKd4Oh-C.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents` with fixtures [base, agents].
