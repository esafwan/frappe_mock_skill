# POS settings screen  `pos-screen-settings`

Settings page inside the POS shell: End of Day heading, Close POS card with the Close POS / End Shift danger button, and a "More settings coming soon." placeholder card (max-w 448).

**When to use:** Where a cashier voluntarily ends the shift.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `confirm_description` (text, e.g. "This will end your current ses"), `close_pos_description` (text, e.g. "Reconcile your cash drawer and"), `closed_description` (text, e.g. "Your POS session has been clos"), `coming_soon` (text, e.g. "More settings coming soon."), `confirm_title` (text, e.g. "Close today's POS session?"). All 25 slots are in `slots.json`.

**States:** default (none), confirm (props), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-settings"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `close-pos`).

**Render:** `node tools/render.mjs pos-screen-settings --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-misc.css from `tokens/css/` and the desk icon sprite (inlined in preview).
