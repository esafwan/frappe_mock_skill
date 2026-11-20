# Mermaid diagram card (title + native flowchart of tonal nodes with arrows)  `huf-android-mermaid-diagram`

Mermaid diagram card (title + native flowchart of tonal nodes with arrows)

**When to use:** Chat artifact for kind mermaid: HufMermaidArtifactPreview inside a content card. Vertical flowchart, 84 dp node pitch; up to 4 node slots (leave n4 empty for 3).

**Slots people usually change:** `title` (text, e.g. "Receivables data flow"), `n1` (text, e.g. "Customer portal"), `n2` (text, e.g. "Billing service"), `n3` (text, e.g. "Reminder agent"). All 5 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-mermaid-diagram"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-mermaid-diagram --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
