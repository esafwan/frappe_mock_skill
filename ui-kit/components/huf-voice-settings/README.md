# Agent settings: Voice calls on (mode, engine, engine configuration, greeting, speech models)  `huf-voice-settings`

Agent editor > Channels > Voice calls switched on: Text and voice / Voice only, voice engine (OpenAI Realtime), engine configuration (voice, turn detection, interruptions), greeting and the speech-to-text / text-to-speech model fields.

**When to use:** Values in data/huf/chat.json (voice). The live call overlay itself needs WebRTC and is not captured.

**Slots people usually change:** `text_steel_9` (text, e.g. "Specific model for Audio Trans"), `text_steel_7` (text, e.g. "Specific model for Text-to-Spe"), `text_steel` (text, e.g. "Let people talk to it. Same in"), `disabled_opacity_50` (text, e.g. "Hi, this is Northwind order su"), `text_steel_8` (text, e.g. "Voice to use for TTS (e.g. all"), `text_steel_6` (text, e.g. "What the agent says first when"). All 41 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-voice-settings"`; 14 interactive elements with measured boxes in `measurements.json` (e.g. `huf-voice-settings.button-1`, `huf-voice-settings.input-2`, `huf-voice-settings.button-3`).

**Render:** `node tools/render.mjs huf-voice-settings --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#channels` with fixtures [base, agents, agents-editor, chat].
