# First run: connect to a Huf server (server address, API key, API secret)  `huf-desktop-first-run`

The connection screen of Huf Desktop: "Connect to Huf" with server address, API key and API secret, "Where do I find these?", Advanced (site and live-updates port), Connect / Test only, and the "With Huf Desktop" benefits list.

**When to use:** Nothing is connected in this state (no saved connection).

**Slots people usually change:** `end_0` (text, e.g. "The server address, API key an"), `start_0` (text, e.g. "The address you open Huf at in"), `start_0_3` (text, e.g. "The port used for live updates"), `start_0_2` (text, e.g. "The site name on the server. L"), `text_var_steel_3` (text, e.g. "Open your Huf site in a browse"), `text_var_steel_5` (text, e.g. "Copy the API key and the API s"). All 42 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-first-run"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-first-run.button-1`, `huf-desktop-first-run.url-1`, `huf-desktop-first-run.button-2`).

**Render:** `node tools/render.mjs huf-desktop-first-run --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat` with fixtures [base].
