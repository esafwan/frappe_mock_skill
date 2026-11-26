// Form timeline (Activity): doc.timeline[] -> Frappe "new-timeline" DOM.
// Generic: every name and string comes from the data. No doctype/app/brand names.
// Exports: renderTimeline(doc, opts) -> html, timelineItem(item, opts), TIMELINE_TYPES.
//
// Item shape (all optional but type): { type, by, creation, when, text|content|subject, ... }
//   comment        { by, text, edited? }
//   communication | email  { by, subject, text, to[], cc[], attachments[], sent_or_received, reply: bool }
//   version        { by, changes: [{field, from, to}] | text }
//   assignment     { by, text }       attachment { by, file, removed? }
//   like           { by }             share { by, shared_with, removed? }
//   workflow       { by, state }      label | info { text }   created | edit | submit | cancel { by }
// opts: { more: int (items shown before "More", default all), activityOnly: bool, showAll: bool, commentBox: bool }
import { esc } from '../../kit-lib/util.mjs';
import { avatar } from '../../kit-lib/avatars.mjs';

const ic = (n, cls = 'icon-sm') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${n}"></use></svg>`;
const ICON = {
  comment: 'message-square', communication: 'mail', email: 'mail', version: 'edit', assignment: 'user-plus', attachment: 'paperclip',
  like: 'heart', share: 'share-2', workflow: 'git-branch', label: 'tag', info: 'info', created: 'plus', edit: 'edit', submit: 'check', cancel: 'x',
};
export const TIMELINE_TYPES = Object.keys(ICON);
const BOXED = new Set(['comment', 'communication', 'email']);
const who = (it) => esc(it.by || it.owner || 'Someone');
const stamp = (it) => {
  const t = it.when ?? it.ago ?? it.creation ?? '';
  return t === '' ? '' : `<span class="frappe-timestamp" title="${esc(it.creation ?? '')}">${esc(t)}</span>`;
};
const dayOf = (it) => String(it.creation ?? '').slice(0, 10);

function dateLabel(day, it) { return esc(it.day_label || day); }

// One-line "dot" items: "<b>by</b> did X <timestamp>"
function dotLine(it) {
  const t = String(it.type || 'info').toLowerCase();
  const by = `<strong>${who(it)}</strong>`;
  let text;
  switch (t) {
    case 'created': text = it.text ? esc(it.text) : `${by} created this`; break;
    case 'edit': text = it.text ? `${by} ${esc(it.text)}` : `${by} edited this`; break;
    case 'submit': text = `${by} submitted this document`; break;
    case 'cancel': text = `${by} cancelled this document`; break;
    case 'assignment': text = `${by} ${esc(it.text || 'assigned this')}`; break;
    case 'attachment': text = `${by} ${it.removed ? 'removed attachment' : 'attached'} <a class="text-muted" href="#">${esc(it.file || it.text || '')}</a>`; break;
    case 'like': text = `${by} liked this`; break;
    case 'share': text = `${by} ${it.removed ? 'unshared this with' : 'shared this with'} ${esc(it.shared_with || 'everyone')}`; break;
    case 'workflow': text = `${by} changed the status to <span class="indicator-pill ${esc(it.indicator || 'blue')} ellipsis"><span class="ellipsis">${esc(it.state || '')}</span></span>`; break;
    case 'label': case 'info': text = it.by ? `${by} ${esc(it.text || '')}` : esc(it.text || ''); break;
    default: text = `${by} ${esc(it.text || '')}`;
  }
  return `<div class="timeline-content">${text} ${stamp(it)}</div>`;
}

function versionBox(it) {
  const rows = (it.changes || []).map((c) => `<li>${esc(c.field)}: <strong>${c.from === undefined || c.from === null || c.from === '' ? '' : `<s>${esc(c.from)}</s> `}${esc(c.to ?? '')}</strong></li>`).join('');
  const body = rows ? `<ul class="version-diff">${rows}</ul>` : esc(it.text || '');
  return `<div class="timeline-content">${`<strong>${who(it)}</strong> changed value${(it.changes || []).length > 1 ? 's' : ''} of`} ${body} ${stamp(it)}</div>`;
}

function emailBox(it) {
  const recv = String(it.sent_or_received || 'Sent').toLowerCase() === 'received';
  const rcp = [it.to?.length && `To: ${esc(it.to.join(', '))}`, it.cc?.length && `CC: ${esc(it.cc.join(', '))}`].filter(Boolean).join(' · ');
  const atts = (it.attachments || []).map((a) => `<a class="attachment-link text-muted" href="#">${ic('paperclip', 'icon-xs')} ${esc(a)}</a>`).join(' ');
  const reply = it.reply === false ? '' : `<button class="btn btn-xs btn-default action-btn" type="button" data-action="reply">${ic('reply', 'icon-xs')} Reply</button>`
    + (it.cc?.length || (it.to?.length || 0) > 1 ? `<button class="btn btn-xs btn-default action-btn" type="button" data-action="reply-all">${ic('reply-all', 'icon-xs')} Reply All</button>` : '');
  return `<div class="timeline-content frappe-card"><div class="timeline-message-box" data-communication-type="Communication">`
    + `<span class="flex justify-between"><span class="text-muted">${avatar(it.by || '?', { size: 'small' })} <strong>${who(it)}</strong> ${recv ? 'received' : 'sent'} <span class="text-muted">${esc(it.subject || '')}</span> ${stamp(it)}</span>`
    + `<span class="actions">${reply}</span></span>`
    + (rcp ? `<div class="text-muted small recipients">${rcp}</div>` : '')
    + `<div class="content">${esc(it.text ?? it.content ?? '')}</div>${atts ? `<div class="attachments">${atts}</div>` : ''}</div></div>`;
}

