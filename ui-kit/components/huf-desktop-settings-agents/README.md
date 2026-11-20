# Settings > Agents and permissions (approval modes, limits per agent)  `huf-desktop-settings-agents`

Settings, Agents and permissions: category rail, the four approval modes (Ask every time, Auto, Sandboxed, Full access) and the limits per agent for workspace supplier-ops.

**When to use:** Establishing shot for "you stay in control" stories.

**Slots people usually change:** `block_4` (text, e.g. "Rules you saved when allowing "), `block_5` (text, e.g. "When on, a request that matche"), `text_var_steel_10` (text, e.g. "While on, remote sessions use "), `block_3` (text, e.g. "Turn a kind of access off, or "), `start_0` (text, e.g. "What agents may do on this com"), `block_8` (text, e.g. "Every package install an agent"). All 156 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-settings-agents"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-settings-agents.search`, `huf-desktop-settings-agents.link-3`, `huf-desktop-settings-agents.link-4`).

**Render:** `node tools/render.mjs huf-desktop-settings-agents --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/settings/agents` with fixtures [base].
