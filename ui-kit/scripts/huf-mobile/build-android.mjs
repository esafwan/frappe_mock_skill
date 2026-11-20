// huf-android builder: hand-authored HTML/CSS recreation of the native Android Huf app (Compose, Material 3).
// Emits components/huf-android-*/ (component.html, preview*.html, slots.json, states.json, harness.json, README.md),
// systems/huf-android/screens.json and scripts/specs-huf-android.mjs. Run: node scripts/huf-mobile/build-android.mjs
import fs from 'fs';
import { C, ico, NAV } from './build-android-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const CSS = ['fonts.css', 'tokens.css', 'components.css'];
const sub = (tpl, vals) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vals[k] ?? ''));
export function R(id, over = {}) { // render a component with slot samples (+ overrides)
  const c = C['huf-android-' + id]; if (!c) throw new Error('no component ' + id);
  const v = Object.fromEntries(Object.entries(c.slots).map(([k, s]) => [k, s.sample]));
  Object.assign(v, over); if (c.pre) Object.assign(v, c.pre(v));
  return sub(c.tpl, v);
}
const shell = (content, overlay = '', cls = '') => R('device-shell', { content, overlay }).replace('class="ha-device"', `class="ha-device ${cls}"`);
const scrim = '<div class="ha-scrim"></div>';
const navBar = (on) => R('bottom-nav', Object.fromEntries(NAV.map(([, l]) => [l.toLowerCase() + '_on', l === on ? 'on' : ''])));
const bar3 = (title, sub2, proj) => R('top-app-bar', proj ? { variant: 'three', title, subtitle: sub2, project_line: `<div class="pj">${proj}</div>` } : { variant: 'two', title, subtitle: sub2 });
const comp = (o = {}) => R('composer', o);
const chatBody = (inner, cls = '') => `<div class="ha-chat ${cls}">${inner}</div>`;
const nudge = (h, px) => `<div style="margin-top:${px}px">${h}</div>`;
const ubub = (t) => R('user-bubble', { text: t });
const atext = (t) => R('assistant-text', { text: t });
const apr = (st = '', o = {}) => R('approval-card', o);
const aprState = (name, over = {}) => R('approval-card', { ...(C['huf-android-approval-card'].states[name]?.slots || {}), ...over });
const chat = (title, sub2, proj, inner, over = {}) => bar3(title, sub2, proj) + chatBody(inner) + (over.noComposer ? '' : comp(over.composer || {})) + navBar('Chat');
const FIX = { recipients: '128', template: 'payment_reminder_v2', channel: 'WhatsApp', sample: 'Hi Ahmed, your invoice INV-2041 for AED 4,200 is due on 20 Nov.' };
const fixUser = ubub('Remind overdue customers and show me the receivables dashboard.');
const pending = R('approval-card', { ...FIX, footer: '<div class="exp">Expires in 8:38</div><div class="acts"><div class="ha-btn-approve">Approve</div><div class="ha-btn-deny">Deny</div></div>', state: 'disabled', title: 'Send WhatsApp campaign' });
const sendingFix = R('approval-card', { ...FIX, status: 'Sending…', footer: '<div class="busy"><span class="ha-spin"></span>Sending…</div>', title: 'Send WhatsApp campaign' });
const tbl = R('table-artifact');
const chartA = R('chart-artifact');
const rec = (n, d) => `<div class="ha-pcard"><div class="n">${n}</div><div class="d">${d}</div></div>`;
const tabPage = (title, btn, inner) => `<div class="ha-page"><div class="ha-pagebar" style="margin-top:${btn ? 28 : 20}px;height:${btn ? 50 : 40}px"><span class="pt">${title}</span>${btn}</div>${inner}</div>`;
const prov = (t, extra = '') => `<div class="ha-provider" style="margin-top:${extra || 33}px;margin-bottom:9px">${t}</div>`;
const sec = (t, mt) => `<div class="ha-lab" style="margin:${mt}px 0 0 25px">${t}</div>`;
const projSheet = `<div class="ha-sheet" style="padding-bottom:0;height:446px"><div class="handle"></div><div class="ha-psheet-t" style="margin-top:40px">Receivables</div><div style="color:var(--ha-accent);font-size:16px;padding:0 21px;margin-top:7px;line-height:24px">Active</div><div class="ha-psheet-l" style="margin-top:18px">Description</div><div class="ha-psheet-v" style="margin-top:9px">Ageing, reminders and collections follow-up</div><div class="ha-psheet-l" style="margin-top:20px">Default agent: Finance Reviewer</div><div class="ha-psheet-t" style="margin-top:18px;font-size:18px">Conversation history</div><div class="ha-hist"><div class="n">Overdue receivables summary</div><div class="s">Finance Reviewer</div></div><div class="ha-hist" style="margin-top:8px"><div class="n">Draft reminder for Al Noor Trading</div><div class="s">Finance Reviewer</div></div></div>`;
const compSheet = `<div class="ha-sheet" style="padding-bottom:0;height:245px"><div class="handle"></div><div class="hd" style="border-bottom:1px solid var(--ha-hairline);margin-top:12px"><span style="text-transform:none;font-size:20px;font-weight:600">Remote computers</span><span style="display:flex;align-items:center;gap:24px;color:var(--ha-accent)">${ico('refresh')}<a style="font-size:17px">Close</a></span></div><div style="padding:14px 21px;display:flex"><span style="color:var(--ha-accent);margin-right:12px;margin-top:4px">${ico('laptop')}</span><div style="flex:1"><div style="font-size:19px;font-weight:500;line-height:24px">Studio Mac</div><div style="font-size:14.5px;color:var(--ha-secondary);line-height:18px">dev-studio</div></div><span style="color:var(--ha-accent);font-size:17px;font-weight:500">Online</span></div><div style="padding:0 21px 0 56px;font-size:17.5px;line-height:25px;color:var(--ha-secondary)">Remote access enabled on desktop<br>Workspace mode: ask</div></div>`;
const artHead = (backTitle) => `<div class="ha-fs-bar" style="margin-top:6px"><span class="ha-textbtn">${backTitle}</span><span class="ha-textbtn">${ico('close')}Close</span></div>`;
const artScreen = (inner) => `<div class="ha-fs" style="padding-top:2px"><div class="ha-fs-bar"><span class="t">Artifacts</span><span class="ha-textbtn">${ico('close')}Close</span></div>${inner}</div>`;
const SCRIM_BARS = '<div class="ha-scrim-bar" style="top:0;height:52px"></div><div class="ha-scrim-bar" style="bottom:0;height:25px"></div>';

