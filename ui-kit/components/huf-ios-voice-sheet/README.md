# Voice listening sheet: timer, waveform, stop, Send  `huf-ios-voice-sheet`

Voice listening sheet: timer, waveform, stop, Send

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `heading` (text, e.g. "Listening…"), `status` (text, e.g. "LISTENING"), `title` (text, e.g. "Voice"), `close` (text, e.g. "Close"), `time` (text, e.g. "0:04"), `send` (text, e.g. "Send"). All 6 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-voice-sheet"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-voice-sheet --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
