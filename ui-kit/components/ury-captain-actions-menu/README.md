# URY Captain actions menu  `ury-captain-actions-menu`

Overflow menu of the captain order screen: MoreVertical trigger and a 224px panel with Reprint KOT, Transfer table, Transfer captain and Print bill (16px icons, 14px gray-700, 10px 16px padding).

**When to use:** Top bar of the captain order screen. Items the captain may not use are not rendered (print-bill-only variant); a running reprint/print shows Loader2 and disables the item.

**Slots people usually change:** `transfer_captain` (text, e.g. "Transfer captain"), `transfer_table` (text, e.g. "Transfer table"), `reprint_kot` (text, e.g. "Reprint KOT"), `print_bill` (text, e.g. "Print bill"). All 4 slots are in `slots.json`.

**States:** default (none), closed (props), print-bill-only (props), reprinting-kot (props), loading (props), printing-bill (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-actions-menu"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-actions-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
