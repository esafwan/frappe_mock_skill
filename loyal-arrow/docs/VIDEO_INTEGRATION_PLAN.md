# Plan: Loyal Arrow videos via tridz_document_engine
Reference setup: `workspaces/ury/` there has `workspace.json` (brand tokens, renderers, design-system), `library/`, `templates/`, `video/{video.json,captions.json,voice.json,designs,templates}`. Video model: `docs/VIDEO-PLAN.md` (clip/card/text/hold scenes, assets registry, ffmpeg + headless Chrome, Remotion optional, Qwen3-TTS narration), tracked in vdash (`docs/VIDEO-DASH-SPEC.md`).

## Steps (none run yet)
1. Create `workspaces/loyal-arrow/` from `workspaces/ury/`: `workspace.json` (id, brand tokens from `brand/brand.json`), design-system, `video/designs`, `library/` (copy from `copy/`). Keep engine brand-free.
2. Add kit systems to `ui-kit/systems/`: `loyal-arrow-counter` and `loyal-arrow-member` (capture CSS tokens from `frontend/counter/src/style.css`, `customer_app/frontend/src/styles/app.css`, per `systems/ADDING_A_SYSTEM.md`). Frappe desk screens reuse `frappe-desk`.
3. Build components: counter home/find/enrol/bill (amount, preview, redeem, receipt), member Home + QR card + login, WhatsApp bubble, reports table. Slots map to `data/*` fields.
4. Capture on a live bench (frappe_multihand, OrbStack): seed from `data/` via the app's demo seeder or scripts, run `scripts/all.sh`; verify the unverified selectors in `flows/`.
5. Render pages with `tools/render.mjs` using locale/currency (en-AE/AED, ar-AE RTL, en-IN/INR; hi/ml need font check) -> PNG/HTML frames -> engine `clip`/`hold` scenes, one `video.json` per flow x store x language.
6. Narration with qwen3-local-tts (start server first), captions via Whisper; per-language versions; register in vdash.
7. Review: keep_clear regions over balances and QR, no real data, disclaimers, confirm placeholder logo replaced.
Heavy steps (bench, capture, render, TTS) are deferred: host is loaded.
