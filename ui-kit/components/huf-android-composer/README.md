# Message composer (attach, input, mic / send / stop, attachment chips)  `huf-android-composer`

Message composer (attach, input, mic / send / stop, attachment chips)

**When to use:** States by slot preset: empty (mic), draft (typed text + send; animate by growing `draft`), busy (stop generation), recording, transcribing. `input_cls` is "ph" (placeholder look) or "txt" (typed text).

**Slots people usually change:** `action` (html, e.g. "<div class="act" data-ui="huf-"), `draft` (text, e.g. "Write a message…"). All 4 slots are in `slots.json`.

**States:** default (none), active (props), draft (props), pressed (props), attachment (props), busy (props), loading (props), stopping (props), recording (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-composer"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-composer --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
