// Settings area (HUF pre-develop): members, roles & access, role editor, agent defaults, general, developer (API keys).
// Fixtures: scripts/huf/fixtures/settings.mjs + data/huf/settings.json (fictional Northwind Trading).
import fs from 'fs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/settings.json', import.meta.url), 'utf8'));
const FX = ['agents', 'settings'];
const DIALOG = '[role="dialog"]';
const PAD = { l: 32, t: 32, r: 32, b: 48 };
const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts; not captured' };
const settle = (p, ms = 350) => p.waitForTimeout(ms);
const click = async (p, sel) => { await p.locator(sel).first().click(); await settle(p); };
const fill = async (p, sel, v) => { const l = p.locator(sel).first(); await l.fill(v); await l.blur(); await settle(p, 120); };
const rest = async (p) => { await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(0, 0); await p.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(p); };

const openInvite = async (p) => { await click(p, 'main button:has-text("Invite user")'); await p.waitForSelector(DIALOG); await settle(p); };
const fillInvite = async (p) => {
  await openInvite(p);
  await fill(p, `${DIALOG} input[placeholder="jane@example.com"]`, D.invite.email);
  await fill(p, `${DIALOG} input[placeholder="Jane Doe"]`, D.invite.full_name);
  await click(p, `${DIALOG} button:has-text("Select a role")`);
  await click(p, `[role="menuitem"]:has-text("${D.invite.role}")`);
  await p.mouse.move(0, 0); await settle(p);
};
const expand = (...labels) => async (p) => { for (const l of labels) await click(p, `main button:has-text("${l}")`); await rest(p); };
const caps = (names) => async (p) => { // open the capability combobox and tick nothing; just show the page
  await rest(p);
};

const members = (what) => [`Members page of the HUF admin app for the fictional supplier Northwind Trading: People / Roles & access switcher, ${what}.`, 'Establishing shot for any access-control story; people and roles come from data/huf/settings.json.'];
const roles = (what) => [`Members > Roles & access: capability matrix comparing the four Northwind roles (Huf Admin, Builder, Viewer and the custom Support Lead) across eight capability groups; ${what}.`, 'System roles carry a lock icon; click a group to reveal the underlying permission keys.'];

