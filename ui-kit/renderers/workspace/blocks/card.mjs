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
    const href = routeFor(l.link_type === 'Report' && !l.is_query_report ? 'DocType' : l.link_type, l.link_to, l.link_type === 'Report' && !l.is_query_report ? 'report' : '');
    const dot = l.onboard ? `<span class="onboard-dot indicator-pill-dot" data-ui="link.onboard" title="Onboarding"></span>` : '';
    const desc = l.description ? ` data-description="${esc(l.description)}"` : '';
    const pop = l.description ? `<span class="link-description-popover" data-ui="link.description" role="tooltip">${esc(l.description)}</span>` : '';
    return `<a class="link-item ellipsis ${l.onboard ? 'onboard-spotlight' : ''}" href="${esc(href)}" data-ui="link:${esc(l.label)}" data-link-type="${esc(l.link_type)}"${desc}>${dot}<span class="link-text ellipsis" title="${esc(l.label)}">${esc(l.label)}</span><span class="link-arrow">${icon('arrow-right', 'xs')}</span>${pop}</a>`;
  }).join('');
  return `<div class="widget links-widget-box" data-ui="card:${esc(c.label)}" data-widget-name="${esc(c.label)}"><div class="widget-head"><div class="widget-title ellipsis"><span class="ellipsis" title="${esc(c.label)}">${esc(c.label)}</span></div></div><div class="widget-body"><div class="link-items">${rows}</div></div></div>`;
}
