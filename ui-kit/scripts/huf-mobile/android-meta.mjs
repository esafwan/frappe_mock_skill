// huf-android: post-process generated slots.json / states.json (run after `node scripts/capture.mjs 'huf-android-*'`).
// Gives slots a real type + where/element + typing flag, and aligns states.json with the huf web convention
// (default, hover, focus, active=pressed, disabled, error, loading, empty + sheet open/closed).
import fs from 'fs';
import { C } from './build-android-lib.mjs';
import { SCREENS } from './build-android.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const rj = (p) => JSON.parse(fs.readFileSync(p, 'utf8')); const wj = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2));
const NA_TOUCH = 'touch UI: Android has no hover or keyboard-focus variant in the emulator captures; use the pressed state (active) instead';
const TYPING = { 'huf-android-composer': 'draft' };
for (const [id, c] of Object.entries(C)) {
  const dir = ROOT + 'components/' + id + '/';
  const slots = {};
  for (const [k, s] of Object.entries(c.slots)) slots[k] = { type: s.type || 'text', sample: s.sample, maxLength: s.maxLength, where: s.type === 'class' ? 'class' : 'text', element: id + (TYPING[id] === k ? '.input' : ''), ...(TYPING[id] === k ? { typing: true, note: 'animate by revealing characters of `draft` one at a time (set input_cls to "txt" first)' } : {}) };
  wj(dir + 'slots.json', { component: id, note: 'html-typed slots take markup; class-typed slots take a CSS class token; set typing:true slots character by character for typing animation', slots });
  const st = rj(dir + 'states.json').states;
  for (const k of ['hover', 'focus']) st[k] = { applicable: false, reason: NA_TOUCH };
  const has = (n) => st[n];
  if (!st.active || !st.active.applicable) st.active = { applicable: false, reason: 'no pressed variant for this component' };
  if (has('pending-expiring') && id.endsWith('approval-card')) st.disabled = { ...st['pending-expiring'], alias: 'pending-expiring', description: 'Approve/Deny dimmed while the card is not decidable' };
  if (id.endsWith('signin-form') || id.endsWith('apikey-form')) st.disabled = { applicable: true, mechanism: 'slot-preset', props: {}, description: 'default state: Sign in is disabled until all fields are filled (btn_state "disabled")' };
  if (id.endsWith('text-field') && st.error?.applicable) {}
  if (has('closed')) { st.closed.description = c.states.closed.note; st.open = { ...(st.open || {}), applicable: true, description: 'open pose = default' }; }
  for (const k of ['error', 'loading', 'empty']) if (st[k] && !st[k].applicable && !st[k].reason) st[k].reason = 'not applicable: this component has no distinct ' + k + ' variant';
  wj(dir + 'states.json', { component: id, states: st });
}
const OVER = ['chats-drawer', 'overflow-menu', 'agent-switcher-sheet', 'attach-sheet', 'permission-dialog'];
for (const s of SCREENS) {
  const id = 'huf-android-screen-' + s.id; const dir = ROOT + 'components/' + id + '/';
  const old = rj(dir + 'slots.json'); const html = fs.readFileSync(dir + 'component.html', 'utf8');
  const composedOf = [...new Set([...html.matchAll(/data-ui="(huf-android-[a-z-]+)/g)].map((x) => x[1]))].filter((x) => x !== id);
  const hasComposer = composedOf.includes('huf-android-composer');
  const typing = hasComposer ? { component: 'huf-android-composer', slot: 'draft', selector: '[data-ui="huf-android-composer.input"]' } : null;
  const ov = OVER.find((o) => s.overlay && html.includes('data-ui="huf-android-' + o + '"'));
  wj(dir + 'slots.json', { component: id, note: 'Full screen composed from huf-android-* components. Change text through the component slots (see composedOf); target elements by data-ui.', slots: hasComposer ? { draft: { type: 'text', sample: (html.match(/data-ui="huf-android-composer\.input">([^<]*)</) || [])[1] || '', maxLength: 200, where: 'text', element: 'huf-android-composer.input', typing: true } } : {}, typing, composedOf });
  const states = { default: { applicable: true, mechanism: 'none' }, hover: { applicable: false, reason: NA_TOUCH }, focus: { applicable: false, reason: NA_TOUCH }, active: { applicable: false, reason: 'pressed variants live on the components (see composedOf)' }, disabled: { applicable: false, reason: 'n/a' }, error: { applicable: !!/upload-failed|apikey|approval-states/.test(s.id), ...(/upload-failed/.test(s.id) ? { mechanism: 'screen', description: 'this screen is the failed-upload state' } : { reason: 'n/a' }) }, loading: { applicable: /busy|uploading|voice/.test(s.id), ...(/busy|uploading|voice/.test(s.id) ? { mechanism: 'screen', description: 'this screen is the loading / busy state (composer spinner or stop button)' } : { reason: 'n/a' }) }, empty: { applicable: /empty|projects-empty|automations/.test(s.id), ...(/empty|automations/.test(s.id) ? { mechanism: 'screen', description: 'empty-state screen' } : { reason: 'n/a' }) } };
  if (ov) { states['sheet-open'] = { applicable: true, mechanism: 'screen', description: `this screen shows ${ov} open; the closed pose is the ${ov} component state "closed" (translate off-screen)`, component: 'huf-android-' + ov, closedState: 'closed' }; }
  wj(dir + 'states.json', { component: id, states });
}
console.log('meta ok');
// READMEs for dirs that lack one (existing ones come from scripts/docs.mjs)
const rd = (dir, t) => { if (!fs.existsSync(dir + 'README.md')) fs.writeFileSync(dir + 'README.md', t); };
for (const [id, c] of Object.entries(C)) rd(ROOT + 'components/' + id + '/', `# ${c.name}  \`${id}\`\n\n${c.desc}\n\n**Slots:** ${Object.keys(c.slots).map((k) => '`' + k + '`').join(', ') || 'none'} (see \`slots.json\`). **States:** ${Object.keys(c.states || {}).map((k) => '`' + k + '`').join(', ') || 'default'} (see \`states.json\`).\n\nSystem \`huf-android\` (412x892 dp, light + dark). Target elements by \`data-ui\`.\n`);
for (const s of SCREENS) rd(ROOT + 'components/huf-android-screen-' + s.id + '/', `# ${s.name}  \`huf-android-screen-${s.id}\`\n\nFull Android screen (412x892 dp, Pixel 5), English, fictional data. ${s.ref ? 'Emulator reference: `systems/huf-android/ref/' + s.ref + '.*.png`.' : 'Authored from the Compose source with iOS parity; no emulator reference.'}\n`);
