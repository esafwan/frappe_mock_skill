# Chat with a file uploading (progress bar, composer spinner)  `huf-android-screen-chat-uploading`

Chat with a file uploading (progress bar, composer spinner)

**When to use:** Full Android screen composed from huf-android components (412x892 dp). Authored from the Compose source; no emulator reference.

**Slots people usually change:** `draft` (text, e.g. "Write a message…"). All 1 slots are in `slots.json`.

**States:** default (none), loading (screen). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-screen-chat-uploading"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-screen-chat-uploading --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
