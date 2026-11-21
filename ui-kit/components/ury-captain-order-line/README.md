# URY Captain order line (`ury-captain-order-line`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

One row of the delta-aware order list: "<qty> x name", optional comment, line price and round 36px action buttons. delta (new/changed, blue) has Minus and Plus; reduction (pending reduction, red, struck through) has RotateCcw; confirmed (already ordered, white) has Minus and a red Trash2.

**When:** Captain order screen, Current Order list (366px wide at 390px).

## Variants
- `delta`: New or changed line: blue-50 background, blue-900 text "+2 x name", Minus and Plus buttons.
- `delta-no-comment`: Delta line without a note: only the name and price lines.
- `reduction`: Pending reduction: red-50 background, red-900 text with line-through, RotateCcw undo button.
- `confirmed`: Already ordered: white background, Minus and a red-200 / red-600 Trash2 button.

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`.
