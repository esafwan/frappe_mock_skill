import { esc, injectAfterInput, setInputValue } from './util.mjs';

const PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#6b7280', '#111827', '#ffffff'];
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Color picker. ov: { value:"#rrggbb", palette?:[...] } */
export function colorOpen(html, df, ctx, ov = {}) {
  const v = ov.value ?? ctx.value ?? '';
  const ok = HEX.test(String(v));
  const pal = (ov.palette || PALETTE).map((c) => `<div class="color-box${String(c).toLowerCase() === String(v).toLowerCase() ? ' selected' : ''}" data-color="${esc(c)}" style="width:20px;height:20px;border-radius:4px;border:1px solid rgba(0,0,0,.12);background:${esc(c)}"></div>`).join('');
  const popup = `<div class="color-picker-pop" style="position:absolute;z-index:1060;background:var(--fg-color,#fff);border:1px solid var(--border-color,#e5e7eb);border-radius:8px;box-shadow:var(--shadow-md,0 4px 12px rgba(0,0,0,.12));margin-top:2px;padding:8px;width:176px"><div class="color-map" style="height:100px;border-radius:4px;background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,${ok ? esc(v) : '#f00'});margin-bottom:8px"></div><div class="color-swatches" style="display:grid;grid-template-columns:repeat(6,20px);gap:4px">${pal}</div></div>`;
  let out = injectAfterInput(html, popup);
  out = setInputValue(out, v);
  if (ok) out = out.replace(/(<div class="control-input">)/, `$1<div class="selected-color" style="position:absolute;left:8px;top:50%;margin-top:-6px;width:12px;height:12px;border-radius:3px;background:${esc(v)}"></div>`);
  return out;
}
