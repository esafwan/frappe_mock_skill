// Merges components/la/<id>/ into manifest.json (idempotent). Run standalone or via manifest.mjs.
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { laComponents, laMeta } from '../tools/render-la.mjs';
const m = JSON.parse(fs.readFileSync(ROOT + 'manifest.json'));
for (const k of Object.keys(m.components)) if (m.components[k].group === 'la') delete m.components[k];
for (const id of laComponents()) { const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const slots = JSON.parse(fs.readFileSync(dir + 'slots.json')).slots;
  const ms = fs.existsSync(dir + 'measurements.json') ? JSON.parse(fs.readFileSync(dir + 'measurements.json')) : null;
  m.components[meta.id] = { id: meta.id, name: meta.name, system: 'loyal-arrow-desk', group: 'la', kind: meta.kind, path: `components/la/${id}/`, viewport: meta.viewport, states: [...(meta.states || ['default']), ...(meta.modes || [])],
    files: { html: 'component.html', slots: 'slots.json', meta: 'component.json', preview: 'preview.html', previewDark: 'preview.dark.html', previewRtl: 'preview.rtl.html', measurements: 'measurements.json' },
    slots: Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, { type: v.type, sample: v.sample, maxLength: v.maxLength }])),
    targets: ms ? ms.modes.light.map(b => ({ id: b.id, tag: b.tag, box: { x: b.x, y: b.y, w: b.w, h: b.h } })) : [] }; }
if (m.systems['loyal-arrow-desk']) m.systems['loyal-arrow-desk'] = { ...m.systems['loyal-arrow-desk'], componentGroup: 'la' };

// pages/la/*.boxes.json -> manifest.pages (video engine targets with pixel boxes per variant)
import path from 'path';
const pdir = ROOT + 'pages/la/';
if (fs.existsSync(pdir)) for (const f of fs.readdirSync(pdir).filter(x => x.endsWith('.boxes.json'))) { const b = JSON.parse(fs.readFileSync(pdir + f)); const base = f.replace('.boxes.json', '');
  const main = b.variants[base]; const vs = Object.keys(b.variants).filter(k => k !== base);
  m.pages['la-' + base] = { id: 'la-' + base, title: 'Loyal Arrow member 360 (reference ux-after-r1/member-profile-sample)', system: 'loyal-arrow-desk', html: `pages/la/${base}.html`, ownScreenshot: `pages/la/shots/${base}.png`, viewport: b.viewport,
    targets: main.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })),
    variants: vs.map(k => ({ file: `pages/la/${k}.html`, ownScreenshot: `pages/la/shots/${k}.png`, targets: b.variants[k].map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) })) }; }
fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(m, null, 2)); console.log('manifest-la:', laComponents().length, 'components');
