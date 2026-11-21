# URY admin printer configuration  `ury-admin-screen-printer-config`

Printer Configuration page inside the admin shell: header with Save Changes, Network Printers table, Production Unit and Room assignment cards and the POS Profile print and QZ settings, in a two-column grid.

**When to use:** Use for hardware setup. The Server IP column shows hostnames; the add and delete dialogs are separate variants.

**Slots people usually change:** `pc_desc` (text, e.g. "Manage network printers and pr"), `pc_unit_d` (text, e.g. "Configure KOT and order routin"), `pc_del_b` (text, e.g. "? Printer assignments referenc"), `pc_qz_d` (text, e.g. "Print through a local QZ Tray "), `pc_pos_a` (text, e.g. "Configure invoice, receipt, an"), `pc_room_d` (text, e.g. "Configure dining area, hall, a"). All 124 slots are in `slots.json`.

**States:** default (none), add-printer-dialog (props), delete-printer-dialog (props), no-network-printers (props), empty (props), reprint-off (props), saving (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-printer-config"`; 48 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-printer-config --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-masters.css from `tokens/css/` and the desk icon sprite (inlined in preview).
