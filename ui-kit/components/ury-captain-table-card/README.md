# URY Captain table card (`ury-captain-table-card`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

Captain "Tables" home card: table name, status badge (Free / Mine / owner name / Billed), owner row, elapsed time and bill total, seats. Free = emerald, Mine = sky, Occupied by another captain = amber, Billed = slate with a Lock, Merged adds a "+ T2, T3" line. The attention-timer variant is the newer frontend/ copy (AlertTriangle, destructive tint, 4px inline-start border).

**When:** Captain tables grid (2 columns, 177px cards at 390px). Tap target only; no cashier chrome. Labels Free/Mine/Billed are hard-coded English in the source; the Arabic labels are translated UI words (tables.available, captain.billed_locked).

## Variants
- `free`: Free table: emerald-300 border, emerald-50 fill, emerald-900 text, success badge, seats only.
- `mine`: Table owned by the signed-in captain: sky-400 / sky-50 / sky-900, info badge, no owner row.
- `occupied`: Occupied by another captain: amber-400 / amber-50 / amber-900, warning badge with the owner name, owner row (User 12), elapsed and total.
- `billed`: Invoice printed: slate-400 / slate-100 / slate-900, Lock 16 in the header, secondary "Billed" badge.
- `merged`: Merged cluster: the "+ T2, T3" line (12/500, opacity .8) under the table name.
- `attention-newer`: newer (frontend/ copy): open longer than the branch attention threshold. AlertTriangle in the header, destructive border/tint/text, 1px border with 4px inline-start border, radius 8, gap 4.

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`.
