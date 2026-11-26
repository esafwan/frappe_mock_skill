// Form sidebar (right panel) built from the doc. Generic: no doctype/app/brand names.
// Reads: doc._assign, doc.attachments | doc._attachments, doc._user_tags | doc.tags, doc.shared | doc.__onload.shared,
// doc._liked_by, doc.followers, doc.owner/creation/modified_by/modified, doc._comment_count.
import { esc } from '../../kit-lib/util.mjs';
import { avatar } from '../../kit-lib/avatars.mjs';
import { tag } from '../../kit-lib/tags.mjs';
import { formTitle } from './title.mjs';

const ic = (n) => `<svg class="icon icon-sm" aria-hidden="true"><use href="#icon-${esc(n)}"></use></svg>`;
const parseList = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    if (/^\s*\[/.test(v)) { try { return JSON.parse(v); } catch { /* fall through */ } }
    return v.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};
const nm = (x) => (x && typeof x === 'object' ? (x.full_name || x.user || x.name || x.email || '') : String(x ?? ''));
const addBtn = (label, action) => `<button class="es-button" type="button" data-variant="ghost" data-icon-button="true" data-action="${action}" aria-label="${esc(label)}">${ic('plus')}</button>`;
function sect(cls, icon, label, action, body, empty) {
  const content = body || (empty ? `<div class="form-sidebar-empty text-muted text-sm">${esc(empty)}</div>` : '');
  return `<div class="sidebar-section ${cls} border-bottom" data-ui="form-sidebar.${action}"><span class="form-sidebar-items"><span class="form-sidebar-label">${ic(icon)}<span class="ellipsis">${esc(label)}</span></span>${action ? addBtn(label, action) : ''}</span>${content}</div>`;
}
const when = (v) => (v ? `<span class="text-muted" title="${esc(v)}">${esc(String(v).slice(0, 16).replace('T', ' '))}</span>` : '');

export function formSidebarHtml(meta = {}, doc = {}, opts = {}) {
  const title = formTitle(meta, doc).title || doc.name || '';
  const letter = esc([...String(title).trim()][0]?.toUpperCase() || 'D');
  const assigned = parseList(doc._assign).map(nm).filter(Boolean);
  const files = parseList(doc.attachments ?? doc._attachments).map((a) => (typeof a === 'string' ? { file_name: a } : a));
  const tags = parseList(doc._user_tags ?? doc.tags).map(nm).filter(Boolean);
  const shared = parseList(doc.shared ?? doc.__onload?.shared).map(nm).filter(Boolean);
  const likes = parseList(doc._liked_by).map(nm).filter(Boolean);
  const followers = parseList(doc.followers).map(nm).filter(Boolean);
  const people = (names) => `<div class="form-sidebar-avatars flex">${names.map((n) => avatar(n, { size: 'small' })).join('')}</div>`;
  const fileRows = files.map((f) => `<div class="attachment-row flex justify-between"><a class="ellipsis attachment-name" href="${esc(f.file_url || '#')}">${f.is_private ? ic('lock') : ''}${esc(f.file_name || f.name || '')}</a></div>`).join('');
  const meSet = new Set([doc.owner, doc.modified_by].filter(Boolean));
  const metaRows = [
    doc.owner ? `<div class="form-created-by text-muted">${esc(opts.labels?.created ?? 'Created')} ${when(doc.creation)} ${esc(opts.labels?.by ?? 'by')} ${esc(doc.owner)}</div>` : '',
    doc.modified_by ? `<div class="form-modified-by text-muted">${esc(opts.labels?.modified ?? 'Last edited')} ${when(doc.modified)} ${esc(opts.labels?.by ?? 'by')} ${esc(doc.modified_by)}</div>` : '',
  ].join('');
  void meSet;
  const likeCount = likes.length;
  const commentCount = Number(doc._comment_count || 0);
  return `<div class="form-sidebar overlay-sidebar hidden-xs hidden-sm" data-ui="form-sidebar">`
    + `<div class="flex justify-between sidebar-image-section sidebar-section"><div class="sidebar-image-wrapper"><div class="sidebar-standard-image"><div class="standard-image">${letter}</div></div></div></div>`
    + `<div class="sidebar-section sidebar-meta-details border-bottom"><div class="form-details flex justify-between form-title-text"><span class="bold ellipsis mr-3 text-medium">${esc(title)}</span></div></div>`
    + sect('form-assignments', 'users', 'Assigned To', 'assign', assigned.length ? people(assigned) : '', 'Not assigned')
    + sect('form-attachments', 'paperclip', 'Attachments', 'attach', fileRows, 'No attachments')
    + sect('form-shared', 'share-2', 'Share', 'share', shared.length ? people(shared) : '', 'Not shared')
    + sect('form-tags', 'tag', 'Tags', 'tag', tags.map(tag).join(''), 'No tags')
    + (followers.length ? sect('form-followers', 'eye', 'Following', '', people(followers)) : '')
    + `<div class="sidebar-section form-reactions border-bottom"><span class="liked-by" data-count="${likeCount}">${ic('heart')}<span class="like-count">${likeCount}</span></span><span class="comment-count">${ic('message-square')}<span>${commentCount}</span></span></div>`
    + `<div class="sidebar-section form-meta-footer">${metaRows}</div>`
    + `</div>`;
}
export default formSidebarHtml;
