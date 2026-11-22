# Agent card (name, description, model; selected state with check)  `huf-android-agent-card`

Agent card (name, description, model; selected state with check)

**When to use:** Agents tab list item. sel_class "sel" = currently selected agent; disabled agents render dimmed.

**Slots people usually change:** `check` (html, e.g. "<svg class="ha-ico " viewBox=""), `description` (text, e.g. "Routes work across finance, do"), `name` (text, e.g. "Hub Orchestrator"), `model` (text, e.g. "claude-sonnet-5"). All 5 slots are in `slots.json`.

**States:** default (none), active (props), pressed (props), unselected (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-agent-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-agent-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
