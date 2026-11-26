// Z-layer model: page < popover < modal < toast. Deterministic, no deps, generic.
import { esc } from './util.mjs';

export const LAYER_ORDER = ['page', 'popover', 'modal', 'toast'];
/** Base z-index per layer. Modals step by MODAL_STEP; backdrop sits 10 below its dialog. */
export const Z = { page: 0, popover: 1035, backdrop: 1040, modal: 1050, toast: 1080 };
export const MODAL_STEP = 20;
export const TOAST_GAP = 8;

export function layerOf(type, map = {}) { return map[type] || 'page'; }
export function zFor(layer, index = 0) {
  if (layer === 'modal') return Z.modal + index * MODAL_STEP;
  if (layer === 'popover' || layer === 'toast') return Z[layer] + index;
  return Z.page;
}
export function layerCss() {
  return `[data-layer]{position:fixed;inset:0;pointer-events:none}
[data-layer="popover"]>*{pointer-events:auto}
.layer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);pointer-events:auto}
.layer-backdrop[data-dimmed="true"]{background:rgba(0,0,0,.25)}
.layer-modal{position:fixed;inset:0;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;padding:5vh 16px;pointer-events:auto}
.layer-modal>*{position:relative}
.layer-toasts{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column-reverse;gap:${TOAST_GAP}px;align-items:flex-end;pointer-events:none}
.layer-toasts>*{pointer-events:auto}`;
}

const lay = (name, z, inner, extra = '') => `<div data-layer="${name}" data-z="${z}" style="z-index:${z}"${extra}>${inner}</div>`;

/** Popovers: later items draw on top (z + index). Items are html strings. */
export function wrapPopovers(items = []) {
  if (!items.length) return '';
  return lay('popover', Z.popover, items.map((h, i) => `<div data-layer-item="${i}" style="position:absolute;z-index:${zFor('popover', i) - Z.popover}">${h}</div>`).join(''));
}

/** Dialogs stack in array order; each has its own backdrop; all but the last are dimmed (inert). */
export function wrapModals(items = []) {
  if (!items.length) return '';
  const top = items.length - 1;
  return items.map((h, i) => {
    const z = zFor('modal', i);
    const dimmed = i < top;
    return `<div data-layer="modal" data-z="${z}" data-modal-index="${i}"${dimmed ? ' data-dimmed="true"' : ''} style="z-index:${z - 10}">`
      + `<div class="layer-backdrop" data-ui="backdrop" data-dimmed="${dimmed}" style="z-index:${z - 10}"></div>`
      + `<div class="layer-modal" role="dialog" aria-modal="true"${dimmed ? ' aria-hidden="true"' : ''} style="z-index:${z};padding-top:calc(5vh + ${i * 28}px)">${h}</div></div>`;
  }).join('');
}

/** Toasts stack bottom-up: first toast sits at the bottom, later ones above it. */
export function wrapToasts(items = []) {
  if (!items.length) return '';
  const z = Z.toast;
  return `<div data-layer="toast" data-z="${z}" class="layer-toasts" style="z-index:${z}">${items.map((h, i) => `<div data-toast-index="${i}">${h}</div>`).join('')}</div>`;
}

/**
 * Wrap overlay html by layer. `overlays` = [{type, html}], `layerMap` = type -> layer name.
 * Returns {page, popover, modal, toast} html strings (page is the plain concatenation).
 */
export function wrapOverlays(overlays = [], layerMap = {}) {
  const by = { page: [], popover: [], modal: [], toast: [] };
  for (const o of overlays) { if (o && o.html) by[layerOf(o.type, layerMap)].push(o.html); }
  return { page: by.page.join(''), popover: wrapPopovers(by.popover), modal: wrapModals(by.modal), toast: wrapToasts(by.toast) };
}

/** Plain-text label helper for toast/alert markup (indicator dot + message). */
export function toastHtml({ message = '', indicator = 'green', title } = {}) {
  return `<div class="desk-alert alert" data-indicator="${esc(indicator)}">${title ? `<b>${esc(title)}</b> ` : ''}<span class="indicator ${esc(indicator)}"></span>${esc(message)}</div>`;
}
