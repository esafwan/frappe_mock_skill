// Registry of every menu_open target: default items and layout kind. Data only; markup is drawn by shell/menus.mjs.
// Generic: labels are v16 desk chrome, never doctype/app/brand names. Parametric ids take an argument ("prefix:arg").
// kind: menu (dropdown list) | search (query box + results) | panel (notifications) | switcher (header) | picker (grid of blocks) | ui (escape hatch)
const L = (label, extra = {}) => ({ label, ...extra });
const D = { divider: true };

export const MENU_ENTRIES = [
  { id: 'page.menu', kind: 'menu', items: () => [L('Print', { icon: 'printer', shortcut: 'Ctrl+P' }), L('Email', { icon: 'mail' }), D, L('Duplicate', { shortcut: 'Ctrl+D' }), L('Reload'), L('Jump to field', { shortcut: 'Ctrl+J' }), D, L('Links'), L('Customize'), L('Delete', { danger: true })] },
  { id: 'form.menu', kind: 'menu', items: () => [L('Undo', { shortcut: 'Ctrl+Z' }), L('Redo', { shortcut: 'Ctrl+Y' }), D, L('Print'), L('Email'), L('Duplicate'), L('Rename'), L('Reload'), L('Customize'), D, L('Delete', { danger: true })] },
  { id: 'page.actions', kind: 'menu', items: () => [L('Edit'), L('Export'), L('Assign To'), L('Apply Assignment Rule'), L('Add Tags'), L('Print'), L('Delete', { danger: true })] },
  { id: 'page.primary', kind: 'menu', items: () => [L('Save', { shortcut: 'Ctrl+S' }), L('Save and Close'), L('Save as Draft')] },
  { id: 'page.view_switcher', kind: 'menu', items: () => [L('List', { icon: 'list', checked: true }), L('Report', { icon: 'file-text' }), L('Dashboard', { icon: 'layout-dashboard' }), L('Kanban', { icon: 'columns-3' }), L('Calendar', { icon: 'calendar' }), L('Gantt', { icon: 'chart-gantt' }), L('Image', { icon: 'image' }), L('Map', { icon: 'map' })] },
  { id: 'page.sort', kind: 'menu', items: (a, o) => [L('Last Updated On', { checked: true }), L('Name'), L('Created On'), L('Status'), D, L(o.desc === false ? 'Ascending' : 'Descending', { icon: 'arrow-down-up' })] },
  { id: 'page.group_by', kind: 'menu', items: () => [L('Assigned To'), L('Created By'), L('Status'), L('Edit Group By Fields...')] },
  { id: 'page.filter', kind: 'menu', items: () => [L('Add a Filter', { icon: 'plus' }), L('Clear Filters'), L('Save Filter')] },
  { id: 'page.settings', kind: 'menu', items: () => [L('Pick Columns'), L('Reset Sorting'), L('Settings')] },
  { id: 'page.page_length', kind: 'menu', items: () => [L('20', { checked: true }), L('100'), L('500')] },
  { id: 'view-switcher', kind: 'menu', alias: 'page.view_switcher' },
  { id: 'page.views', kind: 'menu', items: () => [L('Default View', { checked: true }), L('Save View as...', { icon: 'plus' })] },
  { id: 'saved_views', kind: 'menu', alias: 'page.views' },
  { id: 'navbar.search', kind: 'search', items: (a, o) => [L(`Search for ${o.query || ''}`.trim(), { icon: 'search' }), L('Recent', { disabled: true }), L('Open')] },
  { id: 'navbar.notifications', kind: 'panel', items: () => [L('Notifications', { disabled: true }), L('Mark all as read', { icon: 'check-check' }), L('Settings', { icon: 'settings' })], tabs: ['Notifications', 'Events', 'Mentions'] },
  { id: 'notifications', kind: 'panel', alias: 'navbar.notifications' },
  { id: 'navbar.help', kind: 'menu', items: () => [L('About'), L('Keyboard Shortcuts', { shortcut: 'Ctrl+/' }), L('Documentation'), L('Report an Issue')] },
  { id: 'help', kind: 'menu', alias: 'navbar.help' },
  { id: 'navbar.user', kind: 'menu', items: () => [L('My Settings'), L('Session Defaults'), L('Reload'), L('View Website'), L('Apps'), L('Toggle Full Width'), L('Toggle Theme'), D, L('Log out', { icon: 'log-out' })] },
  { id: 'user', kind: 'menu', alias: 'navbar.user' },
  { id: 'sidebar.header', kind: 'switcher', items: () => [L('Switch App', { disabled: true }), L('Settings'), L('Edit Workspace Sidebar')] },
  { id: 'sidebar.user', kind: 'menu', alias: 'navbar.user' },
  { id: 'dock.more', kind: 'menu', items: () => [L('More apps', { disabled: true }), L('Customize Dock')] },
  { id: 'workspace.menu', kind: 'menu', items: () => [L('Edit', { icon: 'pencil' }), L('Reload'), L('Duplicate'), L('Delete', { danger: true })] },
  { id: 'workspace.block_picker', kind: 'picker', items: () => ['Header', 'Paragraph', 'Chart', 'Card', 'Shortcut', 'Number Card', 'Quick List', 'Spacer', 'Onboarding', 'Custom Block'].map((x) => L(x)) },
  { id: 'bulk-actions', kind: 'menu', items: () => [L('Edit'), L('Export'), L('Assign To'), L('Add Tags'), L('Print'), L('Delete', { danger: true })] },
  { prefix: 'button_group:', kind: 'menu', items: (a) => [L(`${a} item 1`), L(`${a} item 2`)] },
  { prefix: 'row_actions:', kind: 'menu', items: () => [L('Edit'), L('Duplicate'), L('Delete', { danger: true })] },
  { prefix: 'column:', kind: 'menu', items: () => [L('Sort Ascending', { icon: 'arrow-up' }), L('Sort Descending', { icon: 'arrow-down' }), D, L('Pin Column'), L('Hide Column'), L('Filter')] },
  { prefix: 'column-header:', kind: 'menu', alias: 'column:' },
  { id: 'column-header', kind: 'menu', alias: 'column:' },
  { prefix: 'field:', kind: 'menu', items: () => [L('Create a new'), L('Advanced Search')] },
  { prefix: 'chart:', kind: 'menu', items: () => [L('Refresh'), L('Edit'), L('Export'), L('Set Filters'), L('Reset Chart')] },
  { prefix: 'group_by:', kind: 'menu', items: () => [L('Me'), L('Assigned To'), L('Edit Group By Fields...')] },
  { prefix: 'ui:', kind: 'ui' },
];

