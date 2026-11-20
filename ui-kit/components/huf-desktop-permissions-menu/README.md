# Composer Permissions chip: approval mode menu (open)  `huf-desktop-permissions-menu`

The approval-mode menu of the composer Permissions chip for the workspace supplier-ops: Ask every time (selected), Auto, Sandboxed, Full access, each with its one-line meaning.

**When to use:** Radix portal captured on its own (the window behind it is huf-desktop-chat); place it above the "Ask every time" chip when composing.

**Slots people usually change:** `text_steel_4` (text, e.g. "Reads and normal writes inside"), `text_steel_3` (text, e.g. "Reads run freely. Writes and c"), `text_steel_2` (text, e.g. "Every write, delete and comman"), `text_steel_5` (text, e.g. "No gating. Every operation run"), `text_steel` (text, e.g. "How should agent actions be ap"), `text_ink` (text, e.g. "Ask every time"). All 9 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-permissions-menu"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-permissions-menu.div-1`, `huf-desktop-permissions-menu.button-2`, `huf-desktop-permissions-menu.auto-1`).

**Render:** `node tools/render.mjs huf-desktop-permissions-menu --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat/NW-CONV-0001` with fixtures [base].
