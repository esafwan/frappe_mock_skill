# Interaction states

`kit-lib/states.mjs` pins `state` overlays (SPEC.md, `state`) onto already-rendered HTML. It is generic: it only looks at `data-ui`, `data-fieldname`, `data-row-index` / `data-col-index` and button text.

## Vocabulary
`hover | focus | active | disabled | loading`

| state | class added | attributes added |
|---|---|---|
| hover | `is-hover` | `data-state="hover"` |
| focus | `is-focused` | `data-state="focus"` |
| active | `active` | `data-state="active"`, `aria-pressed="true"` |
| disabled | `disabled` | `data-state="disabled"`, `disabled`, `aria-disabled="true"` |
| loading | `loading` | `data-state="loading"`, `aria-busy="true"` |

## Targets
| target | resolves to |
|---|---|
| `row:N` | `data-ui="list.row.N"`, `row.N`, or `data-row-index="N"` |
| `cell:r,c` | `c` a number: the c-th cell of row r (list cell ids, or datatable `data-row-index`/`data-col-index`). `c` a fieldname: `list.cell.r.<fieldname>`. `cell:r:c` is accepted too. |
| `button:id` | `list.button.<id>`, `form.button.<id>`, `button.<id>`, else a `<button>` whose text is `<id>`; `button:primary` is the primary action |
| `field:fieldname` | the `frappe-control` wrapper with that `data-fieldname`, else any element with it |
| `column:fieldname`, `tab:label`, `link:label`, `card:label`, `ui:id` | by `data-ui` (tabs also by `nav-link` text) |

## API
- `applyStates(slots, overlays)` returns `{slots, applied, missed}`. `slots` is one HTML string or an array (head, main); the first slot containing the target wins.
- `applyStatesCtx(slots, ctx)` does the same from a renderer, marks drawn overlays with `ctx.useOverlays('state', ...)`, and returns the new slots. Undrawn ones are reported by the engine as warnings.
- `locate(html, target)`, `STATES`, `STATE_TARGET_RE`.

Usage in a renderer, after building the page: `[head, main] = applyStatesCtx([head, main], ctx);`.

Output is deterministic; unknown states or unmatched targets land in `missed`.

## Test
`node kit-lib/states.test.mjs`
