// Generates per-component README.md and manifest.json from the captured artefacts + descriptions below.
import fs from 'fs'; import path from 'path'; import { ROOT } from './lib.mjs';
const WHEN = {
  navbar: ['Top bar of the desk home: logo, global search (Ctrl/⌘K), notifications bell, avatar.', 'Use on desk landing / app-launcher scenes and any shot that needs the global search bar.'],
  sidebar: ['Left workspace sidebar: app switcher, search, notifications, workspace links and shortcuts.', 'Use as the persistent left rail for every desk page.'],
  'workspace-shortcuts': ['Workspace page body with shortcut and link cards.', 'Use when showing a module landing page (Selling, Stock …).'],
  'page-head': ['Page header: title/breadcrumbs, list-view switcher, menu button and the primary action button.', 'Use above any list; primary vs secondary button styles live here.'],
  'list-view': ['Standard list: filter bar, sort selector, header with select-all, rows with checkboxes and status pills, paging.', 'Use for any DocType list scene (Customers, Items, Invoices).'],
  'form-title': ['Form page head with title, status indicator pill, prev/next and Save.', 'Use for form scenes; change the status text/colour class for Draft/Paid/Overdue.'],
  'form-tabs': ['Form tab strip.', 'Use above form sections when the DocType has tabs.'],
  'form-section': ['A form section card with three columns of fields.', 'Use as the body of a form scene.'],
  'field-data': ['Data (text) field.', 'Use for names, codes, short text.'],
  'field-link': ['Link field with the open awesomplete suggestion list.', 'Use when demonstrating link search/autocomplete.'],
  'field-select': ['Select field.', 'Use for enumerations (Customer Type, Status).'],
  'field-check': ['Check (checkbox) field.', 'Use for boolean flags.'],
  'field-date': ['Date field.', 'Use for posting/due dates.'],
  'field-currency': ['Currency field.', 'Use for rates and amounts; swap currency via tools/render.mjs --currency.'],
  'field-table': ['Child table (grid) with rows.', 'Use for line items.'],
  'field-text-editor': ['Rich text editor field with toolbar.', 'Use for descriptions and notes.'],
  'menu-dropdown': ['Open “⋯” menu dropdown.', 'Use to show actions (Duplicate, Print, Email …).'],
  toast: ['Toast / desk alert shown after an action.', 'Use for success/failure feedback; change message and indicator class.'],
  alert: ['Inline form alert banner (form message).', 'Use for warnings and info on top of a form.'],
  'modal-dialog': ['Confirm/message modal dialog.', 'Use for confirm-delete, prompts and msgprint scenes.'],
  'comment-timeline': ['Comment box plus activity timeline.', 'Use at the bottom of forms for comments and audit trail.'],
  'report-view': ['Report view with datatable.', 'Use for tabular data scenes with sortable columns.'],
  'number-card': ['Dashboard number card.', 'Use for KPIs; change the number, label and delta.'],
  'dashboard-chart': ['Dashboard chart widget (SVG chart).', 'Use for trend/analytics scenes.'],
  'pos-item-grid': ['POS item grid of cards.', 'Use for the POS ordering screen; bind to data/menus for any cuisine.'],
  'pos-item-card': ['A single POS item card (photo, name, price).', 'Use for close-ups; bind to a menu item.'],
  'pos-category-tabs': ['POS category tab strip.', 'Use above the item grid; bind to menu categories.'],
  'pos-cart': ['POS cart lines and totals.', 'Use for order building; change items, qty and totals.'],
  'pos-table-picker': ['POS table picker.', 'Use at order start (dine-in).'],
  'pos-payment-dialog': ['POS payment dialog.', 'Use for the checkout/payment scene; currency follows the locale.'],
  'pos-kot-view': ['Kitchen order ticket list.', 'Use for kitchen/KOT scenes.'],
  'pos-order-status-chips': ['Order status chips.', 'Use to show Preparing/Ready/Served states.'],
  'pos-navbar': ['POS top bar.', 'Use at the top of every POS screen.'],
  'pos-bottom-nav': ['POS bottom navigation.', 'Use as the bottom tab bar.'],
};
const manifest = { name: 'ury-ui-kit', version: '1.0.0', viewport: { w: 1440, h: 900, deviceScaleFactor: 2 }, modes: ['light', 'dark', 'rtl'], systems: {}, components: {}, pages: {}, data: { menus: [], universals: 'data/universals/index.json' } };
const reg = JSON.parse(fs.readFileSync(ROOT + 'systems/registry.json')); manifest.systems = reg.systems; manifest.defaultSystem = reg.default;
for (const sid of Object.keys(reg.systems)) { const p = ROOT + reg.systems[sid].path; if (p.endsWith('.json') && fs.existsSync(p)) { const sj = JSON.parse(fs.readFileSync(p)); manifest.systems[sid] = { ...reg.systems[sid], name: sj.name, componentGroup: sj.componentGroup }; } }
const groupToSystem = { desk: 'frappe-desk', pos: 'ury-pos' };
for (const id of fs.readdirSync(ROOT + 'components').sort()) {
  const dir = ROOT + 'components/' + id + '/'; if (!['harness.json', 'measurements.json', 'slots.json', 'states.json', 'component.html'].every((f) => fs.existsSync(dir + f))) continue;
  const h = JSON.parse(fs.readFileSync(dir + 'harness.json')); const slots = JSON.parse(fs.readFileSync(dir + 'slots.json')).slots;
  const st = JSON.parse(fs.readFileSync(dir + 'states.json')).states; const ms = JSON.parse(fs.readFileSync(dir + 'measurements.json'));
  const states = Object.fromEntries(Object.entries(st).map(([k, v]) => [k, v.applicable ? (v.mechanism || 'yes') : 'n/a']));
  const bindable = fs.existsSync(dir + 'bindings.json');
  manifest.components[id] = { id, name: h.name, system: groupToSystem[h.group] || h.group, group: h.group, path: `components/${id}/`,
    files: { html: 'component.html', states: 'states.json', slots: 'slots.json', screenshot: 'screenshot.png', screenshotDark: 'screenshot.dark.png', screenshotRtl: 'screenshot.rtl.png', measurements: 'measurements.json', preview: 'preview.html' },
    size: { w: +h.size.w.toFixed(1), h: +h.size.h.toFixed(1) }, css: h.css, slotCount: Object.keys(slots).length, slots: Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, { type: v.type, sample: v.sample, maxLength: v.maxLength }])),
    states, targets: ms.elements.map(e => ({ id: e.id, tag: e.tag, interactive: e.interactive, box: { x: e.x, y: e.y, w: e.w, h: e.h } })), dataBindings: bindable ? `components/${id}/bindings.json` : null };
  // README
  const [what, when] = WHEN[id] || [h.name, 'Use when a scene needs this element.'];
  const rank = Object.entries(slots).filter(([, v]) => v.where === 'text' && v.sample.trim().length > 1).sort((a, b) => (b[1].type !== 'text') - (a[1].type !== 'text') || b[1].sample.length - a[1].sample.length).slice(0, 6);
  const readme = `# ${h.name}  \`${id}\`

${what}

**When to use:** ${when}

**Slots people usually change:** ${rank.map(([k, v]) => `\`${k}\` (${v.type}, e.g. "${v.sample.slice(0, 30)}")`).join(', ') || 'none'}. All ${Object.keys(slots).length} slots are in \`slots.json\`.

**States:** ${Object.entries(states).filter(([, v]) => v !== 'n/a').map(([k, v]) => `${k} (${v})`).join(', ')}. Details and class/attribute changes in \`states.json\`.

**Targeting:** root \`data-ui="${id}"\`; ${ms.elements.filter(e => e.interactive).length} interactive elements with measured boxes in \`measurements.json\` (e.g. ${ms.elements.filter(e => e.interactive).slice(0, 3).map(e => '`' + e.id + '`').join(', ') || 'none'}).

**Render:** \`node tools/render.mjs ${id} --locale ar-AE/AED --theme dark\` · open \`preview.html\` (JS-free). Needs ${h.css.join(', ')} from \`tokens/css/\` and the desk icon sprite (inlined in preview).
`;
  fs.writeFileSync(dir + 'README.md', readme);
}
for (const f of fs.existsSync(ROOT + 'data/menus') ? fs.readdirSync(ROOT + 'data/menus') : []) if (f.endsWith('.json')) { const m = JSON.parse(fs.readFileSync(ROOT + 'data/menus/' + f)); manifest.data.menus.push({ id: m.id, format: m.format, cuisine: m.cuisine, defaultCurrency: m.defaultCurrency, languages: m.languages, items: m.items.length, path: 'data/menus/' + f }); }
if (fs.existsSync(ROOT + 'pages')) for (const f of fs.readdirSync(ROOT + 'pages')) if (f.endsWith('.page.json')) { const p = JSON.parse(fs.readFileSync(ROOT + 'pages/' + f)); manifest.pages[p.id] = { id: p.id, title: p.title, system: p.system, html: `pages/${p.id}.html`, components: p.components }; }
fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest:', Object.keys(manifest.components).length, 'components', Object.keys(manifest.pages).length, 'pages', manifest.data.menus.length, 'menus');
await import('./manifest-la.mjs');
