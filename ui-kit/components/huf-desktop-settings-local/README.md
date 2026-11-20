# Settings > Local capabilities (local skills and MCP servers)  `huf-desktop-settings-local`

Settings, Local capabilities: local skill folders, eight skills with Shipped / Local / Workspace badges, one needing confirmation, and the start of the Local MCP servers card.

**When to use:** Use for "bring your own skills and tools" stories.

**Slots people usually change:** `block` (text, e.g. "Skills are folders on this com"), `block_5` (text, e.g. "Lets agents browse the web in "), `block_4` (text, e.g. "An MCP server is a program on "), `start_0` (text, e.g. "Extra abilities that run on th"), `block_8` (text, e.g. "What the built-in office skill"), `text_var_steel_30` (text, e.g. "Agents would act inside your s"). All 211 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-settings-local"`; 56 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-settings-local.input-2`, `huf-desktop-settings-local.link-4`, `huf-desktop-settings-local.link-5`).

**Render:** `node tools/render.mjs huf-desktop-settings-local --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/settings/local` with fixtures [base].
