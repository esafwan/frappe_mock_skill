import { esc, hash } from './util.mjs';
const PALETTE = ['blue', 'cyan', 'dark-green', 'green', 'orange', 'pink', 'purple', 'red', 'yellow', 'gray'];
export const avatarColour = (name) => PALETTE[hash(name) % PALETTE.length];
const initials = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
export function avatar(name, { size = 'medium', image } = {}) {
  const c = avatarColour(name);
  const inner = image
    ? `<img class="standard-image" src="${esc(image)}" alt="${esc(name)}">`
    : `<div class="avatar-frame standard-image" style="background-color: var(--${c}-avatar-bg); color: var(--${c}-avatar-color)">${esc(initials(name))}</div>`;
  return `<span class="avatar avatar-${esc(size)}" title="${esc(name)}">${inner}</span>`;
}
export function avatarGroup(names = [], { size = 'medium', max = 3 } = {}) {
  const shown = names.slice(0, max).map((n) => avatar(n, { size })).join('');
  const extra = names.length > max ? `<span class="avatar avatar-${esc(size)} avatar-extra-count"><div class="avatar-frame standard-image">+${names.length - max}</div></span>` : '';
  return `<span class="avatar-group right">${shown}${extra}</span>`;
}
