// Agent editor fixtures (Order Status Bot): config sections, providers/models, tools, MCP, knowledge. Data: data/huf/agents-editor.json (fictional).
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const d = JSON.parse(fs.readFileSync(ROOT + 'data/huf/agents-editor.json', 'utf8'));
  const rx = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}(\\?|$)`);
  const rxDoc = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}/([^/?]+)`);
  // identity.json (shared) lacks agent.create, which the create flow needs: re-answer get_me with it added.
  const id = JSON.parse(fs.readFileSync(ROOT + 'data/huf/identity.json', 'utf8'));
  const caps = id.capabilities.includes('agent.create') ? id.capabilities : [...id.capabilities, 'agent.create'];
  await page.route('**/api/method/huf.permissions.get_me**', (r) => json(r, { message: { user: id.user, full_name: id.full_name, huf_role: id.huf_role, capabilities: caps } }));
  await page.route(rx('AI Provider'), (r) => json(r, { data: d.providers }));
  await page.route(rx('AI Model'), (r) => json(r, { data: d.models }));
  await page.route(rx('Agent Tool Type'), (r) => json(r, { data: d.toolTypes }));
  await page.route(rx('Agent Tool Function'), (r) => {
    const a = args(r.request()); const f = (a.filters || []).find((x) => x[0] === 'name' && x[1] === 'in');
    return json(r, { data: f ? d.toolFunctions.filter((t) => f[2].includes(t.name)) : d.toolFunctions });
  });
  await page.route(rxDoc('MCP Server'), (r) => { const n = decodeURIComponent(r.request().url().match(/MCP(?:%20| )Server\/([^/?]+)/)[1]); return json(r, { data: d.mcpServers[n] || {} }); });
  await page.route(rx('Knowledge Input'), (r) => json(r, { data: d.knowledgeCounts }));
  await page.route(rx('Knowledge Source'), (r) => json(r, { data: d.knowledgeSources }));
  await page.route('**/api/method/huf.ai.agent.agent_form_api.get_workspace_default_model**', (r) => json(r, { message: d.workspaceDefault }));
  await page.route('**/api/method/huf.ai.agent.config_api.get_agent_section**', (r) => {
    const a = args(r.request()); return json(r, { message: { name: d.agent, section: a.section, modified: d.modified, values: d.sections[a.section] || {} } });
  });
}
