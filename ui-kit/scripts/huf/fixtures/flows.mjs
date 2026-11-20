// Flows area fixtures: flow list cards, one full flow definition (graph IR), runs. Data: data/huf/flows.json (fictional "Harbor Goods").
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const d = JSON.parse(fs.readFileSync(ROOT + 'data/huf/flows.json', 'utf8'));
  const m = (name, fn) => page.route(`**/api/method/${name}**`, (r) => json(r, { message: fn(args(r.request())) }));
  await m('huf.ai.flow.listing.cards.list_flow_cards', (a) => {
    let items = d.cards;
    if (a.search) items = items.filter((c) => c.flow_name.toLowerCase().includes(String(a.search).toLowerCase()));
    if (a.status) items = items.filter((c) => c.status === a.status);
    if (a.category) items = items.filter((c) => c.category.toLowerCase() === String(a.category).toLowerCase());
    return { items, total: items.length };
  });
  await m('huf.ai.flow.listing.cards.list_flow_categories', () => d.categories);
  await m('huf.ai.flow.api.get_flow_definition', (a) => d.flows[a.flow_id] || null);
  await m('huf.ai.flow.api.get_flow_run', (a) => d.runs[a.flow_run_id] || null);
  await m('huf.ai.flow.api.list_flow_runs', (a) => d.run_list.filter((r) => !a.flow_id || r.flow_id === a.flow_id));
  await m('huf.ai.flow.api.get_site_timezone', () => 'UTC');
  // "Use data" picker: the trigger plus every step upstream of the asked node that offers data.
  await m('huf.ai.flow.catalog.api.get_data_catalog', (a) => {
    const nodes = d.flows[a.flow_id]?.definition_json.nodes || [];
    const succ = (n) => [n.next, n.on_error, ...Object.entries(n.config || {}).filter(([k]) => /(^on_|_next$)/.test(k)).map(([, v]) => v)].filter(Boolean);
    const up = new Set(); let grew = true; const target = new Set([a.node_id]);
    while (grew) { grew = false; for (const n of nodes) if (!up.has(n.id) && succ(n).some((s) => target.has(s))) { up.add(n.id); target.add(n.id); grew = true; } }
    const order = nodes.map((n) => n.id);
    return { flow_id: a.flow_id, node_id: a.node_id, trigger: d.catalog.trigger, loop: null,
      steps: order.filter((id) => up.has(id) && d.catalog.steps[id]).map((id) => d.catalog.steps[id]) };
  });
  const reg = JSON.parse(fs.readFileSync(ROOT + 'data/huf/flows-gateway-registry.json', 'utf8')); delete reg.$comment;
  await m('huf.ai.flow.gateways.api.get_gateway_trigger_registry', () => reg);
  await m('huf.ai.flow.integrations.get_flow_integration_status', () => ({}));
  await m('huf.ai.flow.code_node.get_code_flow_status', () => ({ server_switch: false, allowed: false, enabled: false, can_execute: false, can_manage: false, available: false, max_code_bytes: 0, default_profile: '', default_timeout_s: 0, profiles: [] }));
  await page.route('**/api/resource/Flow%20Definition?**', (r) => json(r, { data: Object.values(d.flows).map(({ definition_json, ...f }) => ({ name: f.flow_id, modified: '2026-01-01 08:12:00', ...f })) }));
}
