# frappe_mock_skill

Backend-free, pixel-verified mock UI kit of the real **Frappe v16 desk (ERPNext / URY)** and **URY POS**, for video agents.
Everything lives in [`ui-kit/`](ui-kit/) — start with [`ui-kit/README.md`](ui-kit/README.md), [`ui-kit/AGENT_GUIDE.md`](ui-kit/AGENT_GUIDE.md) and [`SKILL.md`](SKILL.md).

```
ui-kit/tokens/       compiled desk + POS CSS, light/dark variables, Inter fonts, icon sprite
ui-kit/components/   41 components (component.html, states.json, slots.json, screenshots, measurements, README)
ui-kit/pages/        pages composed only from components (+ dark / rtl / ar / currency / menu variants)
ui-kit/manifest.json index of components, slots, states, targets, systems, pages, menus
ui-kit/systems/      UI systems registry (frappe-desk, ury-pos, huf placeholder)
ui-kit/data/         universals (currencies, languages, RTL, i18n) + menus with real photos
ui-kit/tools/        offline renderer (locale, currency, theme, menu)
ui-kit/scripts/      capture / verify / lint / rebuild pipeline (needs a live Frappe v16 bench)
```
Install once: `npm install` (Playwright). Rebuild: `ui-kit/scripts/all.sh`.
