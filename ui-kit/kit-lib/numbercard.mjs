// Number card (desk .number-widget-box markup). Deterministic, generic.
import { esc } from './util.mjs';
import { formatNumber as formatSys, decimalSep, currencyAround } from './format.mjs';

export const COLOURS = { green: '#28a745', red: '#e24c4c', blue: '#318ad8', orange: '#ff8c0a', grey: '#6c7680' };

export function formatNumber(n, { currency, locale = 'en-US', compact = false, system } = {}) {
  if (system) { // System Settings number format (kit-lib/format.mjs): separators, grouping and decimals follow it
    const dec = decimalSep(system);
    if (currency && !compact) return currencyAround(n, system, locale, currency);
    let body;
    if (compact) body = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.abs(n)).replace('.', dec);
    else body = formatSys(Math.abs(n), system, 2, { trim: true });
    let sym = '';
    if (currency) sym = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(1).find((p) => p.type === 'currency')?.value || currency;
    return (n < 0 ? '-' : '') + sym + body;
  }
  const o = compact ? { notation: 'compact', maximumFractionDigits: 2 } : { maximumFractionDigits: 2 };
  if (currency) { o.style = 'currency'; o.currency = currency; }
  return new Intl.NumberFormat(locale, o).format(n);
}

// card: { label, value, previous?, currency?, colour?, compact?, locale?, subtitle?, deltaLabel? }
// Delta = (value-previous)/|previous|. Up is green, down is red; "colour" overrides the number colour only.
export function numberCard(card) {
  const { label, value, previous, currency, colour, compact, locale, subtitle, deltaLabel = 'since last month', system } = card;
  let delta = '';
  if (previous !== undefined && previous !== null) {
    const diff = value - previous, pct = previous === 0 ? (diff === 0 ? 0 : 100) : (diff / Math.abs(previous)) * 100;
    const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat', stat = dir === 'up' ? 'green-stat' : dir === 'down' ? 'red-stat' : 'grey-stat';
    const sym = dir === 'up' ? '#icon-arrow-up-right' : dir === 'down' ? '#icon-arrow-down-right' : '#icon-minus';
    delta = `<div class="card-stats ${stat}" data-delta="${dir}" data-percent="${Math.round(Math.abs(pct) * 100) / 100}"><span class="percentage-stat-area"><svg class="icon icon-xs"><use href="${sym}"></use></svg> ${Math.round(Math.abs(pct) * 100) / 100} %</span> <span class="stat-period text-muted" style="margin-inline-start:4px">${esc(deltaLabel)}</span></div>`;
  } else delta = `<div class="card-stats grey-stat"><span class="percentage-stat-area"></span></div>`;
  const style = colour && COLOURS[colour] ? ` style="color:${COLOURS[colour]}"` : colour ? ` style="color:${esc(colour)}"` : '';
  return `<div class="widget number-widget-box" data-ui="number-card" data-widget-name="${esc(label)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis" title="${esc(label)}">${esc(label)}</span></div><div class="widget-subtitle">${esc(subtitle || '')}</div></div></div><div class="widget-body"><div class="widget-content"><div class="number"${style} data-value="${value}">${esc(formatNumber(value, { currency, locale, compact, system }))}</div>${delta}</div></div><div class="widget-footer"></div></div>`;
}
