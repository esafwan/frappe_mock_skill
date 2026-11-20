# SSH connection editor (connection details, key auth, host key)  `huf-ssh-connection-edit`

SSH connection editor for the warehouse printer host: enable switch, host, port, user, private-key authentication and the pinned host key section, with Test connection.

**When to use:** Use for configuring remote execution.

**Slots people usually change:** `text_steel_8` (text, e.g. "Connects to target server to a"), `text_steel_3` (text, e.g. "Specify target hostname, port,"), `text_steel_5` (text, e.g. "Disabled connections cannot be"), `text_steel_4` (text, e.g. "Friendly identifier for select"), `text_steel_6` (text, e.g. "Pinned host key verification p"), `break_all` (text, e.g. "SHA256:Qm5v0xk2b7R1m8pZtYc3uVd"). All 68 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ssh-connection-edit"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ssh-connection-edit.button-1`, `huf-ssh-connection-edit.link-2`, `huf-ssh-connection-edit.link-3`).

**Render:** `node tools/render.mjs huf-ssh-connection-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/ssh-connections/SSH-0001` with fixtures [base, tools].
