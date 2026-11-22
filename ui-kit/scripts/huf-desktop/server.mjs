// The Huf server Huf Desktop is "connected" to, answered by Playwright routes from data/huf/desktop.json (server part).
// Shapes follow src/renderer/services/hufChatApi.ts (Frappe REST: {data:[...]} for /api/resource, {message:...} for /api/method).
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });

function filterOf(url, field) {
  try { const f = JSON.parse(new URL(url).searchParams.get('filters') || '[]'); const hit = f.find((x) => x[0] === field); return hit ? hit[2] : undefined; } catch { return undefined; }
}

export async function install(page, { data, spec, bridge }) {
  const S = data.server; const base = bridge.connection ? bridge.connection.url : null;
  if (!base) return;
  const debug = !!process.env.HUF_DESKTOP_DEBUG;
  // Catch-all for the server origin (lowest precedence among server routes): Frappe-shaped empty answers.
  await page.route(base + '/**', (route) => {
    const u = new URL(route.request().url());
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    if (u.pathname.includes('/socket.io')) return route.abort();
    if (debug) console.log('[server catch-all]', u.pathname + u.search.slice(0, 120));
    if (u.pathname.startsWith('/api/resource/')) return json(route, { data: [] });
    return json(route, { message: [] });
  });
  await page.route(base + '/huf/stream/ping', (route) => json(route, { ok: true }));
  await page.route(base + '/api/resource/Agent?*', (route) => json(route, { data: S.agents }));
  await page.route(base + '/api/resource/Agent/*', (route) => { const id = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop()); return json(route, { data: S.agents.find((a) => a.name === id) || S.agents[0] }); });
  await page.route(base + '/api/resource/Agent%20Conversation?*', (route) => json(route, { data: spec.emptyConversations ? [] : S.conversations }));
  await page.route(base + '/api/resource/Agent%20Message?*', (route) => { const c = filterOf(route.request().url(), 'conversation'); return json(route, { data: (S.messages[c] || []) }); });
  await page.route(base + '/api/method/huf.ai.artifact_api.list_conversation_artifacts*', (route) => { const c = new URL(route.request().url()).searchParams.get('conversation_id') || new URL(route.request().url()).searchParams.get('conversation'); return json(route, { message: (S.artifacts || {})[c] || [] }); });
  await page.route(base + '/api/method/huf.ai.artifact_api.get_artifact*', (route) => { const n = new URL(route.request().url()).searchParams.get('artifact_id') || new URL(route.request().url()).searchParams.get('name'); return json(route, { message: (S.artifactDocs || {})[n] || null }); });
}
