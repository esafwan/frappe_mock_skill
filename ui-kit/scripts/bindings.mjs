// Generates components/<pos-*>/bindings.json: maps each data slot to a menu JSON expression (see tools/render.mjs).
// Heuristic is based on the captured structure (card order = DOM order) and is re-runnable after any recapture.
import fs from 'fs'; import { ROOT } from './lib.mjs';
const slotsOf = (id) => JSON.parse(fs.readFileSync(ROOT + `components/${id}/slots.json`)).slots;
const write = (id, b) => { fs.writeFileSync(ROOT + `components/${id}/bindings.json`, JSON.stringify({ component: id, note: 'slot -> menu expression; applied by tools/render.mjs when --menu is given. items[i] wraps around the menu length.', bind: b }, null, 2)); console.log('bindings', id, Object.keys(b).length); };
function cards(id, firstIndex = 0) {          // item-grid / item-card
  const s = slotsOf(id); const b = {}; const n = { name: 0, cat: 0, price: 0, img: 0, al: 0, alt: 0, tn: 0, tc: 0 };
  for (const [k, v] of Object.entries(s)) {
    if (v.type === 'image') b[k] = `menu.items[${firstIndex + n.img++}].image`;
    else if (v.where === 'text' && /^text_gray_900(_\d+)?$/.test(k) && v.type === 'text') b[k] = `menu.items[${firstIndex + n.name++}].name`;
    else if (v.where === 'text' && /^text_gray_500(_\d+)?$/.test(k)) b[k] = `menu.items[${firstIndex + n.cat++}].category`;
    else if (v.type === 'currency') b[k] = `menu.items[${firstIndex + n.price++}].price`;
    else if (/arialabel(_\d+)?$/.test(k)) b[k] = `menu.items[${firstIndex + n.al++}].name`;
    else if (/^object_cover_alt/.test(k)) b[k] = `menu.items[${firstIndex + n.alt++}].name`;
    else if (/^text_gray_900.*_title/.test(k)) b[k] = `menu.items[${firstIndex + n.tn++}].name`;
    else if (/^text_gray_500.*_title/.test(k)) b[k] = `menu.items[${firstIndex + n.tc++}].category`;
  } return b;
}
for (const id of ['pos-item-grid', 'pos-item-card']) if (fs.existsSync(ROOT + `components/${id}/slots.json`)) write(id, cards(id));
if (fs.existsSync(ROOT + 'components/pos-cart/slots.json')) { const s = slotsOf('pos-cart'); const b = {}; let nm = 0, pr = 0;
  for (const [k, v] of Object.entries(s)) { if (/^text_sm$/.test(k)) b[k] = 'menu.items[0].name'; else if (/^text_sm_2$/.test(k) || /^font_semibold_2$/.test(k)) b[k] = 'menu.items[0].price'; }
  write('pos-cart', b); }

if (fs.existsSync(ROOT + 'components/pos-category-sidebar/slots.json')) { const s2 = slotsOf('pos-category-sidebar'); const b = {}; let n = 0, c = 0;
  for (const [k, v] of Object.entries(s2)) { if (/^text_start(_\d+)?$/.test(k)) b[k] = { expr: `menu.categories[${n++}].name`, dropRow: 'button' }; else if (/^text_center(_\d+)?$/.test(k)) b[k] = c++ === 0 ? 'menu.itemCount' : `menu.categories[${c - 2}].count`; }
  write('pos-category-sidebar', b); }
