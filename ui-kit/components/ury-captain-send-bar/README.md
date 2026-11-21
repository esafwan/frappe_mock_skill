# URY Captain send bar (`ury-captain-send-bar`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

Sticky primary action of the captain order screen: "Total" (14/600) with the amount (18/600) and a full width 48px default button (16px text): Send Order, Update Order, or the in-flight Loader2 state.

**When:** Bottom of the captain order screen on mobile (390px).

## Variants
- `update`: Existing order being changed: label "Update Order" (hard-coded English in the source).
- `sending`: Submitting a new order: Loader2 and "Sending…", button disabled (opacity .5).
- `updating`: Submitting an update: Loader2 and "Updating…".

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`.
