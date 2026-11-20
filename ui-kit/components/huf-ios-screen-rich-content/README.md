# Screen: chat thread with markdown, table and Mermaid diagram  `huf-ios-screen-rich-content`

Screen: chat thread with markdown, table and Mermaid diagram

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `body` (text, e.g. "An ERP system connects finance"), `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Show the ERP summary and archi"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `title` (text, e.g. "ERP architecture"). All 23 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-rich-content"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-composer.attach`).

**Render:** `node tools/render.mjs huf-ios-screen-rich-content --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
