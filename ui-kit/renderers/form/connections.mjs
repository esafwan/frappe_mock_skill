// Form Connections tab (form dashboard): spec.connections[] -> groups of document links with counts and "+" buttons.
// Generic: labels come from data. Exports renderConnections(connections, opts) -> html.
// Connection shape: { group?: "Reference", doctype, label?, count?, open_count?, fieldname?, add: bool (default true), icon? }
//   or grouped: { group: "Reference", items: [ {doctype,...}, ... ] }
// opts: { heatmap: {title, values}, readOnly: bool }
import { esc } from '../../kit-lib/util.mjs';

const ic = (n) => `<svg class="icon icon-sm" aria-hidden="true"><use href="#icon-${n}"></use></svg>`;

// One document link, v16 form_links.html: badge (label + count), open-notification, "+" button.
function link(c, opts) {
  const label = c.label || c.doctype || '';
  const count = Number(c.count ?? 0);
  const open = Number(c.open_count ?? 0);
  const add = c.add === false || opts.readOnly ? '' : `<button class="btn btn-new btn-secondary btn-xs icon-btn" type="button" data-doctype="${esc(c.doctype || label)}"${c.fieldname ? ` data-fieldname="${esc(c.fieldname)}"` : ''} aria-label="New ${esc(label)}">${ic('plus')}</button>`;
  return `<div class="document-link" data-doctype="${esc(c.doctype || label)}">`
    + `<div class="document-link-badge" data-doctype="${esc(c.doctype || label)}"${c.fieldname ? ` data-fieldname="${esc(c.fieldname)}"` : ''}><a class="badge-link">${esc(label)}</a>${count > 0 ? `<span class="count">${count}</span>` : '<span class="count hidden"></span>'}</div>`
    + `${open > 0 ? `<span class="open-notification" title="Open ${esc(label)}">${open}</span>` : '<span class="open-notification hidden"></span>'}${add}</div>`;
}

export function renderConnections(connections = [], opts = {}) {
  const list = Array.isArray(connections) ? connections : [];
  const groups = [];
  for (const c of list) {
    const items = Array.isArray(c.items) ? c.items : [c];
    const g = c.group ?? c.label_group ?? (Array.isArray(c.items) ? '' : (c.group || 'Reference'));
    let grp = groups.find((x) => x.name === g);
    if (!grp) groups.push((grp = { name: g, items: [] }));
    grp.items.push(...items);
  }
  const heat = opts.heatmap
    ? `<div class="form-heatmap form-dashboard-section"><div class="section-head">${esc(opts.heatmap.title || 'Overview')}</div><div class="section-body"><div class="heatmap-container" data-values="${esc(JSON.stringify(opts.heatmap.values || []))}"></div></div></div>` : '';
  // v16 form_links.html: groups in rows of three .col-md-4 columns, each a title and its links
  const rows = [];
  for (let i = 0; i < groups.length; i += 3) {
    rows.push(`<div class="row">${groups.slice(i, i + 3).map((g) => `<div class="col-md-4"><div class="form-link-title"><span>${esc(g.name || 'Connections')}</span></div>${g.items.map((c) => link(c, opts)).join('')}</div>`).join('')}</div>`);
  }
  const body = groups.length ? `<div class="form-dashboard-section form-links"><div class="section-body"><div class="transactions"><div class="form-documents">${rows.join('')}</div></div></div></div>`
    : '<div class="form-dashboard-section"><div class="section-body text-muted">No connections</div></div>';
  return `<div class="form-dashboard-wrapper" data-ui="form.connections">${heat}${body}</div>`;
}

export default renderConnections;
