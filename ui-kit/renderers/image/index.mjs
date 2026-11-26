// Image view renderer (page: 'image'). Generic, deterministic.
// spec.data.rows: [{ name, title?, image?, indicator?: {label,color} | 'text' }]; spec.meta.image_field/title_field unused (data is explicit).
// Cards without an image show a placeholder with the title's initials.
import { esc } from '../workspace/blocks/common.mjs';
import { avatarColour } from '../../kit-lib/avatars.mjs';
import { viewHead, metaOf } from '../../kit-lib/viewhead.mjs';

const CSS = `<style data-ui="image.layout">.image-page{padding:16px 0}.image-view-container{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}.image-view-item{box-sizing:border-box;border:1px solid var(--outline-gray-1,#ededed);border-radius:8px;overflow:hidden;background:var(--surface-white,#fff)}.image-view-item .image-field{height:140px;display:flex;align-items:center;justify-content:center;background:var(--surface-gray-2,#f3f3f3)}.image-view-item .image-field img{width:100%;height:100%;object-fit:cover}.image-view-item .placeholder-text{font-size:32px;font-weight:600}.image-view-item .image-title{padding:8px 10px;display:flex;align-items:center;gap:6px;min-width:0}.image-view-item .image-title .title{flex:1;min-width:0}.image-empty{display:flex;align-items:center;justify-content:center;min-height:200px}</style>`;

const initials = (s) => String(s || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const COLOURS = ['gray', 'green', 'red', 'orange', 'yellow', 'blue', 'cyan', 'purple', 'pink'];

function card(r) {
  const row = typeof r === 'string' ? { name: r } : r || {};
  const title = row.title ?? row.name ?? '';
  const c = avatarColour(String(title));
  const media = row.image
    ? `<img src="${esc(row.image)}" alt="${esc(title)}">`
    : `<div class="placeholder-text" data-ui="image.placeholder" style="color: var(--${c}-avatar-color); background-color: var(--${c}-avatar-bg); width:100%; height:100%; display:flex; align-items:center; justify-content:center">${esc(initials(title))}</div>`;
  const ind = typeof row.indicator === 'string' ? { label: row.indicator } : row.indicator;
  const col = ind ? (COLOURS.includes(String(ind.color).toLowerCase()) ? String(ind.color).toLowerCase() : 'gray') : '';
  const pill = ind ? `<span class="indicator-pill ${col} ellipsis" data-ui="image.indicator"><span class="ellipsis">${esc(ind.label)}</span></span>` : '';
  return `<div class="image-view-item" data-ui="image.card:${esc(row.name ?? title)}"><div class="image-field">${media}</div><div class="image-title"><span class="title ellipsis" title="${esc(title)}">${esc(title)}</span>${pill}</div></div>`;
}

export default function render(spec, ctx = {}) {
  const rows = spec.data?.rows || [];
  if (!Array.isArray(rows)) throw new Error('image renderer: data.rows must be an array');
  if (!rows.length && !spec.view?.state) ctx.warn?.('image: no rows; rendering empty state');
  const title = spec.data?.title || metaOf(spec).name || 'Images';
  const head = viewHead(spec, ctx, { view: 'image', label: spec.data?.title || undefined });
  const body = rows.length ? `<div class="image-view-container" data-ui="image.grid">${rows.map(card).join('')}</div>` : `<div class="image-empty text-muted" data-ui="image.empty">No images to show</div>`;
  return { head, main: `${CSS}<div class="desk-page image-page" data-ui="image.page">${body}</div>`, title };
}
