// Merges components/la/<id>/ into manifest.json (idempotent). Run standalone or via manifest.mjs.
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { laComponents, laMeta } from '../tools/render-la.mjs';
const m = JSON.parse(fs.readFileSync(ROOT + 'manifest.json'));
for (const k of Object.keys(m.components)) if (m.components[k].group === 'la') delete m.components[k];
for (const id of laComponents()) { const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const slots = JSON.parse(fs.readFileSync(dir + 'slots.json')).slots;
  const ms = fs.existsSync(dir + 'measurements.json') ? JSON.parse(fs.readFileSync(dir + 'measurements.json')) : null;
  m.components[meta.id] = { id: meta.id, name: meta.name, system: 'loyal-arrow-desk', group: 'la', kind: meta.kind, path: `components/la/${id}/`, viewport: meta.viewport, states: meta.states || ['default'],
    files: { html: 'component.html', slots: 'slots.json', meta: 'component.json', preview: 'preview.html', previewDark: 'preview.dark.html', previewRtl: 'preview.rtl.html', measurements: 'measurements.json' },
    slots: Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, { type: v.type, sample: v.sample, maxLength: v.maxLength }])),
    targets: ms ? ms.modes.light.map(b => ({ id: b.id, tag: b.tag, box: { x: b.x, y: b.y, w: b.w, h: b.h } })) : [] }; }
if (m.systems['loyal-arrow-desk']) m.systems['loyal-arrow-desk'] = { ...m.systems['loyal-arrow-desk'], componentGroup: 'la' };
fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(m, null, 2)); console.log('manifest-la:', laComponents().length, 'components');
