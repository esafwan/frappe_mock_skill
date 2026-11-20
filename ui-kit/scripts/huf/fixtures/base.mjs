// Base fixtures, always installed: a port of HUF's own offline e2e mocks (frontend/e2e/helpers.ts mockOfflineApis)
// with a fictional demo identity. Catch-alls first (lowest precedence), specifics after.
// Data lives in data/huf/identity.json so videos can swap the signed-in user without touching code.
import fs from 'fs';
export async function install(page, { json, ROOT }) {
  const id = JSON.parse(fs.readFileSync(ROOT + 'data/huf/identity.json', 'utf8'));
  const isDoc = (u) => /\/api\/resource\/[^/?]+\/[^/?]+/.test(u);
  await page.route('**/api/resource/**', (r) => json(r, { data: r.request().method() === 'GET' && !isDoc(r.request().url()) ? [] : {} }));
  await page.route('**/api/method/**', (r) => json(r, { message: [] }));
  await page.route('**/api/method/huf.ai.flow.listing.cards.list_flow_cards**', (r) => json(r, { message: { items: [], total: 0 } }));
  await page.route('**/api/method/huf.ai.flow.listing.cards.list_flow_categories**', (r) => json(r, { message: [] }));
  await page.route('**/huf/stream/ping', (r) => json(r, { ok: true }));
  await page.route('**/api/method/frappe.auth.get_logged_user**', (r) => json(r, { message: id.user }));
  await page.route('**/api/resource/User/**', (r) => json(r, { data: { name: id.user, email: id.user, full_name: id.full_name, user_image: null } }));
  await page.route('**/api/method/huf.permissions.get_me**', (r) => json(r, { message: { user: id.user, full_name: id.full_name, huf_role: id.huf_role, capabilities: id.capabilities } }));
  await page.route('**/api/method/frappe.client.get_count**', (r) => json(r, { message: 0 }));
  await page.route('**/api/method/huf.ai.agent.run_analytics_api.get_execution_analytics**', (r) => json(r, { message: {
    summary: { run_count: 0, success_count: 0, failed_count: 0, input_tokens: 0, output_tokens: 0, cached_tokens: 0, total_cost: 0, duration_ms_sum: 0, duration_count: 0, success_rate: null, average_duration_ms: null, cache_ratio: null },
    series: [], breakdowns: [], metadata: { granularity: 'hour', freshness: null, source: 'scheduled_rollup' } } }));
}
