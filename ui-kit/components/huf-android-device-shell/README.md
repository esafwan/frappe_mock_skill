# Android device shell (Pixel 5 viewport 412x892: status bar 9:41, wifi, battery, gesture pill)  `huf-android-device-shell`

Android device shell (Pixel 5 viewport 412x892: status bar 9:41, wifi, battery, gesture pill)

**When to use:** Frame for every screen. Put the screen body in `content` and any scrim/sheet/dialog/drawer in `overlay`. The status bar and gesture pill stay above scrims (as on device).

**Slots people usually change:** none. All 2 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-device-shell"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-device-shell --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
