// Procedures + Automations fixtures. Data: data/huf/procedures.json (fictional "Northwind Trading").
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const d = JSON.parse(fs.readFileSync(ROOT + 'data/huf/procedures.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } }; // ?demo=empty -> empty lists
  const strip = ({ definition, ...p }) => ({ ...p, definition_json: JSON.stringify(definition) });
  const m = (name, fn) => page.route(`**/api/method/${name}**`, (r) => json(r, { message: fn(args(r.request())) }));
  await page.route('**/api/resource/Agent%20Procedure?**', (r) => {
    const a = args(r.request()); const f = a.filters || [];
    if (demo() === 'empty') return json(r, { data: [] });
    let rows = d.procedures.map(strip);
    const pid = f.find((x) => x[0] === 'procedure_id');
    if (pid) return json(r, { data: (d.versions[pid[2]] || []).map((v) => ({ procedure_id: pid[2], procedure_name: '', tier: 'Compiled', ...v })) });
    for (const [k, , v] of f) rows = rows.filter((x) => String(x[k]) === String(v));
    return json(r, { data: rows });
  });
  await page.route('**/api/resource/Agent%20Procedure/**', (r) => {
    const n = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const p = d.procedures.find((x) => x.name === n);
    return p ? json(r, { data: strip(p) }) : json(r, { exc_type: 'DoesNotExistError' }, 404);
  });
  await m('huf.ai.procedure.validation_api.run_validation_harness', (a) => d.validation[a.procedure_name]);
  await m('huf.ai.procedure.approval_api.request_procedure_approval', (a) => ({ procedure_name: a.procedure_name, approval_status: 'Pending Review', changed: true }));
  await m('huf.ai.automation.api.list_automations', () => demo() === 'empty' ? [] : d.automations.map(({ triggers, ...a }) => a));
  await m('huf.ai.automation.api.get_automation', (a) => { const { triggers, ...x } = d.automations.find((y) => y.name === a.automation) || {}; return x; });
  await m('huf.ai.automation.api.list_triggers', (a) => (d.automations.find((y) => y.name === a.automation)?.triggers) || []);
  await m('huf.ai.automation.api.get_automation_runtime_mode', () => ({ mode: 'new' }));
}