export const specs = [
  // ---- members ---------------------------------------------------------------------------------------------
  { id: 'huf-members-people', name: 'Members page, People tab (8 people with roles and status)', url: '/members', root: '#root', fixtures: FX,
    waitFor: 'text=Daniel Okafor', prepare: rest,
    describe: members('search, status filter, Invite user button and the people table (avatar initials, role pill with menu, Active/Disabled status, row actions)'),
    targets: { search: 'input[placeholder^="Search people"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)', description: 'row hover' }, focus: { target: 'search' } },
    na: { ...PAGE_NA, empty: 'filtered-empty is a plain "No users found" card; not captured' },
    slotNames: { 'main tbody tr td:first-child .font-medium': 'person_name', 'main tbody tr td:first-child .text-xs': 'person_email' } },
  { id: 'huf-members-invite', name: 'Invite user dialog, filled (email, name, role)', url: '/members', root: DIALOG, pad: PAD, fixtures: FX,
    waitFor: 'text=Daniel Okafor', prepare: fillInvite,
    describe: ['Invite user dialog from the Members page: email, full name and a role picker; the chosen role\'s description appears under the picker.', 'Radix dialog captured on its own; place over huf-members-people for the full story.'],
    targets: { send: `${DIALOG} button.bg-ink` }, states: { hover: { target: 'send' }, focus: { target: 'send' } },
    na: { active: 'n/a', disabled: 'n/a', error: 'validation is a toast', loading: 'busy label flashes', empty: 'n/a' },
    slotNames: { [`${DIALOG} h2`]: 'title', [`${DIALOG} p.text-\\[11px\\]`]: 'role_description' } },
  { id: 'huf-members-disable', name: 'Disable user confirmation (alert dialog)', url: '/members', root: '[role="alertdialog"]', pad: PAD, fixtures: FX,
    waitFor: 'text=Daniel Okafor',
    prepare: async (p) => { await click(p, 'main tbody tr:nth-child(2) button[aria-label="User actions"]'); await click(p, '[role="menuitem"]:has-text("Disable user")'); await p.waitForSelector('[role="alertdialog"]'); await p.mouse.move(0, 0); await settle(p); },
    describe: ['Confirmation shown before a member is disabled ("This user will lose access to Huf immediately.").'],
    targets: { confirm: '[role="alertdialog"] button.bg-ink' }, states: { hover: { target: 'confirm' }, focus: { target: 'confirm' }, active: { target: 'confirm' } }, na: { disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' },
    slotNames: { '[role="alertdialog"] h2': 'title', '[role="alertdialog"] p': 'body' } },

  // ---- roles ----------------------------------------------------------------------------------------------
  { id: 'huf-roles-matrix', name: 'Roles & access matrix (4 roles x 8 capability groups)', url: '/members?view=roles', root: '#root', fixtures: FX,
    waitFor: 'text=Support Lead', prepare: rest,
    describe: roles('collapsed'),
    targets: { create: 'main button.shrink-0' }, states: { hover: { target: 'create' }, focus: { target: 'create' } },
    na: { ...PAGE_NA, empty: 'plain "No roles found" text; not captured' } },
  { id: 'huf-roles-matrix-expanded', name: 'Roles & access matrix with Agents and Users & roles groups expanded (permission keys)', url: '/members?view=roles', root: '#root', fixtures: FX,
    waitFor: 'text=Support Lead', prepare: expand('Agents', 'Users & roles'),
    describe: roles('two groups expanded to show the permission keys behind each level (mono text, key count)'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-roles-matrix', focus: 'see huf-roles-matrix', active: 'see huf-roles-matrix', empty: 'n/a' } },
  { id: 'huf-roles-edit', name: 'Role editor, custom role Support Lead (description + capability picker)', url: '/roles/Support%20Lead', root: '#root', fixtures: FX,
    waitFor: 'h1:has-text("Support Lead")', prepare: rest,
    describe: ['Role editor for the custom role "Support Lead": name (locked), description and the capability multi-select with the granted capabilities shown as chips; Save changes.', 'System roles open the same page read-only with a lock.'],
    targets: { desc: 'textarea' }, states: { focus: { target: 'desc' } }, na: { ...PAGE_NA, hover: 'n/a', active: 'n/a', empty: 'see huf-roles-new' },
    slotNames: { 'h1': 'role_name', 'textarea': 'role_description' } },
  { id: 'huf-roles-new', name: 'New role, filled (Warehouse Planner)', url: '/roles/new', root: '#root', fixtures: FX,
    waitFor: 'h1:has-text("New role")',
    prepare: async (p) => { await fill(p, 'input[placeholder="e.g. Support Lead"]', D.newRole.name); await fill(p, 'textarea', D.newRole.description); await rest(p); },
    describe: ['New role form filled with "Warehouse Planner": name, description and capability picker.'],
    states: {}, na: { ...PAGE_NA, hover: 'n/a', focus: 'see huf-roles-edit', active: 'n/a', empty: 'n/a' } },

  // ---- settings --------------------------------------------------------------------------------------------
  { id: 'huf-settings-code-skills', name: 'Settings: Code and skills (flow code switch, skill sources)', url: '/settings', root: '#root', fixtures: FX,
    waitFor: 'text=Skill sources', prepare: rest,
    describe: ['Settings landing page "Code and skills": the "Allow code in flows" switch (on) and the Skill sources list with the built-in huf-skills source and one team source, plus Save.', 'Only system administrators can change these; others see a read-only version.'],
    states: {}, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-settings-general', name: 'General settings (personalization)', url: '/settings/general', root: '#root', fixtures: FX,
    waitFor: 'text=General settings', prepare: rest,
    describe: ['General settings: personalization options for the HUF interface (scenery background, opacity, demo-data tools).'],
    states: {}, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-settings-developer', name: 'Developer settings: agent API docs and API keys', url: '/settings/developer', root: '#root', fixtures: FX,
    waitFor: 'text=Storefront chat widget', prepare: rest,
    describe: ['Developer page: agent API reference and the API keys table (label, status, scopes, expiry, last used) with Create key.', 'Keys are fictional (hk_ ids); the secret is never shown after creation.'],
    states: {}, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'see ?demo=empty (no keys)' } },
  { id: 'huf-settings-developer-create-key', name: 'Create API key dialog, filled', url: '/settings/developer', root: DIALOG, pad: PAD, fixtures: FX,
    waitFor: 'text=Storefront chat widget',
    prepare: async (p) => { await click(p, 'main button:has-text("Create key")'); await p.waitForSelector(DIALOG); await fill(p, '#api-key-label', D.newKey.label);
      for (const s of D.newKey.scopes) await click(p, `${DIALOG} [id="scope-${s}"]`); await p.mouse.move(0, 0); await settle(p); },
    describe: ['Create key dialog: name, access (all or selected agents), permission checkboxes and expiration.'],
    states: {}, na: { hover: 'n/a', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' },
    slotNames: { '#api-key-label': 'key_name' } },
];
