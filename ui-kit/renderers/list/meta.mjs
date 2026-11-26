// List row meta block (T-L8): assignees, timestamp, comment count, attachment icon, like, "assigned to me".
// Pure helpers; rows.mjs can call renderMeta(doc, o) in place of its inline block. Generic: no doctype names.
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { avatarGroup } from '../../kit-lib/avatars.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const parseJson = (v, d) => { if (typeof v !== 'string') return v ?? d; try { return JSON.parse(v); } catch { return d; } };
const list = (v) => { const a = parseJson(v, []); return Array.isArray(a) ? a.filter(Boolean) : String(a || '').split(',').map((s) => s.trim()).filter(Boolean); };
export const currentUser = (ctx = {}) => ctx.user?.email || ctx.user?.name || 'Administrator';

/** Derived facts for one row. */
export function metaFacts(doc = {}, ctx = {}) {
  const me = currentUser(ctx);
  const assignees = list(doc._assign);
  const liked = list(doc._liked_by);
  return {
    assignees, liked,
    isLiked: liked.includes(me) || liked.length > 0 && liked.includes('Administrator') && me === 'Administrator',
    assignedToMe: assignees.includes(me),
    comments: Number(doc._comment_count ?? 0) || 0,
    attachments: Number(doc._attachment_count ?? doc.attachments ?? 0) || 0,
  };
}

/**
 * Meta block markup (right side of a row).
 * o: { doctype, name?, ago, modTitle, showComments=true, showAttachments=true, showAssignees=true, statusHtml? }
 */
export function renderMeta(doc = {}, ctx = {}, o = {}) {
  const f = metaFacts(doc, ctx);
  const name = String(doc.name ?? '');
  const cc = f.comments > 99 ? '99+' : f.comments;
  const assign = o.showAssignees === false ? '' : `<div class="list-assignments-container hidden-md hidden-xs d-flex${f.assignedToMe ? ' assigned-to-me' : ''}"${f.assignees.length ? ' data-ui="list.row.meta.assign"' : ''}${f.assignedToMe ? ' data-assigned-to-me="true"' : ''}>${f.assignees.length ? avatarGroup(f.assignees, { size: 'medium', max: 2 }) : ''}</div>`;
  const attach = o.showAttachments === false || !f.attachments ? '' : `<span class="attachment-count d-flex align-items-center" title="${f.attachments} attachment${f.attachments === 1 ? '' : 's'}" data-ui="list.row.meta.attachments">${icon('paperclip')}<span class="count">${f.attachments}</span></span>`;
  const comments = o.showComments === false ? '' : `<span class="comment-count d-flex align-items-center" data-ui="list.row.meta.comments">${icon('message-circle')}<span class="count">${cc}</span></span>`;
  const like = `<span class="list-row-like hidden-xs" style="margin-bottom: 1px;"><span class="like-action ${f.isLiked ? 'liked' : 'not-liked'}" data-doctype="${esc(o.doctype || '')}" data-name="${esc(name)}" data-liked-by="${esc(JSON.stringify(f.liked))}" title="${f.isLiked ? 'Liked by you' : ''}" data-ui="list.row.meta.like">${icon('heart', 'sm', { class: 'like-icon' })}</span></span>`;
  return `<div class="level-item list-row-activity hidden-xs">${assign}`
    + `<span class="modified"><span class="frappe-timestamp mini" data-timestamp="${esc(doc.modified || '')}" title="${esc(o.modTitle || '')}">${esc(o.ago || '')}</span></span>`
    + `${attach}${comments}<span class="mx-2">&middot;</span>${like}</div>`
    + (o.statusHtml ? `<div class="level-item visible-xs text-right">${o.statusHtml}</div>` : '');
}
