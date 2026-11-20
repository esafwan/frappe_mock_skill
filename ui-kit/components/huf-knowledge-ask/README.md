# Ask a question: passages with citations (page labels, match strength, highlighted terms)  `huf-knowledge-ask`

Source page after asking "how do I start a return with a prepaid label": "These are the passages your agents would read." and result cards citing document, page ("page 2", "pages 2–3"), High/Good match, with query words highlighted and Open document links.

**When to use:** Use to show answers grounded in your own documents (citations).

**Slots people usually change:** `text_steel_14` (text, e.g. "Gather your order number or re"), `text_steel_25` (text, e.g. "When will I get a tracking num"), `text_steel_16` (text, e.g. "if inspection is needed. Inspe"), `text_steel_18` (text, e.g. "Pack the items in the original"), `text_steel_4` (text, e.g. "We want you to be confident th"), `text_steel_8` (text, e.g. ": 1. Sign in to your account a"). All 131 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-ask"`; 35 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-ask.link-1`, `huf-knowledge-ask.link-2`, `huf-knowledge-ask.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-ask --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
