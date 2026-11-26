# Slice 2: slice-1 fixes, overlays, states, shell

Status of slice 2 of the desk coverage plan (`../docs/DESK-SLICES.md`). Builds on `docs/SLICE1.md`.

## What works
- **Slice-1 fixes**
  - Submitted (docstatus 1) and cancelled (2) forms are read-only unless `allow_on_submit`, with the "Cancelled Document" and "Amended From" banners (`renderers/form/readonly.mjs`).
  - The form title is `doc.name`, or `title_field` only when `show_title_field_in_link` is set; the status pill comes from `renderers/form/title.mjs`.
  - The dock logo and every icon resolve through the full lucide set with a warning on a miss (`shell/icons.mjs`); a blank logo square is gone.
  - Link, Data and text values in generated rows come from pools (`data/pools/*.json`), never "Customer Group 0"; text cells are one line.
  - List columns are fitted: v16 cap of 10 fields, subject first, trailing columns dropped before any overflow, header and cells share widths, rows have one height (`renderers/list/fit.mjs`, `kit-lib/colwidth.mjs`, layout CSS in `rows.mjs`).
  - Workspace blocks honour `col`, charts take the full block width at a sensible height, the onboarding block lays out as a column, and the sidebar highlights the workspace being shown.
- **Overlays**
  - `kit-lib/draw.mjs` runs on every rendered document: pinned `state` overlays, `menu_open` popovers (all registry targets), `dialog` and `toast`. Anything a page renderer already drew is not drawn twice.
  - `kit-lib/layers.mjs` stacks page < popover (1035) < backdrop/modal (1050, +20 per dialog, earlier dialogs dimmed) < toast (1080, first toast at the bottom).
  - `kit-lib/menu-registry.mjs` + `shell/menus.mjs`: 36 menu entries; `kit-lib/states.mjs`: hover, focus, active, disabled, loading (`docs/STATES.md`).
  - Popovers are placed under their anchor by a small static script; with no anchor they sit at the top right.
- **Shell**: mobile (<768px) with the off-canvas drawer (`ctx.chrome.mobile_sidebar: "open"` shows it) and the collapsed 48px rail (`shell/mobile.mjs`). The engine applies it to every shell document.
- **Adapters**: nested `children` is the canonical sidebar shape; workspace and report adapters (`adapters/`).
- **Gate tests**: geometry (every visible `[data-ui]` slot has area, no horizontal overflow; mobile documents at 375 wide), output hygiene, determinism.

## Commands (from `ui-kit/`)
```
node bin/mock.mjs validate samples/*.json
node bin/mock.mjs render samples/t2-form-layers.json --out out/slice2/t2-form-layers.html
node doctype/shot-doctype.mjs out/slice2/t2-form-layers.html out/slice2/t2-form-layers.png
node tests/determinism.mjs                 # every s?-*.json twice, byte-identical, zero warnings
node tests/geometry.mjs out/slice2/*.html  # needs playwright
node tests/output-hygiene.mjs out/slice2/*.html
node tests/overlays-draw.test.mjs          # every menu target, state and layer draws with zero warnings
node tests/menu-registry.test.mjs; node tests/adapters.test.mjs; node tests/parity-shell.mjs
for t in $(fd -e mjs test . --exclude node_modules --exclude out); do node $t; done
bash doctype/render-all.sh
rg -n "Customer|Loyal|GST|Selling|Sales Invoice|URY|Huf" renderers kit-lib shell bin adapters schemas   # genericity (test files may assert absence)
```
Slice-2 samples are `samples/s2-*.json` (alongside the slice-1 `s1-*` to `s7-*`): `t2-form-cancelled`, `t2-form-amended`, `t2-form-states`, `t2-form-menus`, `t2-form-layers`, `t2-form-mobile`, `t2-form-mobile-open`, `t2-list-12col`, `t2-list-states`, `t2-list-menus`, `t2-list-rail`, `t2-workspace-states`, `t2-workspace-menu`. Output and screenshots: `out/slice2/`.

## Gaps
- `dialog` overlays use a minimal generic frame (title, message, plain field rows, actions). Real dialog sizes, field controls, Quick Entry and the named form dialogs are slice 3.
- `ctx.chrome.navbar: true` still draws a navbar whose layout is broken; samples keep it off, and `validate`/render now warn when it is true (a warning fails the gate). Known limitation: popovers for `navbar.*` fall back to the top right. Slice 3 acceptance: the navbar renders and anchors `navbar.*` popovers.
- Menu items for `field:`, `chart:`, `group_by:`, `column:` are registry defaults, not data-driven; `row_actions:N` and a few list menus are drawn by the list renderer inside the row.
- `formStatus` stays strict: `meta.workflow` is an object. The spec loader normalises `workflow: true` or a name string to `{ name, state_field: 'workflow_state', states: [] }` (`normalizeWorkflow`, `kit-lib/indicators.mjs`; tested in `kit-lib.test.mjs`).
- `drawOverlays` stays a post-render pass in slice 2. Slice 3 splits it: a pre-shell pass builds dialog bodies through the real field renderers (shared sprite and field context); the post-render pass only layers and positions.
- `doctype/out/*.html` is not changed by slice 2: `render-all.sh` rewrites it, so the rewrites were reverted (`git checkout -- doctype/out`) after the check.
- Link pools are not coordinated across fields (a Customer Name and its Customer Group are independent picks).
- Onboarding layout CSS was written from the existing block markup, not checked against the v16 source.
- The workspace "Accounting" sample renders the Selling sidebar (sample data), so no sidebar item is highlighted there.
- `geometry.mjs` skips an element inside a `[data-state="closed"]` container (the closed mobile drawer is empty by design).

## Sample prefixes
The prefix names the slice that owns a sample: `s1-*`..`s7-*` are slice 1 (including `s2-odd-a-draft`, left as is), `t2-*` are slice 2. The gate globs `[st]?-*.json` in `tests/determinism.mjs`.

Small slice-2 fix: form sidebar and menu buttons get a 6px icon-to-label gap (`shell/shell.mjs` extra CSS).
