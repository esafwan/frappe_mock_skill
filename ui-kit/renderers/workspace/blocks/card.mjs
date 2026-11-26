// Card (Links) block: a Card Break and the Link rows that follow it.
import { esc, icon, routeFor } from './common.mjs';
export function cardLinks(links, cardName) {
  let cur = null; const cards = [];
  for (const l of links || []) {
    if (l.type === 'Card Break') { cur = { label: l.label, links: [], hidden: l.hidden }; cards.push(cur); }
    else if (cur) cur.links.push(l);
  }
  return cards.find((c) => c.label === cardName) || null;
}
export default function card(data, ctx, spec) {
  const c = cardLinks(spec.meta.workspace.links, data.card_name);
  if (!c) { ctx.warn(`workspace: card "${data.card_name}" has no Card Break in meta.workspace.links`); return `<div class="widget links-widget-box" data-ui="card:${esc(data.card_name)}"><div class="card-head"><span class="ellipsis">${esc(data.card_name)}</span></div></div>`; }
  const rows = c.links.filter((l) => !l.hidden).map((l, i) => {
    const rb = l.link_type === 'Report' && !l.is_query_report;
    const href = /^url$/i.test(l.link_type || '') ? (l.url || l.link_to) : routeFor(rb ? 'DocType' : l.link_type, l.link_to, rb ? 'report' : '');
    const deps = (Array.isArray(l.dependencies) ? l.dependencies : String(l.dependencies || '').split(',')).map((x) => String(x).trim()).filter(Boolean);
    const hint = deps.length ? `<span class="link-dependency-hint" data-ui="link.deps" role="tooltip">${esc('You need to create these first: ' + deps.join(', '))}</span>` : '';
    const dot = l.onboard ? `<span class="onboard-dot indicator-pill-dot" data-ui="link.onboard" title="Onboarding" style="display:inline-block;flex:0 0 6px;width:6px;height:6px;margin-inline-end:6px;border-radius:50%;background:var(--blue-500,#318ad8)"></span>` : '';
    const desc = l.description ? ` data-description="${esc(l.description)}"` : '';
    const pop = l.description ? `<span class="link-description-popover" data-ui="link.description" role="tooltip">${esc(l.description)}</span>` : '';
    return `<a class="link-item ellipsis ${l.onboard ? 'onboard-spotlight' : ''}${deps.length ? ' disabled-link' : ''}" href="${esc(href)}" data-ui="link:${esc(l.label)}" data-link-type="${esc(l.link_type)}"${deps.length ? ` data-dependencies="${esc(deps.join(','))}"` : ''}${desc}>${dot}<span class="link-text ellipsis" title="${esc(l.label)}">${esc(l.label)}</span><span class="link-arrow">${icon('arrow-right', 'xs')}</span>${pop}${hint}</a>`;
  }).join('');
  return `<div class="widget links-widget-box" data-ui="card:${esc(c.label)}" data-widget-name="${esc(c.label)}"><div class="widget-head"><div class="widget-title ellipsis"><span class="ellipsis" title="${esc(c.label)}">${esc(c.label)}</span></div></div><div class="widget-body"><div class="link-items">${rows}</div></div></div>`;
}
