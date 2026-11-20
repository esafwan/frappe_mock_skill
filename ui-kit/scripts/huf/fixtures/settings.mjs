// Settings area fixtures: members (get_users / invite), roles (get_huf_roles / catalogue), Agent Settings doc,
// AI Provider / AI Model lists, API keys. Data: data/huf/settings.json (fictional, Northwind Trading).
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/settings.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const M = '**/api/method/';
  await page.route(M + 'huf.ai.permissions_api.get_users**', (r) => json(r, { message: D.users }));
  await page.route(M + 'huf.ai.permissions_api.get_huf_roles**', (r) => json(r, { message: D.roles }));
  await page.route(M + 'huf.ai.permissions_api.get_capabilities_catalogue**', (r) => json(r, { message: D.catalogue }));
  await page.route(M + 'huf.ai.permissions_api.invite_user**', (r) => { const a = args(r.request()); return json(r, { message: { user: a.email, email: a.email, full_name: a.full_name, huf_role: a.huf_role, enabled: 1, invited_by: 'maya@example.com', invited_on: '2026-01-01 09:00:00' } }); });
  await page.route(M + 'huf.ai.flow.code_node.get_code_flow_status**', (r) => json(r, { message: D.codeStatus }));
  await page.route(/\/api\/resource\/Agent%20Settings\/Agent%20Settings/, (r) => json(r, { data: { name: 'Agent Settings', doctype: 'Agent Settings', ...D.settings } }));
  await page.route(/\/api\/resource\/AI%20Provider(\?|$)/, (r) => json(r, { data: D.providers }));
  await page.route(/\/api\/resource\/AI%20Model(\?|$)/, (r) => { const a = args(r.request()); const f = JSON.stringify(a.filters || ''); return json(r, { data: D.models.filter((m) => !f.includes('"provider"') || f.includes(m.provider)).map((m) => ({ ...m, is_active: 1 })) }); });
  await page.route(M + 'huf.huf.doctype.huf_api_key.huf_api_key.list_api_keys**', (r) => json(r, { message: demo() === 'empty' ? [] : D.apiKeys }));
}