const byId = new Map(MENU_ENTRIES.filter((e) => e.id).map((e) => [e.id, e]));
const prefixes = MENU_ENTRIES.filter((e) => e.prefix);

const entryFor = (e) => {
  let x = e; const seen = new Set();
  while (x?.alias && !seen.has(x)) { seen.add(x); x = byId.get(x.alias) || prefixes.find((p) => p.prefix === x.alias); }
  return x || e;
};

/** Resolve a menu_open target. Returns { entry, base, arg } or null. */
export function resolveTarget(target = '') {
  const t = String(target);
  const exact = byId.get(t);
  if (exact) return { entry: entryFor(exact), id: t, arg: '' };
  const p = prefixes.find((x) => t.startsWith(x.prefix));
  return p ? { entry: entryFor(p), id: p.prefix, arg: t.slice(p.prefix.length) } : null;
}

/** Default items for a target ([] for unknown/ui). `o` is the overlay ({query, desc, ...}). */
export function defaultItems(target, o = {}) {
  const r = resolveTarget(target);
  return r?.entry?.items ? r.entry.items(r.arg, o) : [];
}

/** One concrete, renderable target string per registry entry (parametric ones get a sample argument). */
export const sampleTargets = () => MENU_ENTRIES.map((e) => e.id || `${e.prefix}sample`);
