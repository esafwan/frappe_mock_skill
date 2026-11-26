import { esc } from './util.mjs';
export function tag(label) { return `<span class="tag-pill" data-tag-name="${esc(label)}">${esc(label)}</span>`; }
export function tagList(labels = []) { return labels.map(tag).join(''); }
