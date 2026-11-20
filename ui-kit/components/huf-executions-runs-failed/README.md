# Executions: failed run filter  `huf-executions-runs-failed`

HUF, Executions with the Status filter set to Failed: the Lead Qualifier run shown with a red Failed pill.

**When to use:** Use for an error-handling or monitoring story.

**Slots people usually change:** `text_steel_11` (currency, e.g. "$0.000600"), `text_steel_13` (relative-time, e.g. "1 day ago"), `text_ink_4` (currency, e.g. "$14.2386"), `text_ink_3` (number, e.g. "39.4%"), `text_ink_5` (number, e.g. "1.8"), `text_steel_soft_5` (text, e.g. "Metrics are read from schedule"). All 95 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-executions-runs-failed"`; 36 interactive elements with measured boxes in `measurements.json` (e.g. `huf-executions-runs-failed.link-1`, `huf-executions-runs-failed.link-2`, `huf-executions-runs-failed.link-3`).

**Render:** `node tools/render.mjs huf-executions-runs-failed --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions` with fixtures [base, decisions].