// ---- screens: id -> {name, ref, themes, body, overlay, ...} ----
export const SCREENS = [
  { id: 'signin', name: 'Sign in / connect (first launch)', ref: 'signin', themes: ['light', 'dark'], body: () => R('signin-form') },
  { id: 'signin-filled', name: 'Sign in with fields filled (Sign in enabled)', ref: null, themes: ['light', 'dark'], body: () => R('signin-form', C['huf-android-signin-form'].states.ready.slots) },
  { id: 'dashboard', name: 'Chat thread fixture: user prompt, pending + sending approval cards, receivables table', ref: 'dashboard', themes: ['light', 'dark'], body: () => chatBody(fixUser + atext('I prepared a reminder. Approve to send:') + pending + sendingFix + '<div class="ha-h2">Receivables summary</div>' + tbl, 'fixture') },
  { id: 'confirmation', name: 'Pending approval card awaiting approval (fixture)', ref: 'confirmation', themes: ['light', 'dark'], body: () => chatBody(fixUser + atext('I prepared a reminder. Approve to send:') + pending, 'fixture') },
  { id: 'sending', name: 'Approval card approved / sending (fixture)', ref: 'sending', themes: ['light', 'dark'], body: () => chatBody(fixUser + atext('I prepared a reminder. Approve to send:') + sendingFix, 'fixture') },
  { id: 'chat-live', name: 'Chat: user message, assistant reply and pending WhatsApp approval, bottom nav', ref: 'live-chat', themes: ['light', 'dark'],
    body: () => chat('Send the November promo', 'Workspace', null, ubub('Send the November promo to my VIP list.') + atext('I can send the promo_nov WhatsApp template to 120 recipients. This needs your approval first.') + R('approval-card')) },
  { id: 'chat-new-empty', name: 'New conversation (empty: No messages yet.)', ref: 'chat-new-empty', themes: ['light', 'dark'], body: () => chat('New conversation', 'Start a conversation', null, R('empty-state')) },
  { id: 'chat-rich-table', name: 'Chat with markdown table artifact and chart (project assigned)', ref: 'chat-rich-table', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', nudge(atext('Here is the receivables ageing for November.'), -16) + tbl + chartA) },
  { id: 'chat-rich-chart', name: 'Chat scrolled to the Ageing by bucket chart', ref: 'chat-rich-chart', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', '<div style="margin-top:-197px">' + tbl + '</div>' + chartA.replace('margin-top:20px', '')) },
  { id: 'chats-drawer', name: 'Chats drawer over the chat (Search threads, New chat, Projects, Automations, Agents, Recent)', ref: 'drawer', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', ubub('Send the November promo to my VIP list.') + atext('I can send the promo_nov template to the first.')), overlay: () => scrim + R('chats-drawer') },
  { id: 'chat-menu', name: 'Chat overflow menu open (Artifacts, Rename, Fork, Delete, Move to project, agent)', ref: 'chat-menu', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', '<div style="margin-top:-197px">' + tbl + '</div>' + chartA.replace('margin-top:20px', '')), overlay: () => R('overflow-menu') },
  { id: 'agent-switcher', name: 'Switch agent bottom sheet', ref: 'agent-switcher', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', '<div style="margin-top:-197px">' + tbl + '</div>' + chartA.replace('margin-top:20px', '')), overlay: () => scrim + R('agent-switcher-sheet') },
  { id: 'attach-sheet', name: 'Attach bottom sheet over the chat', ref: 'attach-sheet', themes: ['light', 'dark'], body: () => chat('Overdue receivables summary', 'Workspace', 'Project: Receivables', '<div style="margin-top:-197px">' + tbl + '</div>' + chartA.replace('margin-top:20px', '')), overlay: () => scrim + R('attach-sheet') },
  { id: 'voice-listening', name: 'Microphone permission dialog over a new conversation', ref: 'voice-listening', refLightInvalid: true, themes: ['light', 'dark'], body: () => chat('New conversation', 'Start a conversation', null, nudge(R('empty-state'), 14), { composer: { action: '<div class="act"><span class="ha-spin" style="width:24px;height:24px"></span></div>' } }), overlay: () => scrim + R('permission-dialog') },
  { id: 'artifact-browser', name: 'Artifacts browser list (chart, markdown, html)', ref: 'artifact-browser', themes: ['light', 'dark'], shellCls: 'scrimmed', body: () => artScreen(R('artifact-row') + R('artifact-row', C['huf-android-artifact-row'].states.markdown.slots) + R('artifact-row', C['huf-android-artifact-row'].states.html.slots)), overlay: () => SCRIM_BARS },
  { id: 'artifact-chart-detail', name: 'Artifact detail: Ageing by bucket chart with send button', ref: 'artifact-chart-detail', themes: ['light', 'dark'], body: () => `<div class="ha-fs" style="padding-top:2px"><div class="ha-fs-bar"><span class="ha-textbtn">${ico('back')}Artifacts</span><span class="ha-textbtn">${ico('close')}Close</span></div><div class="ha-art-title" style="margin-top:12px"><span class="h">Ageing by bucket</span><span>${ico('send', 's28')}</span></div><div class="ha-art-sub" style="margin-bottom:14px">chart</div>${chartA.replace('class="ha-chart"', 'class="ha-chart detail"').replace('margin-top:20px', '')}</div>`, overlay: () => SCRIM_BARS },
  { id: 'composer-draft', name: 'Composer with a typed draft (send button)', ref: null, themes: ['light', 'dark'], body: () => chat('New conversation', 'Start a conversation', null, R('empty-state'), { composer: C['huf-android-composer'].states.draft.slots }) },
  { id: 'composer-attachment', name: 'Composer with an attached file chip (uploading)', ref: null, themes: ['light', 'dark'], body: () => chat('New conversation', 'Start a conversation', null, R('empty-state') + '<div style="position:absolute;left:21px;bottom:6px">' + R('attachment-chip') + '</div>', { composer: C['huf-android-composer'].states.attachment.slots }) },
  { id: 'projects-list', name: 'Projects tab (search, project cards)', ref: 'projects-list', themes: ['light', 'dark'], body: () => tabPage('Projects', `<div class="ha-tonal">${ico('add')}Create project</div>`, `<div style="margin-top:23px">${R('search-field', { placeholder: 'Search projects' })}</div><div style="margin-top:2px">${rec('Receivables', 'Ageing, reminders and collections follow-up')}${rec('Policy &amp; compliance', 'Policy Q&amp;A and compliance document review')}${rec('Vendor onboarding', 'KYC checks and onboarding paperwork')}${rec('Field reports', 'Site inspection summaries in Arabic and English')}</div>`) + navBar('Projects') },
  { id: 'projects-empty', name: 'Projects tab, no projects yet', ref: null, themes: ['light', 'dark'], body: () => tabPage('Projects', `<div class="ha-tonal">${ico('add')}Create project</div>`, `<div style="margin-top:23px">${R('search-field', { placeholder: 'Search projects' })}</div><div class="ha-emptyline" style="margin-top:28px">No projects yet.</div>`) + navBar('Projects') },
  { id: 'project-detail', name: 'Project detail bottom sheet (Receivables)', ref: 'project-detail', themes: ['light', 'dark'], body: () => tabPage('Projects', `<div class="ha-tonal">${ico('add')}Create project</div>`, `<div style="margin-top:23px">${R('search-field', { placeholder: 'Search projects' })}</div><div style="margin-top:2px">${rec('Receivables', 'Ageing, reminders and collections follow-up')}${rec('Policy &amp; compliance', 'Policy Q&amp;A and compliance document review')}${rec('Vendor onboarding', 'KYC checks and onboarding paperwork')}</div>`) + navBar('Projects'), overlay: () => scrim + projSheet },
  { id: 'agents', name: 'Agents tab (search, grouped providers, selected agent)', ref: 'live-agents', themes: ['light', 'dark'], body: () => tabPage('Agents', '', `<div style="margin-top:7px">${R('search-field')}</div><div class="ha-helper" style="margin-top:17px">In an existing conversation, only streaming agents can be selected; queued replies use the server’s saved agent.</div>${prov('Anthropic', 26)}${R('agent-card')}${prov('Falcon', 31)}${R('agent-card', C['huf-android-agent-card'].states.unselected.slots)}${prov('Google', 33)}${R('agent-card', { name: 'Doc Extractor', description: 'Extracts fields from invoices and contracts', model: 'gemini-3', sel_class: '', check: '' })}`) + navBar('Agents') },
  { id: 'account', name: 'Account tab (server, saved servers, appearance, language)', ref: 'live-account', themes: ['light', 'dark'], body: () => tabPage('Account', '', R('account-rows') + sec('Appearance', 47) + `<div style="margin-top:17px">${R('segmented-buttons')}</div>` + sec('Language', 45) + `<div style="margin-top:17px">${R('segmented-buttons', { a: 'System', b: 'English', c: 'العربية', a_on: 'on', a_chk: ico('check') })}</div><div class="ha-helper" style="margin-top:35px">Signing out removes the saved API key or session from this device so you can connect to a different account or server.</div>`) + navBar('Account') },
  { id: 'remote-computers', name: 'Remote computers bottom sheet over Account', ref: 'remote-computers', themes: ['light', 'dark'], body: () => tabPage('Account', '', R('account-rows') + sec('Appearance', 47) + `<div style="margin-top:17px">${R('segmented-buttons')}</div>` + sec('Language', 45)) + navBar('Account'), overlay: () => scrim + compSheet },
  { id: 'automations', name: 'Automations tab, empty (Create automation)', ref: 'live-automations', themes: ['light', 'dark'], body: () => tabPage('Automations', '<div class="ha-fab">Create automation</div>', `<div style="font-size:14.5px;line-height:20px;color:var(--ha-secondary);margin-top:14px">Automation actions require the corresponding permissions on your HUF account.</div><div class="ha-emptyline" style="margin-top:38px">No scheduled automations.</div>`) + navBar('Automations') },
];

const W = (p, s) => { fs.mkdirSync(p.replace(/\/[^/]*$/, ''), { recursive: true }); fs.writeFileSync(p, s); };
const page = (id, title, html, dark, depth = 2) => {
  const up = '../'.repeat(depth);
  return `<!doctype html>\n<html lang="en"${dark ? ' data-theme="dark"' : ''}>\n<head><meta charset="utf-8"><meta name="viewport" content="width=412"><title>${title.replace(/</g, '&lt;')}</title>\n${CSS.map((f) => `<link rel="stylesheet" href="${up}tokens/css/huf-android/${f}">`).join('\n')}\n<style>html,body{margin:0;background:${dark ? '#1D1D1F' : '#FBFBFD'}}#ha-stage{position:absolute;left:0;top:0;width:412px}*{animation:none!important;transition:none!important;caret-color:transparent!important}</style>\n</head>\n<body><div id="ha-stage">${html}</div></body></html>\n`;
};
const ABS = '<style>.ha-sheet,.ha-menu,.ha-perm,.ha-drawer{position:relative!important;inset:auto!important;margin:0!important}.ha-sheet{border-radius:28px 28px 0 0}.ha-drawer{width:326px;height:892px;border-radius:0 28px 28px 0}.ha-menu{margin:8px!important}.ha-perm{margin:8px auto!important}</style>';
const modes = ['light', 'dark'];
const ids = [];
for (const [cid, c] of Object.entries(C)) {
  ids.push(cid);
  const dir = ROOT + 'components/' + cid + '/';
  const sample = Object.fromEntries(Object.entries(c.slots).map(([k, s]) => [k, s.sample]));
  let frag = c.tpl; // component.html: template with {{slots}}
  W(dir + 'component.html', frag + '\n');
  const wrap = (h) => { const needs = /ha-sheet|ha-menu|ha-perm|ha-drawer/.test(h) ? ABS : ''; const inner = cid.endsWith('device-shell') || /ha-(approval|ha-table)/.test('') ? h : h; return needs + (c.root === 'device' ? h : `<div style="width:412px;background:var(--ha-canvas);padding:${/ha-(sheet|menu|perm|drawer)/.test(h) ? 0 : '0'}">${h}</div>`); };
  const prevHtml = R(cid.replace('huf-android-', ''), cid.endsWith('device-shell') ? { content: '<div style="padding:60px 21px;color:var(--ha-secondary)">Screen body</div>' } : {});
  const pad = (h) => (c.root === 'device' ? h : h);
  for (const m of modes) W(dir + (m === 'light' ? 'preview.html' : 'preview.dark.html'), page(cid, c.name, wrap(prevHtml), m === 'dark'));
  W(dir + 'slots.json', JSON.stringify({ component: cid, slots: Object.fromEntries(Object.entries(c.slots).map(([k, s]) => [k, { type: s.type, sample: s.sample, maxLength: s.maxLength }])) }, null, 1));
  const st = { component: cid, states: { default: { applicable: true, mechanism: 'none', note: 'markup as in component.html with slot samples' } } };
  for (const [n, s] of Object.entries(c.states || {})) st.states[n] = { applicable: true, mechanism: 'slot-preset', slots: s.slots, note: s.note || undefined, preview: `states/${n}.html` };
  W(dir + 'states.json', JSON.stringify(st, null, 1));
  for (const [n, s] of Object.entries(c.states || {})) W(dir + `states/${n}.html`, page(cid, c.name + ' / ' + n, wrap(R(cid.replace('huf-android-', ''), s.slots)), false, 3));
  W(dir + 'harness.json', JSON.stringify({ id: cid, name: c.name, group: 'huf-android', kind: 'static-html', modes, css: CSS, cssBase: '../../tokens/css/huf-android/', darkTheme: 'html[data-theme="dark"]', viewport: { w: 412, h: 892, dpr: 2.621 } }, null, 1));
  W(dir + 'README.md', `# ${cid}\n\n${c.name}\n\n${c.desc}\n\n- System: \`huf-android\` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (\`html[data-theme="dark"]\`).\n- Root element: \`[data-ui="${cid}"]\`. Slots: ${Object.keys(c.slots).map((k) => '`' + k + '`').join(', ') || 'none'}. See \`slots.json\`, \`states.json\`.\n- Files: \`component.html\` (template, \`{{slots}}\`), \`preview.html\` / \`preview.dark.html\` (JS-free), \`screenshot*.png\`.\n- CSS: \`tokens/css/huf-android/{fonts,tokens,components}.css\`; mirrored from \`ai.huf.mobile.theme.HufTheme\`.\n`);
}
const screenSpecs = [];
for (const s of SCREENS) {
  const cid = 'huf-android-screen-' + s.id; ids.push(cid);
  const dir = ROOT + 'components/' + cid + '/';
  const html = shell(s.body(), s.overlay ? s.overlay() : '').replace('data-ui="huf-android-device-shell"', `data-ui="${cid}"`);
  W(dir + 'component.html', html + '\n');
  for (const m of modes) W(dir + (m === 'light' ? 'preview.html' : 'preview.dark.html'), page(cid, s.name, html, m === 'dark'));
  W(dir + 'slots.json', JSON.stringify({ component: cid, slots: {}, note: 'Full screen composed from huf-android-* components; change text in the component slots (see composedOf).', composedOf: [...new Set([...html.matchAll(/data-ui="(huf-android-[a-z-]+)/g)].map((x) => x[1]))].filter((x) => x !== cid) }, null, 1));
  W(dir + 'states.json', JSON.stringify({ component: cid, states: { default: { applicable: true, mechanism: 'none' } } }, null, 1));
  W(dir + 'harness.json', JSON.stringify({ id: cid, name: s.name, group: 'huf-android', kind: 'static-html', modes, css: CSS, cssBase: '../../tokens/css/huf-android/', darkTheme: 'html[data-theme="dark"]', viewport: { w: 412, h: 892, dpr: 2.621 }, ref: s.ref ? `systems/huf-android/ref/${s.ref}.light.png` : null }, null, 1));
  W(dir + 'README.md', `# ${cid}\n\n${s.name}\n\nFull Android screen (412x892 dp, Pixel 5). ${s.ref ? 'Reference: `systems/huf-android/ref/' + s.ref + '.{light,dark}.png`; see `systems/huf-android/ref-compare.json`.' : 'Authored from the Compose source and iOS parity; no emulator reference (`ref: null`).'}\n\nLight + dark previews. English, fictional data.\n`);
  screenSpecs.push({ id: cid, name: s.name, ref: s.ref ? { light: s.refLightInvalid ? null : `systems/huf-android/ref/${s.ref}.light.png`, dark: fs.existsSync(ROOT + `systems/huf-android/ref/${s.ref}.dark.png`) ? `systems/huf-android/ref/${s.ref}.dark.png` : null } : null, screen: true });
}
const specs = [...Object.entries(C).map(([cid, c]) => ({ id: cid, name: c.name, screen: false, ref: null })), ...screenSpecs].map((s) => ({ ...s, group: 'huf-android', kind: 'static-html', css: CSS.map((f) => 'huf-android/' + f), viewport: { w: 412, h: 892 }, modes, root: `[data-ui="${s.id}"]`, preview: `components/${s.id}/preview.html` }));
W(ROOT + 'scripts/specs-huf-android.mjs', `// huf-android specs (generated by scripts/huf-mobile/build-android.mjs). Hand-authored static HTML (no live app): capture = render
// components/<id>/preview*.html at the Pixel 5 viewport. \`ref\` = emulator screenshot (null when the screen is authored from Compose source).
export const specs = ${JSON.stringify(specs, null, 1)};
`);
console.log('components', Object.keys(C).length, 'screens', SCREENS.length);
