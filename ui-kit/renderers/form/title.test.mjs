import { formTitleModel } from './title.mjs';
import { normalizeWorkflow } from '../../kit-lib/indicators.mjs';

// Matrix test: node renderers/form/title.test.mjs
{
  const sub = { name: 'Doc', is_submittable: 1, title_field: 'cust', show_title_field_in_link: 1 };
  const plain = { ...sub, show_title_field_in_link: 0 };
  const wf = { ...sub, workflow: normalizeWorkflow(1) };
  const cases = [
    ['ds0', sub, { name: 'D-1', cust: 'Alpha Co', docstatus: 0 }],
    ['ds1', sub, { name: 'D-1', cust: 'Alpha Co', docstatus: 1 }],
    ['ds2', sub, { name: 'D-1', cust: 'Alpha Co', docstatus: 2 }],
    ['unsaved-new', sub, { __islocal: 1, docstatus: 0 }],
    ['unsaved-dirty', sub, { name: 'D-1', cust: 'Alpha Co', __unsaved: 1, docstatus: 0 }],
    ['workflow', wf, { name: 'D-1', cust: 'Alpha Co', docstatus: 0, workflow_state: 'Pending' }],
    ['amended', sub, { name: 'D-1-1', cust: 'Alpha Co', docstatus: 0, amended_from: 'D-1' }],
    ['no-title-flag', plain, { name: 'D-1', cust: 'Alpha Co', docstatus: 0 }],
  ];
  let bad = 0;
  for (const [n, m, d] of cases) {
    const r = formTitleModel(m, d);
    const ok = r.title && (n === 'unsaved-new' ? r.title === 'New Doc' : n === 'no-title-flag' ? r.title === 'D-1' : r.title === 'Alpha Co' && r.sub === d.name) && r.status && r.status.label;
    if (!ok) bad++;
    console.log(ok ? 'ok  ' : 'FAIL', n, JSON.stringify(r));
  }
  process.exit(bad ? 1 : 0);
}
