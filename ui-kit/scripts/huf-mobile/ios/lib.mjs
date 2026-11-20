// Shared helpers for the huf-ios hand-authored components: icons (lucide-style strokes, SF-symbol look), brand mark, spinner.
const P = {
  'chevron-left': '<path d="m15 18-6-6 6-6"/>', 'chevron-right': '<path d="m9 18 6-6-6-6"/>', 'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  ellipsis: '<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
  'square-pen': '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.4 2.6a1.9 1.9 0 0 1 3 3L12.4 14.6a2 2 0 0 1-.9.5l-2.9.8a.5.5 0 0 1-.6-.6l.8-2.9a2 2 0 0 1 .5-.9z"/>',
  plus: '<path d="M5 12h14M12 5v14"/>', mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  'arrow-up': '<path d="m5 12 7-7 7 7M12 19V5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  pin: '<path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  asterisk: '<rect width="18" height="18" x="3" y="3" rx="2.5"/><path d="M12 8v8M8.5 10l7 4M8.5 14l7-4"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  key: '<circle cx="12" cy="6" r="3.5"/><path d="M12 9.5V21M12 15h3M12 19h2"/>', moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'chart-bar': '<path d="M5 20V12M12 20V5M19 20v-9"/>', 'doc-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M8 13h8M8 17h8"/>', code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', calendar: '<rect width="18" height="16" x="3" y="5" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/><circle cx="19" cy="19" r="3" fill="currentColor"/>',
  graph: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  alert: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v5M12 16h.01"/>',
};
const FILL = {
  bubble: '<path d="M7 3h10a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-4.5L8 22v-4H7a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z" fill="currentColor" stroke="none"/>',
  folderf: '<path d="M2 6a2 2 0 0 1 2-2h4.5l2 2H20a2 2 0 0 1 2 2v1H2zM2 10.5h20V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="currentColor" stroke="none"/>',
  person: '<circle cx="12" cy="7" r="4.6" fill="currentColor" stroke="none"/><path d="M3 20.5c0-3.3 3-5.5 9-5.5s9 2.2 9 5.5c0 .8-.6 1.2-1.4 1.2H4.4c-.8 0-1.4-.4-1.4-1.2Z" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none"/>',
  pinf: '<path d="M14 3l7 7-3 1-3.5 3.5.5 4-1.5 1.5L10 15l-5 6-1-1 6-5-4-4 1.5-1.5 4 .5L10 7z" fill="currentColor" stroke="none"/>',
};
export const ic = (n, s = 24, sw = 2, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || FILL[n]}</svg>`;
export const spinner = (s = 24) => `<svg class="ic hi-spinner" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${[...Array(8)].map((_, i) => `<line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="${(0.15 + i * 0.12).toFixed(2)}" transform="rotate(${i * 45} 12 12)"/>`).join('')}</svg>`;
export const brandMark = (w = 84) => `<svg viewBox="0 0 468 240" width="${w}" height="${Math.round(w * 240 / 468)}" aria-label="huf" fill="currentColor"><path d="M338.37 170.387C338.37 187.132 324.8 200.707 308.05 200.707L299.1 200.707 299.1 240 222.299 240C198.856 240 179.85 220.995 179.85 197.552L179.85 74.866 219.267 74.866 219.267 200.584 298.95 200.584 298.95 74.865 338.37 74.865ZM467.11 39.567L423.69 39.567 423.69 74.798 455.05 74.798 455.05 105.119 423.69 105.119 423.69 209.278C423.69 226.023 410.12 239.598 393.38 239.598L384.28 239.598 384.28 105.119 364.39 105.119 364.39 74.798 384.28 74.798 384.28 42.6C384.28 19.156 403.28 0.151 426.73 0.151L467.11 0.151ZM40.305 74.462L116.96 74.462C140.404 74.462 159.409 93.467 159.409 116.911L159.409 239.597 119.993 239.597 119.993 113.879 40.305 113.879 40.305 239.597 0.888 239.597 0.888 144.075C0.888 127.33 14.464 113.755 31.209 113.755L40.161 113.755 40.161 74.866 0.888 74.866 0.888 0 40.305 0Z"/></svg>`;
export const initials = (n) => { const m = /^\{\{(\w+)\}\}$/.exec(n); if (m) return `{{${m[1]}_initials}}`; return n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); };
