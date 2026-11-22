# loyal-arrow-desk conventions
Layout: components/la/<id>/{component.html, slots.json, component.json, texts.json?, preview*.html, screenshot*.png, measurements.json}.
Add: copy components/la/shell, set root data-ui="la-<id>", children "la-<id>.<part>"; text only via {{slot}} (slots.json: type text|number|currency|date|time, sample, maxLength, where); style only with la-* classes/--la-* tokens (extend la-desk-base.css, never per-component colours); optional texts.json {slot:{ar:"..."}}.
component.json: id, name, system, kind (shell|page-body|widget|mobile), viewport{w,h}, shell (true = preview inside la/shell via <!--la:content-->), css[], states[].
Run: node tools/render-la.mjs <id> --in shell --theme dark --lang ar --currency KWD; node scripts/la-measure.mjs <id>; node scripts/manifest-la.mjs; node scripts/lint.mjs.
