import { esc, ICON, injectList, setInputValue, setAttr } from './util.mjs';

/**
 * Awesomplete dropdown of a Link-like field (Link, Dynamic Link, Table MultiSelect, Autocomplete).
 * ov: { query, results: [{value, description?, label?}], create: bool|label, advanced: bool, highlight: n }
 * Empty results with no create/advanced draws the "No results" row.
 */
export function linkOpen(html, df, ctx, ov = {}) {
  const target = df.options && df.fieldtype === 'Link' ? df.options : (ov.target || df.options || '');
  const q = ov.query ?? '';
  const results = Array.isArray(ov.results) ? ov.results : [];
  const hl = Number.isInteger(ov.highlight) ? ov.highlight : -1;
  const hi = (txt) => {
    const t = String(txt ?? ''); if (!q) return esc(t);
    const k = t.toLowerCase().indexOf(String(q).toLowerCase());
    return k < 0 ? esc(t) : `${esc(t.slice(0, k))}<mark>${esc(t.slice(k, k + q.length))}</mark>${esc(t.slice(k + q.length))}`;
  };
  let li = results.map((r, i) => {
    const o = typeof r === 'string' ? { value: r } : r;
    return `<li role="option" aria-selected="${i === hl}" data-value="${esc(o.value)}"><p title="${esc(o.value)}"><strong>${hi(o.label ?? o.value)}</strong>${o.description ? `<br><span class="small">${esc(o.description)}</span>` : ''}</p></li>`;
  }).join('');
  const extras = [];
  if (!results.length) extras.push(`<li role="option" aria-selected="false" class="no-results"><p class="text-muted">No results found</p></li>`);
  if (ov.advanced !== false && (ov.advanced || results.length || ov.create)) extras.push(`<li role="option" aria-selected="false" class="advanced-search"><p><span>${ICON('search', 'icon-xs')}</span> Advanced Search</p></li>`);
  if (ov.create) extras.push(`<li role="option" aria-selected="false" class="create-new"><p><span>${ICON('plus', 'icon-xs')}</span> ${esc(typeof ov.create === 'string' ? ov.create : `Create a new ${target}`)}</p></li>`);
  li += extras.join('');
  const ul = `<ul role="listbox" id="awesomplete_list_open_${esc(df.fieldname)}" class="awesomplete-list" style="display:block;position:absolute;z-index:1060;min-width:100%;max-height:300px;overflow:auto;background:var(--fg-color,#fff);border:1px solid var(--border-color,#e5e7eb);border-radius:8px;box-shadow:var(--shadow-md,0 4px 12px rgba(0,0,0,.12));margin:2px 0 0;padding:4px;list-style:none">${li}</ul><span class="visually-hidden" role="status" aria-live="assertive" aria-atomic="true">${results.length} results found.</span>`;
  let out = injectList(html, ul);
  out = out.replace('aria-expanded="false"', 'aria-expanded="true"');
  out = setInputValue(out, q);
  return setAttr(out, 'data-open="1"');
}
