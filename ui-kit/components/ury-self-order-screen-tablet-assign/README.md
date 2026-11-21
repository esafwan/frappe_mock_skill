# Self-order portable tablet assignment screen  `ury-self-order-screen-tablet-assign`

PortableTabletAssignment: staff provisioning, not a customer screen. A portable/shared URY Ordering Device has no table until staff enter the 4-6 digit PIN on the keypad (64px keys, rounded-xl border-2) and then a table name or code; the PIN is only verified server-side at assignment.

**When to use:** Shown once, before the tablet is handed to a customer; after a successful assignment the tablet menu takes over. Base capture is the PIN step with four digits. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `error_msg` (text, e.g. "Could not assign this table. P"), `table_hint` (text, e.g. "Enter the table identifier to "), `pin_hint` (text, e.g. "Enter the 4-6 digit PIN to pro"), `subtitle` (text, e.g. "Bind a portable tablet to a ta"), `table_placeholder` (text, e.g. "e.g. T12, Table A, 5"), `title` (text, e.g. "Assign This Tablet"). All 15 slots are in `slots.json`.

**States:** default (none), pin-empty (props), pin-full (props), pin-error (props), table-empty (props), table-filled (props), assigning (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-tablet-assign"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-tablet-assign.continue`).

**Render:** `node tools/render.mjs ury-self-order-screen-tablet-assign --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-tablet.css from `tokens/css/` and the desk icon sprite (inlined in preview).
