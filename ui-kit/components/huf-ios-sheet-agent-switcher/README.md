# Agent switcher sheet: search and agents grouped by provider  `huf-ios-sheet-agent-switcher`

Bottom sheet with search and provider-grouped agents (selected = check).

**When to use:** Use when the title in the nav header is tapped.

**Slots people usually change:** `d3` (text, e.g. "Google · gemini-3.5-flash-lite"), `d2` (text, e.g. "Anthropic · claude-sonnet-4.6"), `d1` (text, e.g. "local · falcon-h1r:7b"), `d4` (text, e.g. "OpenAI · gpt-4o-mini"), `a1` (text, e.g. "Falcon Arabic Test"), `a2` (text, e.g. "Finance Reviewer"). All 10 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-sheet-agent-switcher"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-sheet-agent-switcher --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
