# First run: connect with an API key (server address, API key, API secret)  `huf-desktop-first-run-api-key`

The connection screen on the API key tab with the server address filled in: API key and API secret fields, "Where do I find these?", Advanced, Connect / Test only, and the local-models fallback.

**When to use:** Same screen as huf-desktop-first-run (Password tab).

**Slots people usually change:** `end_0` (text, e.g. "The server address, API key an"), `start_0` (text, e.g. "The address you open Huf at in"), `start_0_2` (text, e.g. "With the secret, signs this ap"), `start_0_3` (text, e.g. "Goes with the key and is shown"), `start_0_5` (text, e.g. "The port used for live updates"), `start_0_4` (text, e.g. "The site name on the server. L"). All 47 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-first-run-api-key"`; 18 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-first-run-api-key.button-1`, `huf-desktop-first-run-api-key.input-2`, `huf-desktop-first-run-api-key.button-3`).

**Render:** `node tools/render.mjs huf-desktop-first-run-api-key --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat` with fixtures [base].
