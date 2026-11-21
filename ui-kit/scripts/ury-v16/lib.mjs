// Shared helpers for hand-authored URY v16 static components (modelled on huf-mobile/ios/lib.mjs).
import { ICONS } from './icons.mjs';
export const ic = (name, size = 16, cls = '', extra = ICONS) => {
  const p = (extra && extra[name]) || ICONS[name]; if (!p) throw new Error('ury-v16/icons: unknown icon ' + name);
  return `<svg class="lucide lucide-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}${cls ? ' ' + cls : ''}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
};
// Currency-typed slot value for spec.slots. static-capture reads {type, sample}; render.mjs reformats type 'currency' per locale.
export const money = (amount, cur = 'AED') => ({ type: 'currency', amount, currency: cur, sample: `${cur} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` });
export const screen = (width, height, inner, id = '', cls = '') => `<div class="u-screen${cls ? ' ' + cls : ''}"${id ? ` data-ui="${id}"` : ''} style="width:${width}px;height:${height}px;position:relative;overflow:hidden">${inner}</div>`;
export const STATE_NA = {
  touch: 'touch UI: hover/focus are not shown; pressed state appears as a variant where the source styles it',
  desktop: 'pointer UI: hover/focus are shown as variants where the source styles them',
};
