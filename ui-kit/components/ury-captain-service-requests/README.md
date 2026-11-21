# URY Captain service requests (`ury-captain-service-requests`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

Service request bell (48px, amber with a red count badge) and the 320px panel: title, close, rows "Table T1 · Assistance" with Clock meta, optional amber "Acknowledged" pill, Ack and resolve (Check) buttons.

**When:** Floating over the captain screens. Request types are Bill and Assistance in the source; the panel polls open requests.

## Variants
- `collapsed`: Panel closed: only the amber bell with the red count badge.
- `empty-panel`: No open requests: panel shows "No open requests", the bell is white with a border and no badge.
- `resolving`: Resolve in flight on the first row: Loader2 replaces the Check icon.

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`.