function commentBoxItem(it) {
  return `<div class="timeline-content frappe-card"><div class="timeline-message-box" data-communication-type="Comment">`
    + `<span class="flex justify-between"><span class="text-muted">${avatar(it.by || '?', { size: 'small' })} <strong>${who(it)}</strong> commented ${stamp(it)}${it.edited ? ' <span class="text-muted">(edited)</span>' : ''}</span>`
    + `<span class="actions"><button class="btn btn-link action-btn icon-btn" type="button" aria-label="Edit">${ic('edit', 'icon-xs')}</button></span></span>`
    + `<div class="content">${esc(it.text ?? it.content ?? '')}</div></div></div>`;
}

export function timelineItem(it = {}) {
  let t = String(it.type || 'info').toLowerCase();
  if (t === 'communication') t = 'communication';
  const known = t in ICON ? t : 'info';
  let inner;
  if (known === 'comment') inner = commentBoxItem(it);
  else if (known === 'communication' || known === 'email') inner = emailBox(it);
  else if (known === 'version') inner = versionBox(it);
  else inner = dotLine({ ...it, type: known });
  const lead = BOXED.has(known)
    ? `<div class="timeline-badge">${ic(ICON[known])}</div>`
    : '<div class="timeline-dot"></div>';
  return `<div class="timeline-item" data-doctype="${BOXED.has(known) ? (known === 'comment' ? 'Comment' : 'Communication') : 'Version'}" data-timeline-type="${esc(known)}"${it.creation ? ` data-timestamp="${esc(it.creation)}"` : ''}>${lead}${inner}</div>`;
}

export function commentBoxHtml(user = '') {
  return `<div class="comment-box" data-ui="form.timeline.comment-box"><div class="comment-input-wrapper"><div class="comment-input-header"><div><span class="comment-title">Comments</span><span class="comment-count"></span></div></div>`
    + `<div class="comment-input-container">${avatar(user || 'You', { size: 'medium' })}<div class="frappe-control col" style="flex:1 1 0;min-width:0"><div class="ql-container ql-snow" style="height:auto"><div class="ql-editor ql-blank" style="min-height:64px;height:auto" data-placeholder="Type a reply / comment" contenteditable="true"><p><br></p></div></div></div></div>`
    + `<button class="btn hidden btn-comment btn-xs" type="button" style="margin-left:48px;">Comment</button></div></div>`;
}

export function renderTimeline(doc = {}, opts = {}) {
  const items = Array.isArray(doc.timeline) ? doc.timeline : [];
  const ctrl = opts.activityOnly ? '' : `<div class="timeline-items timeline-actions"><div class="timeline-item"><div class="timeline-content action-buttons">`
    + `<button class="btn btn-xs btn-secondary action-btn" type="button">${ic('plus', 'icon-xs')} New Email</button>`
    + `<button class="btn btn-xs btn-default action-btn" type="button">${ic('calendar', 'icon-xs')} New Event</button></div></div></div>`;
  const head = `<div class="timeline-item activity-title"><h4>Activity</h4>`
    + `<div class="flex align-items-center show-all-activity"><span style="color: var(--text-light); margin:0px 6px;">Show all activity</span><label class="switch"><input type="checkbox"${opts.showAll ? ' checked' : ''}><span class="slider round"></span></label></div></div>`;
  const shown = Number.isInteger(opts.more) && opts.more >= 0 ? items.slice(0, opts.more) : items;
  const hidden = items.length - shown.length;
  let last = null;
  const rows = shown.map((it) => {
    const d = dayOf(it);
    const sep = d && d !== last && it.separators !== false && opts.separators !== false
      ? `<div class="timeline-item timeline-date-sep" data-day="${esc(d)}"><div class="timeline-content text-muted small">${dateLabel(d, it)}</div></div>` : '';
    if (d) last = d;
    return sep + timelineItem(it);
  }).join('');
  const more = hidden > 0 ? `<div class="timeline-item timeline-load-more"><button class="btn btn-default btn-xs btn-load-more" type="button">More</button> <span class="text-muted small">${hidden} older</span></div>` : '';
  const empty = !items.length ? '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content text-muted">No activity yet</div></div>' : '';
  const cbox = opts.commentBox === false ? '' : commentBoxHtml(opts.user);
  return `${cbox}<div class="new-timeline" data-ui="form.timeline">${head}${ctrl}<div class="timeline-items">${rows}${empty}${more}</div></div>`;
}

export default renderTimeline;
