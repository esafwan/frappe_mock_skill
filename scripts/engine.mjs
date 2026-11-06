// Capture engine: live DOM -> slotted component + harness + measurements + screenshot
import fs from 'fs'; import path from 'path';
import { open, go, ROOT } from './lib.mjs';

export const SLOT_ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'value', 'data-original-title', 'data-name', 'data-value', 'data-label', 'data-title', 'data-filter'];

// runs in the page: returns {html, slots, ancestors, bg, boxes}
export async function extractInPage({ rootSel, id, targets, names }) {
  const SLOT_ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'value', 'data-original-title', 'data-name', 'data-value', 'data-label', 'data-title', 'data-filter'];
  const root = document.querySelector(rootSel);
  if (!root) throw new Error('root not found ' + rootSel);
  root.setAttribute('data-ui', id);
  for (const [tid, sel] of Object.entries(targets || {})) {
    const els = root.matches(sel) ? [root] : [...root.querySelectorAll(sel)];
    els.forEach((el, i) => el.setAttribute('data-ui', els.length > 1 ? `${id}.${tid}-${i + 1}` : `${id}.${tid}`));
  }
  const INTER = 'a,button,input,select,textarea,[tabindex],[role=button],[role=tab],[role=menuitem],[role=checkbox],.btn,summary';
  let auto = 0;
  root.querySelectorAll(INTER).forEach(el => {
    if (!el.hasAttribute('data-ui')) {
      const kind = el.tagName.toLowerCase() === 'a' ? 'link' : el.tagName.toLowerCase() === 'input' ? 'input' : el.tagName.toLowerCase();
      el.setAttribute('data-ui', `${id}.${kind}-${++auto}`);
    }
  });
  const rr = root.getBoundingClientRect();
  const boxes = [root, ...root.querySelectorAll('[data-ui]')].map(el => {
    const r = el.getBoundingClientRect();
    return { id: el.getAttribute('data-ui'), tag: el.tagName.toLowerCase(), interactive: el === root ? false : el.matches(INTER) || !!el.dataset.ui?.includes('.'),
      x: +(r.x - rr.x).toFixed(2), y: +(r.y - rr.y).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2),
      pageX: +r.x.toFixed(2), pageY: +r.y.toFixed(2), text: (el.innerText || el.value || '').trim().slice(0, 40) };
  }).filter(b => b.w > 0 && b.h > 0);
  // clone + sanitise
  const clone = root.cloneNode(true);
  clone.querySelectorAll('script,noscript,style,link,iframe,canvas').forEach(n => n.remove());
  const walkC = (n) => { for (const c of [...n.childNodes]) { if (c.nodeType === 8) c.remove(); } };
  const all = [clone, ...clone.querySelectorAll('*')];
  all.forEach(el => {
    walkC(el);
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name) || a.name === 'contenteditable' && false) el.removeAttribute(a.name);
      else if (/^(id|for|aria-controls|aria-labelledby|aria-owns|aria-describedby|list)$/.test(a.name) && /(\d{3,}|_\d+$|^ui-id|awesomplete_list|^uid)/i.test(a.value)) el.removeAttribute(a.name);
      else if (a.name === 'name' && /\d{5,}/.test(a.value)) el.removeAttribute(a.name);
      else if (/^(href|src|action)$/.test(a.name) && /^javascript:/i.test(a.value)) el.setAttribute(a.name, '#');
      else if (a.name === 'href' && /^(https?:)?\/\//.test(a.value)) el.setAttribute('href', '#');
      else if (a.name === 'href' && a.value.startsWith('/')) el.setAttribute('href', '#');
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      const live = root.matches('*') ? null : null;
    }
  });
  // reflect live input state (value / checked / selected) into attributes
  const liveEls = [root, ...root.querySelectorAll('*')];
  liveEls.forEach((le, i) => {
    const ce = all[i]; if (!ce) return;
    if (le.tagName === 'INPUT') { if (le.type === 'checkbox' || le.type === 'radio') { le.checked ? ce.setAttribute('checked', '') : ce.removeAttribute('checked'); } else if (le.value) ce.setAttribute('value', le.value); }
    if (le.tagName === 'TEXTAREA') ce.textContent = le.value;
    if (le.tagName === 'SELECT') { [...ce.querySelectorAll('option')].forEach((o, j) => le.options[j]?.selected ? o.setAttribute('selected', '') : o.removeAttribute('selected')); }
  });
  let imgN = 0; const images = [];
  // inline same-origin images/background urls as data URIs (no network at render time)
  const toData = async (u) => { try { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const b = await r.blob(); return await new Promise(res => { const f = new FileReader(); f.onload = () => res(f.result); f.readAsDataURL(b); }); } catch { return null; } };
  for (const el of [clone, ...clone.querySelectorAll('*')]) {
    if (el.tagName === 'IMG' && el.getAttribute('src')) { const raw = el.getAttribute('src'); const d = raw.startsWith('data:') ? raw : await toData(raw); el.removeAttribute('srcset'); el.removeAttribute('loading');
      if (d) { const mime = (d.match(/^data:([^;,]+)/) || [])[1] || 'image/png'; const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/svg+xml': 'svg', 'image/webp': 'webp', 'image/gif': 'gif' })[mime] || 'png';
        const nm = 'image_' + (++imgN); images.push({ slot: nm, file: `assets/${nm}.${ext}`, data: d }); el.setAttribute('src', `{{${nm}}}`); } else el.removeAttribute('src'); }
    const st = el.getAttribute('style');
    if (st && /url\(/.test(st)) { let out = st; for (const m of [...st.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)]) { if (m[2].startsWith('data:')) continue; const d = await toData(m[2]); out = out.replace(m[0], d ? `url("${d}")` : 'none'); } el.setAttribute('style', out); }
  }
  // slotting
  const slots = []; const used = {};
  const typeOf = (s) => /^[\s]*[-+]?[₹$€£]?\s?[\d,]+(\.\d+)?\s?[%₹$€£]?\s*$/.test(s) ? (/[₹$€£]/.test(s) ? 'currency' : 'number')
    : /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$|^\d{4}-\d{2}-\d{2}/.test(s) ? 'date' : /^\d{1,2}:\d{2}/.test(s) ? 'time' : /ago$|^(Yesterday|Today)/.test(s) ? 'relative-time' : 'text';
  const nameFor = (el, kind) => {
    let e = el, base = '';
    while (e && e !== clone) { const cls = [...e.classList || []].filter(c => !/^(col|row|d-|ml|mr|mt|mb|p[xytblr]?-|m[xytblr]?-)/.test(c)); if (cls.length) { base = cls[cls.length - 1]; break; } e = e.parentElement; }
    base = (base || el.tagName.toLowerCase()).replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase();
    if (kind) base += '_' + kind.replace(/[^a-z]/g, '');
    used[base] = (used[base] || 0) + 1; return used[base] > 1 ? `${base}_${used[base]}` : base;
  };
  const addSlot = (name, sample, kind, el, attr) => { slots.push({ name, type: typeOf(sample), sample, maxLength: Math.max(20, Math.ceil(sample.length * 2)), where: attr ? `attr:${attr}` : 'text', element: el.getAttribute?.('data-ui') || el.tagName.toLowerCase() }); return `{{${name}}}`; };
  const tw = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  const texts = []; while (tw.nextNode()) texts.push(tw.currentNode);
  for (const t of texts) {
    const raw = t.nodeValue; if (!raw.trim()) continue;
    const el = t.parentElement; if (!el) continue;
    const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    t.nodeValue = m[1] + addSlot(nameFor(el), m[2].replace(/\s+/g, ' '), '', el) + m[3];
  }
  for (const el of [clone, ...clone.querySelectorAll('*')]) {
    for (const a of SLOT_ATTRS) {
      if (!el.hasAttribute(a)) continue; const v = el.getAttribute(a); if (!v.trim()) continue;
      if (a === 'value' && !['INPUT', 'TEXTAREA', 'OPTION', 'BUTTON'].includes(el.tagName)) continue;
      if (/^data-/.test(a) && /^\s*[{]/.test(v)) continue;
      if (el.tagName === 'INPUT' && ['checkbox', 'radio', 'hidden'].includes(el.type)) continue;
      el.setAttribute(a, addSlot(nameFor(el, a), v, a, el, a));
    }
  }
  // ancestors
  const ancestors = []; let p = root.parentElement;
  while (p) { const rb = p.getBoundingClientRect(); const o = { tag: p.tagName.toLowerCase(), attrs: {}, w: +rb.width.toFixed(2), x: rb.x + scrollX, y: rb.y + scrollY, display: getComputedStyle(p).display, position: getComputedStyle(p).position }; for (const a of p.attributes) if (!/^on|^data-ui$/i.test(a.name) && !(a.name === 'style' && p.tagName === 'BODY')) o.attrs[a.name] = a.value;
    ancestors.unshift(o); if (p.tagName === 'HTML') break; p = p.parentElement; }
  // effective background behind root
  let bg = 'rgba(0,0,0,0)'; p = root.parentElement;
  while (p) { const c = getComputedStyle(p).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bg = c; break; } p = p.parentElement; }
  const cs = getComputedStyle(root);
  const relevant = (sel) => { try { if (root.matches(sel) || root.querySelector(sel)) return true; let a = root.parentElement; while (a) { if (a.matches(sel)) return true; a = a.parentElement; } } catch {} return false; };
  let inlineCss = '';
  for (const st of document.querySelectorAll('style')) { if (st.dataset.uikit || /ui-kit-freeze/.test(st.id)) continue; let rules; try { rules = st.sheet.cssRules; } catch { continue; }
    for (const r of rules) { if (r.type === 1 ? relevant(r.selectorText) : (r.type === 5 || r.type === 7)) inlineCss += r.cssText + '\n'; } }
  for (const im of images) slots.push({ name: im.slot, type: 'image', sample: im.file, maxLength: 0, where: 'attr:src', element: 'img' });
  return { images, inlineCss, html: clone.outerHTML, slots, ancestors, bg, boxes, size: { w: rr.width, h: rr.height }, display: cs.display, position: cs.position,
    font: getComputedStyle(document.body).fontFamily };
}

