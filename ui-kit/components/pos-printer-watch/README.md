# POS printer watch dialog  `pos-printer-watch`

Printer Health dialog: title, last-synced line, Sync Now button and one card per printer.

**When to use:** Opened from the printer status button. PrinterWatch has no ar.json keys: its RTL labels are author translations and NEED NATIVE REVIEW.

**Slots people usually change:** `pw_stale` (text, e.g. "Unable to refresh. Displaying "), `pw_desc` (text, e.g. "Last synced: 21/11/2026, 14:32"), `p1_name` (text, e.g. "Kitchen Printer"), `p3_name` (text, e.g. "Receipt Printer"), `pw_title` (text, e.g. "Printer Health"), `p2_name` (text, e.g. "Bar Printer"). All 21 slots are in `slots.json`.

**States:** default (none), online (props), offline (props), fair (props), alert (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-printer-watch"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-printer-watch.sync`).

**Render:** `node tools/render.mjs pos-printer-watch --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
