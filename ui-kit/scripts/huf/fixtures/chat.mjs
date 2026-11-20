// Chat area fixtures: chat agents + providers (agent picker), conversations (rail recents), Agent Message history
// (persisted "Tool Result" rows grouped into a tool group, grounded markdown answer, frappe-report artifact),
// conversation artifacts (Outputs card), conversation analytics (context pane), projects, the Apps launcher,
// and the agent editor's voice + advanced (context) sections layered over the agents-editor fixture.
// Data: data/huf/chat.json (fictional, Northwind Trading). Times are relative to the fixed capture clock.
// Page-level variants without extra fixture files: the page URL may carry ?demo=<variant>
//   demo=empty -> no conversations, projects or apps (empty rail / empty pages)
import fs from 'fs';

const icon = (bg, glyph) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="9" fill="${bg}"/>${glyph}</svg>`;
const W = 'fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
/** Fictional app icons for the Apps launcher (served from the fake origin; capture inlines them). */
export const ICONS = {
  'field-sales.svg': icon('#0F766E', `<path ${W} d="M12 27l6-6 4 4 7-8"/><path ${W} d="M24 17h5v5"/>`),
  'warehouse.svg': icon('#B45309', `<path ${W} d="M10 17l10-6 10 6v12H10z"/><path ${W} d="M15 29v-7h10v7"/>`),
  'helpdesk.svg': icon('#4F46E5', `<path ${W} d="M11 22v-3a9 9 0 0118 0v3"/><rect x="9" y="21" width="5" height="7" rx="2" fill="#fff"/><rect x="26" y="21" width="5" height="7" rx="2" fill="#fff"/>`),
  'supplier-portal.svg': icon('#BE123C', `<rect x="10" y="15" width="14" height="11" rx="1.5" ${W}/><path ${W} d="M24 19h4l3 4v3h-7"/><circle cx="15" cy="28" r="2" fill="#fff"/><circle cx="27" cy="28" r="2" fill="#fff"/>`),
  'insights.svg': icon('#1D4ED8', `<path ${W} d="M12 29V19M20 29V12M28 29v-6"/>`),
  'recipes.svg': icon('#7A5AF0', `<path ${W} d="M13 11h12l3 3v15H13z"/><path ${W} d="M17 18h8M17 22h8M17 26h5"/>`),
};

export function load(ROOT) { return JSON.parse(fs.readFileSync(ROOT + 'data/huf/chat.json', 'utf8')); }

export async function install(page, { json, args, ROOT }) {
  const D = load(ROOT);
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const rx = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}(\\?|$)`);
  const rxDoc = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}/([^/?]+)`);
  const docName = (r) => decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
  const filterVal = (a, field) => { const f = (Array.isArray(a.filters) ? a.filters : []).find((x) => x[0] === field || x[1] === field); return f ? f[f.length - 1] : undefined; };
  const ok = (r, m) => json(r, { message: m });
  const on = (method, fn) => page.route(`**/api/method/${method}{,?*}`, (r) => ok(r, fn(args(r.request()))));

  const agentDoc = (a) => ({ doctype: 'Agent', allow_chat: 1, disabled: 0, show_tool_execution_details: 1, allow_file_upload: 1, max_upload_size_mb: 25, run_immediately: 0, autonaming_of_conversation_title: 1, modified: '2025-12-30 10:00:00', ...a });
  const report = JSON.stringify({ ...D.report, mode: 'report' });

  // agents (picker + header identity) and the providers that keep them visible in the picker.
  // On agent editor pages (/agents/...) these defer to fixtures/agents(-editor).mjs.
  const inEditor = () => { try { return new URL(page.url()).pathname.startsWith('/huf/agents'); } catch { return false; } };
  await page.route(rx('AI Provider'), (r) => (inEditor() ? r.fallback() : json(r, { data: D.providers })));
  await page.route(rx('Agent'), (r) => (inEditor() ? r.fallback() : json(r, { data: D.agents.map(agentDoc) })));
  await page.route(rxDoc('Agent'), (r) => { if (inEditor()) return r.fallback(); const a = D.agents.find((x) => x.name === docName(r)); return a ? json(r, { data: agentDoc(a) }) : json(r, { exc_type: 'DoesNotExistError' }, 404); });

  // conversations: rail recents + single doc
  await page.route(rx('Agent Conversation'), (r) => json(r, { data: demo() === 'empty' ? [] : D.conversations }));
  await page.route(rxDoc('Agent Conversation'), (r) => { const c = D.conversations.find((x) => x.name === docName(r)); return c ? json(r, { data: { doctype: 'Agent Conversation', ...c } }) : json(r, { exc_type: 'DoesNotExistError' }, 404); });

  // messages, newest first (the app reverses them)
  await page.route(rx('Agent Message'), (r) => {
    const a = args(r.request()); const conv = filterVal(a, 'conversation');
    const rows = (D.messages[conv] || []).map((m) => ({ conversation: conv, status: '', modified: m.creation, ...m,
      tool_args: m.tool_args ? JSON.stringify(m.tool_args) : undefined, content: m.content.replace('__REPORT__', report) }));
    return json(r, { data: rows.slice().reverse() });
  });

  // artifacts, analytics
  await on('huf.ai.artifact_api.list_conversation_artifacts', (a) => D.artifacts[a.conversation] || []);
  await on('huf.ai.agent.conversation_analytics_api.get_conversation_analytics', (a) => D.analytics[a.conversation] || D.analytics['CONV-0001']);

  // projects
  await on('huf.ai.project_api.list_projects', () => (demo() === 'empty' ? [] : D.projects));
  await on('huf.ai.project_api.get_project', (a) => D.projects.find((p) => p.name === a.project) || D.projects[0]);
  await on('huf.ai.project_api.get_pinned_conversations', () => []);

  // apps launcher + its icons
  await on('huf.ai.apps_api.get_huf_apps', () => ({ apps: demo() === 'empty' ? [] : D.apps }));
  await page.route('**/assets/northwind/*.svg', (r) => { const f = new URL(r.request().url()).pathname.split('/').pop(); return ICONS[f] ? r.fulfill({ status: 200, contentType: 'image/svg+xml', body: ICONS[f] }) : r.fulfill({ status: 404, body: '' }); });

  // agent editor: voice engines + schema, and the voice / advanced sections (layered over fixtures/agents-editor.mjs)
  const V = D.voice;
  await on('huf.ai.voice.api.list_engines', () => V.engines);
  await on('huf.ai.voice.api.get_config_schema', () => V.schema);
  const edPath = ROOT + 'data/huf/agents-editor.json';
  if (fs.existsSync(edPath)) {
    const E = JSON.parse(fs.readFileSync(edPath, 'utf8'));
    const { engines, schema, ...voiceValues } = V;
    const extra = { voice: voiceValues, advanced: D.advanced };
    await page.route('**/api/method/huf.ai.agent.config_api.get_agent_section**', (r) => {
      const a = args(r.request());
      return json(r, { message: { name: E.agent, section: a.section, modified: E.modified, values: { ...(E.sections[a.section] || {}), ...(extra[a.section] || {}) } } });
    });
  }
}
