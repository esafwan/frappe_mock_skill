# URY Captain actions menu (`ury-captain-actions-menu`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

Overflow menu of the captain order screen: MoreVertical trigger and a 224px panel with Reprint KOT, Transfer table, Transfer captain and Print bill (16px icons, 14px gray-700, 10px 16px padding).

**When:** Top bar of the captain order screen. Items the captain may not use are not rendered (print-bill-only variant); a running reprint/print shows Loader2 and disables the item.

## Variants
- `closed`: Closed: only the MoreVertical trigger.
- `print-bill-only`: Permission gated: only Print bill is rendered.
- `reprinting-kot`: KOT reprint in flight: Loader2 replaces the Printer icon and the item is disabled.
- `printing-bill`: Bill print in flight: Loader2 replaces the Receipt icon and the item is disabled.

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`.
