// Gateway area fixtures: /gateways (Gateway doctype + pending access), /gateways/<setting> and /integrations
// (Integration Settings + Integration Service), and the Channels app home/rail for every channel
// (fixes the Channels Home crash: get_number_summary and list_conversations answered with real shapes).
// Data: data/huf/gateway.json (fictional: Northwind Trading). Install AFTER 'whatsapp' so these routes win.
import fs from 'fs';

export async function install(page, { json, args, ROOT }) {
  const d = JSON.parse(fs.readFileSync(ROOT + 'data/huf/gateway.json', 'utf8'));
  const TABLES = { 'Gateway': d.gateways, 'Integration Settings': d.settings, 'Integration Service': d.services };
  const like = (v, p) => String(v ?? '').toLowerCase().includes(String(p).replace(/%/g, '').toLowerCase());
  const test = (row, [f, op, v]) => op === '=' ? String(row[f] ?? '') === String(v) : op === '!=' ? String(row[f] ?? '') !== String(v) : op === 'like' ? like(row[f], v) : op === 'in' ? [].concat(v).map(String).includes(String(row[f])) : true;
  const norm = (f) => (Array.isArray(f) ? f : f && typeof f === 'object' ? Object.entries(f).map(([k, v]) => (Array.isArray(v) ? [k, ...v] : [k, '=', v])) : []).map((x) => (x.length === 4 ? x.slice(1) : x));
  const asJson = (v) => (typeof v === 'string' && /^[[{]/.test(v) ? JSON.parse(v) : v);

  await page.route('**/api/resource/**', (r) => {
    const u = new URL(r.request().url());
    const parts = u.pathname.split('/').slice(3).map(decodeURIComponent);
    const rows = TABLES[parts[0]];
    if (!rows) return r.fallback();
    if (r.request().method() !== 'GET') return json(r, { data: {} });
    if (parts[1]) {
      const doc = rows.find((x) => x.name === parts[1]);
      if (!doc) return json(r, { exc_type: 'DoesNotExistError', exception: `${parts[0]} ${parts[1]} not found` }, 404);
      const full = { doctype: parts[0], ...doc };
      if (parts[0] === 'Integration Service') full.required_credentials = JSON.stringify(doc.required_credentials || []);
      return json(r, { data: full });
    }
    const a = args(r.request());
    const filters = norm(asJson(a.filters)), ors = norm(asJson(a.or_filters));
    let out = rows.filter((x) => filters.every((f) => test(x, f)) && (!ors.length || ors.some((f) => test(x, f))));
    if (parts[0] === 'Integration Service') out = out.map((s) => ({ ...s, required_credentials: JSON.stringify(s.required_credentials || []) }));
    const s = +(a.limit_start || 0), n = +(a.limit_page_length || a.limit || 1000);
    return json(r, { data: out.slice(s, s + n) });
  });

  const m = (name, fn) => page.route(`**/api/method/${name}{,?*}`, (r) => json(r, { message: fn(args(r.request())) }));
  await m('frappe.client.get_count', (a) => { const rows = TABLES[a.doctype]; return rows ? rows.filter((x) => norm(asJson(a.filters)).every((f) => test(x, f))).length : 0; });
  await m('huf.ai.gateway_service.list_gateway_access_entries', (a) => d.access_entries.filter((e) => (!a.state || e.state === a.state) && (!a.gateway || e.gateway === a.gateway)));

  // Channels app: every channel in the rail, plus the WhatsApp home dashboard data.
  await m('huf.ai.channels.status_api.list_channel_gateways', () => [
    { name: 'Northwind Sales', provider: 'WhatsApp', channel: 'whatsapp', enabled: true, health: 'healthy', setup_stage: 'live' }, ...d.channel_gateways]);
  const C = d.conversation_counts;
  await m('huf.ai.channels.api.list_conversations', (a) => {
    const n = a.status === 'ai' ? C.ai : a.status === 'handed_off' ? C.handed_off : C.all;
    return { items: Array.from({ length: Math.min(n, +(a.limit || 100)) }, (_, i) => ({ name: `CONV-${i}`, gateway: a.gateway, contact_handle: null, contact_name: null, status: a.status || 'ai', last_message_preview: null, modified: '2026-01-01 08:00:00', within_24h: true })), has_more: n > +(a.limit || 100) };
  });
  await m('huf.ai.solutions.read_models.get_number_summary', () => d.number_summary);
  // WhatsApp home: same live gateway as the whatsapp fixture, plus a recent token check (TokenCard) and the number summary.
  await m('huf.ai.whatsapp.management.get_setup_status', (a) => (a.gateway_name ? { success: true, connector_available: true, accounts: [], gateway: d.whatsapp_status }
    : { success: true, connector_available: true, accounts: [], gateways: [{ name: d.whatsapp_status.name, health: 'healthy', enabled: true, setup_stage: 'live' }] }));
  await m('huf.ai.channels.embedded_signup.get_signup_config', () => d.signup_config);
  await installChannelTab(page, { json, args, d });
}

/** Channel tab of a gateway (/gateways/<setting>#channel): routing rules, health, Slack setup, linked people, readiness. */
export async function installChannelTab(page, { json, args, d }) {
  const m = (name, fn) => page.route(`**/api/method/${name}{,?*}`, (r) => json(r, { message: fn(args(r.request())) }));
  const gw = (n) => d.gateways.find((g) => g.name === n) || d.gateways[0];
  await m('huf.ai.gateways.bindings_api.list_bindings', (a) => d.bindings[a.gateway] || []);
  await m('huf.ai.gateways.health.get_gateway_health', (a) => { const g = gw(a.gateway_name); return { gateway: g.name, status: { enabled: !!g.is_enabled, provider: g.provider, last_event_at: g.last_event_at || null, last_error: g.last_error || null }, ...d.health }; });
  await m('huf.ai.gateways.slack.identity.list_identity_links', (a) => d.identity_links.filter((l) => l.gateway === a.gateway));
  await m('huf.ai.gateways.slack.setup.get_slack_setup_status', () => d.slack_setup);
  await m('huf.ai.gateway_service.preview_gateway_readiness', (a) => { const g = gw(a.gateway_name); const checks = [
    { id: 'credentials', label: 'Credentials connected', done: !!g.integration_settings, hint: null },
    { id: 'route-target', label: 'Route target set', done: !!g.default_target_type, hint: null },
    { id: 'enabled', label: 'Gateway enabled', done: !!g.is_enabled, hint: null }];
    const blocking = checks.filter((c) => !c.done).length; return { ready: !blocking, blocking_count: blocking, checks }; });
}
