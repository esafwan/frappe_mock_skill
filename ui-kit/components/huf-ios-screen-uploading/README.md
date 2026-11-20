# Screen: chat with a file uploading at 45 %  `huf-ios-screen-uploading`

Screen: chat with a file uploading at 45 %

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `title` (text, e.g. "Falcon Arabic Test"), `filename` (text, e.g. "invoice.pdf"). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-uploading"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-upload-row.remove`).

**Render:** `node tools/render.mjs huf-ios-screen-uploading --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