export function chain(ancestors, inner, { skipHtml = false } = {}) {
  // ancestors[0]=html, ... last = direct parent. Returns doc-ready body markup (without html/head/body tags)
  const VOID = new Set(['img', 'input', 'br', 'hr']);
  const html = ancestors.find(a => a.tag === 'html'); const body = ancestors.find(a => a.tag === 'body');
  const mid = ancestors.filter(a => a.tag !== 'html' && a.tag !== 'body');
  const attrs = (o) => { const at = { ...o.attrs }; if (o.w && o.tag !== 'html' && o.tag !== 'body' && !/^(inline|contents|none|table-)/.test(o.display || '') && o.position !== 'fixed') at.style = (at.style ? at.style.replace(/;?\s*$/, ';') : '') + `width:${o.w}px;flex:none;max-width:none;box-sizing:border-box`; return Object.entries(at).map(([k, v]) => ` ${k}="${String(v).replace(/"/g, '&quot;')}"`).join(''); };
  let s = inner;
  for (const a of [...mid].reverse()) s = `<${a.tag}${attrs(a)}>${s}</${a.tag}>`;
  return { htmlAttrs: html ? attrs(html) : '', bodyAttrs: body ? attrs(body) : '', body: s };
}

export function fill(html, values) { return html.replace(/\{\{([a-z0-9_]+)\}\}/gi, (m, k) => (k in values ? escapeAttrSafe(values[k]) : m)); }
const escapeAttrSafe = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function harnessDoc(meta, bodyHtml, { dark = false, rtl = false, title = '' } = {}) {
  const ws = rtl ? meta.wRtl : dark ? meta.wDark : null; const c = chain(ws && ws.length === meta.ancestors.length ? meta.ancestors.map((a, i) => ({ ...a, w: ws[i] })) : meta.ancestors, bodyHtml);
  let ha = c.htmlAttrs.replace(/ data-theme="[^"]*"/, '').replace(/ dir="[^"]*"/, '');
  ha += ` data-theme="${dark ? 'dark' : 'light'}"` + (rtl ? ' dir="rtl"' : '');
  const css = ['frappe-desk.css', 'frappe-report.css', 'erpnext-erpnext.css', 'hrms-hrms.css'].filter(f => !meta.css || meta.css.includes(f));
  const links = (meta.css || css).map(f => `<link rel="stylesheet" href="${meta.cssBase}${f}">`).join('\n');
  const pd = meta.pad || {}; const og = (rtl && meta.originRtl) || (dark && meta.originDark) || meta.origin; const stub = `html,body{margin:0}body{background:${(dark && meta.bgDark) || meta.bg};min-height:${meta.clip ? meta.clip.h : 0}px}#ui-kit-stage{position:absolute;left:${(pd.l || 0) + (og ? og.x : 0)}px;top:${(pd.t || 0) + (og ? og.y : 0)}px;width:${Math.ceil(meta.stageW || meta.size.w)}px}${rtl && meta.rootWRtl ? `[data-ui="${meta.id}"]{width:${meta.rootWRtl}px!important;flex:none!important;box-sizing:border-box}` : ''}*{animation:none!important;transition:none!important;caret-color:transparent!important}`;
  return `<!doctype html>\n<html${ha}>\n<head><meta charset="utf-8"><title>${title}</title>\n${links}\n<style>${stub}</style>\n${meta.inlineCss ? `<style>${meta.inlineCss}</style>` : ''}</head>\n<body${c.bodyAttrs}>\n<div id="ui-kit-stage">\n${c.body}\n</div>\n</body></html>\n`;
}
