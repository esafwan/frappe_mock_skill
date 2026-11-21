# URY Captain menu pane (`ury-captain-menu-pane`)

System: ury-captain (static URY v16 mock, source ury-erp/version-16 @100c43fe2e). Mobile 390px at 3x, light / dark / RTL.

Touch menu browser of the captain order screen: sticky search (16px text), category chips (selected = blue-600), 2-column MenuCard grid (gap 12) with availability tags. Each card is a 240px high menu-item card (96px photo).

**When:** Captain order screen, Menu tab. Browse-only variant: the captain may look but not add items, so an amber note shows and the cards are disabled. Item names, prices and photos bind to data/menus via bindings.json (--menu).

## Variants
- `untagged`: Cards without availability tags (the captain screen passes no branch/company, so MenuCard shows no tag).
- `browse-only`: canAddItems = false: amber note under the chips and every card disabled (opacity .5).

Files: `component.html` (slots as {{name}}), `slots.json`, `states.json`, `measurements.json`, `preview*.html`, `screenshot*.png`. `bindings.json` binds items, prices and photos to data/menus (`--menu`).
