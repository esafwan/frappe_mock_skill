# Approval panel: one command waiting for approval  `huf-desktop-approval`

The in-app approval panel (its own 380 px window over the chat): Operations Analyst asks to run a command in supplier-ops, with the command, working folder, confinement note and Allow once / for this run / Deny.

**When to use:** Approve buttons are disarmed for 600 ms after a request appears in the real app; this capture is after that.

**Slots people usually change:** `command` (text, e.g. "python3 scripts/email_supplier"), `hover_bg_var_paper_deep_2` (text, e.g. "Allow this command for this ru"), `agent_and_chat_2` (text, e.g. "- Supplier delivery review, Q4"), `hover_bg_var_paper_deep_3` (text, e.g. "Allow any command for this run"), `text_var_steel_4` (text, e.g. "auto-denies in 120s"), `text_var_steel` (text, e.g. "Operations Analyst"). All 19 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-approval"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-approval.button-1`, `huf-desktop-approval.button-2`, `huf-desktop-approval.button-3`).

**Render:** `node tools/render.mjs huf-desktop-approval --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `approval/index.html` with fixtures [base].
