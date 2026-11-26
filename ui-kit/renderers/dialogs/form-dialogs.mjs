// Named form-level dialogs: assign_to, share, attach, add_tag, rename, email, msgprint_list,
// missing_mandatory, modified_conflict, server_error. Generic, deterministic, no deps.
// Frame comes from renderers/dialog.mjs; bodies are real field renderers (fields) or bespoke html (body).
import { esc } from '../../kit-lib/util.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { renderDialog } from '../dialog.mjs';

const SIZE = { sm: 'small', md: 'default', lg: 'large', xl: 'extra-large' };

// Named dialogs are drawn by renderDialog (one frame, dialog.N hooks); `data-ui="dialog:<id>"` is kept as an alias on .modal-content.
function frame({ id, title, size = 'md', body = '', fields, values, primary, secondary, extraActions = '', indicator }, n, kit) {
  return renderDialog({ kind: id, title, size: SIZE[size] || 'default', body, fields, values, indicator, primary_action: primary || '', secondary_action: secondary || '', custom_actions: extraActions, attrs: `data-ui="dialog:${esc(id)}" data-dialog="${esc(id)}"` }, n, kit);
}

const ctl = (type, name, label, value = '', o = {}) => {
  const req = o.reqd ? ' reqd' : '';
  const v = esc(value);
  let input;
  if (type === 'Select') input = `<select class="input-with-feedback form-control" data-fieldname="${name}">${(o.options || []).map((x) => `<option${x === value ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  else if (type === 'Text') input = `<textarea class="input-with-feedback form-control" rows="${o.rows || 3}" data-fieldname="${name}" placeholder="${esc(o.placeholder || '')}">${v}</textarea>`;
  else if (type === 'Check') return `<div class="frappe-control" data-fieldtype="Check" data-fieldname="${name}"><div class="checkbox"><label><input type="checkbox" class="input-with-feedback"${value ? ' checked' : ''}><span class="label-area">${esc(label)}</span></label></div></div>`;
  else input = `<input type="text" class="input-with-feedback form-control" data-fieldname="${name}" value="${v}" placeholder="${esc(o.placeholder || '')}"${o.readonly ? ' disabled' : ''}>`;
  return `<div class="frappe-control" data-fieldtype="${type}" data-fieldname="${name}" data-ui="field:${name}"><div class="form-group"><div class="clearfix"><label class="control-label${req}">${esc(label)}</label></div><div class="control-input-wrapper"><div class="control-input">${input}</div></div>${o.desc ? `<p class="help-box small text-muted">${esc(o.desc)}</p>` : ''}</div></div>`;
};

const chips = (arr = []) => arr.map((t) => `<span class="tb-tag tag-chip">${esc(t)}</span>`).join('');
const tabs = (items, active) => `<ul class="nav form-tabs">${items.map((t, i) => `<li class="nav-item"><a class="nav-link${i === active ? ' active' : ''}" data-tab="${esc(t.toLowerCase().replace(/\W+/g, '_'))}">${esc(t)}</a></li>`).join('')}</ul>`;

function assignTo(o, n, kit) {
  const fields = [
    { fieldname: 'assign_to', fieldtype: 'Link', options: 'User', label: 'Assign to', reqd: 1 },
    { fieldname: 'myself', fieldtype: 'Check', label: 'Assign to me' },
    { fieldname: 'description', fieldtype: 'Small Text', label: 'Comment' },
    { fieldname: 'date', fieldtype: 'Date', label: 'Complete By' },
    { fieldname: 'priority', fieldtype: 'Select', label: 'Priority', options: 'Low\nMedium\nHigh', default: 'Medium' },
  ];
  const values = { assign_to: o.assign_to || '', myself: o.myself ? 1 : 0, description: o.description || '', date: o.date || '', priority: o.priority || 'Medium' };
  return frame({ id: 'assign_to', title: o.title || 'Add to ToDo', fields, values, primary: 'Add', secondary: 'Cancel' }, n, kit);
}
function share(o, n, kit) {
  const rows = (o.users || []).map((u, i) => `<tr data-row="${i}"><td>${esc(u.user)}</td><td><input type="checkbox"${u.read ? ' checked' : ''}></td><td><input type="checkbox"${u.write ? ' checked' : ''}></td><td><input type="checkbox"${u.share ? ' checked' : ''}></td></tr>`).join('');
  const body = `<table class="table table-bordered share-table"><thead><tr><th>User</th><th>Can Read</th><th>Can Write</th><th>Can Share</th></tr></thead><tbody><tr class="share-everyone"><td>Everyone</td><td><input type="checkbox"${o.everyone ? ' checked' : ''}></td><td></td><td></td></tr>${rows}</tbody></table>${ctl('Link', 'user', 'Share this document with', '', { placeholder: 'Select user' })}`;
  return frame({ id: 'share', title: o.title || `Share ${o.name || 'document'}`, body }, n, kit);
}
function attach(o, n, kit) {
  const names = ['My Device', 'Link', 'Camera'];
  const act = Math.max(0, names.indexOf(o.tab ? { device: 'My Device', link: 'Link', camera: 'Camera' }[String(o.tab).toLowerCase()] || o.tab : 'My Device'));
  const pane = [
    `<div class="file-upload-area"><div class="dz-message">${icon('upload')}<p>Drag and drop files here or upload from</p><div>${button('My Device', { ui: 'dialog:attach.device' })}${button('Library', { ui: 'dialog:attach.library' })}</div></div></div>${(o.files || []).map((f) => `<div class="file-upload-row"><span>${esc(f.name)}</span><span class="text-muted">${esc(f.size || '')}</span></div>`).join('')}${ctl('Check', 'private', 'Private', o.private !== false)}`,
    ctl('Data', 'file_url', 'Link', o.url || '', { placeholder: 'Attach a web link' }),
    `<div class="webcam-area"><div class="webcam-placeholder">${icon('camera')}</div>${button('Take Photo', { primary: true, ui: 'dialog:attach.capture' })}</div>`,
  ];
  const body = tabs(names, act) + `<div class="tab-content">${pane[act]}</div>`;
  return frame({ id: 'attach', title: o.title || 'Attach', size: 'lg', body, primary: act === 0 ? 'Upload' : act === 1 ? 'Upload' : 'Capture', secondary: 'Set all private' }, n, kit);
}
function addTag(o, n, kit) {
  const body = o.tags?.length ? `<div class="tags-list">${chips(o.tags)}</div>` : '';
  const fields = [{ fieldname: 'tag', fieldtype: 'Data', label: 'New Tag', placeholder: 'Add a tag' }];
  return frame({ id: 'add_tag', title: o.title || 'Add Tag', size: 'sm', body, fields, values: { tag: o.tag || '' }, primary: 'Add' }, n, kit);
}
function rename(o, n, kit) {
  const fields = [{ fieldname: 'new_name', fieldtype: 'Data', label: 'New Name', reqd: 1 }, ...(o.merge !== false ? [{ fieldname: 'merge', fieldtype: 'Check', label: 'Merge with existing' }] : [])];
  return frame({ id: 'rename', title: o.title || `Rename ${o.name || ''}`.trim(), size: 'sm', fields, values: { new_name: o.new_name || o.name || '', merge: o.merge_checked ? 1 : 0 }, primary: 'Rename Document' }, n, kit);
}
function email(o, n, kit) {
  const body = ctl('Data', 'recipients', 'To', (o.to || []).join(', '), { reqd: true })
    + `<div class="email-cc-bcc"><a class="text-muted">CC</a> <a class="text-muted">BCC</a></div>`
    + ctl('Data', 'subject', 'Subject', o.subject || '', { reqd: true })
    + ctl('Select', 'email_template', 'Email Template', o.template || '', { options: ['', ...(o.templates || [])] })
    + `<div class="frappe-control" data-fieldtype="Text Editor" data-fieldname="content" data-ui="field:content"><div class="form-group"><label class="control-label reqd">Message</label><div class="ql-editor">${esc(o.message || '')}</div></div></div>`
    + `<div class="email-attachments">${(o.attachments || []).map((a) => `<span class="tb-tag">${icon('paperclip')}${esc(a)}</span>`).join('')}${button('Attach File', { icon: 'paperclip', variant: 'ghost', ui: 'dialog:email.attach' })}</div>`
    + ctl('Check', 'send_me_a_copy', 'Send me a copy', o.copy) + ctl('Check', 'attach_document_print', 'Attach Document Print', o.print);
  return frame({ id: 'email', title: o.title || 'New Email', size: 'lg', body, primary: 'Send', secondary: 'Discard', extraActions: button('Add Signature', { variant: 'ghost' }) }, n, kit);
}
function msgprintList(o, n, kit) {
  const items = (o.messages || []).map((m) => `<li>${esc(typeof m === 'string' ? m : m.message)}</li>`).join('');
  const body = `<div class="msgprint">${o.intro ? `<p>${esc(o.intro)}</p>` : ''}<ul class="msgprint-list">${items}</ul></div>`;
  return frame({ id: 'msgprint_list', title: o.title || 'Message', indicator: o.indicator || 'red', body, primary: 'Close' }, n, kit);
}
function missingMandatory(o, n, kit) {
  const items = (o.fields || []).map((f) => `<li>${esc(typeof f === 'string' ? f : f.label)}${f?.table ? ` <span class="text-muted">(${esc(f.table)}${f.row ? ` Row ${esc(f.row)}` : ''})</span>` : ''}</li>`).join('');
  const body = `<div class="msgprint"><p>Mandatory fields required in ${esc((o.doctype && typeof o.doctype === 'object' ? o.doctype.name : o.doctype) || 'document')}</p><ul>${items}</ul></div>`;
  return frame({ id: 'missing_mandatory', title: o.title || 'Missing Fields', indicator: 'red', body, primary: 'Close' }, n, kit);
}
function modifiedConflict(o, n, kit) {
  const body = `<div class="msgprint"><p>${esc(o.message || 'Document has been modified after you have opened it')} ${o.modified ? `(${esc(o.modified)})` : ''}. Please refresh to get the latest document.</p></div>`;
  return frame({ id: 'modified_conflict', title: o.title || 'Error', indicator: 'red', body, primary: 'Refresh', secondary: 'Close' }, n, kit);
}
function serverError(o, n, kit) {
  const body = `<div class="msgprint"><p>${esc(o.message || 'Server Error')}</p><details open class="server-traceback"><summary>Traceback</summary><pre class="traceback">${esc(o.traceback || 'Traceback (most recent call last):\n  File "handler", line 1, in handle\nException: error')}</pre></details></div>`;
  return frame({ id: 'server_error', title: o.title || 'Server Error', size: 'lg', indicator: 'red', body, primary: 'Report', secondary: 'Close' }, n, kit);
}

export const FORM_DIALOGS = {
  assign_to: assignTo, share, attach, add_tag: addTag, rename, email,
  msgprint_list: msgprintList, missing_mandatory: missingMandatory, modified_conflict: modifiedConflict, server_error: serverError,
};
export const FORM_DIALOG_IDS = Object.freeze(Object.keys(FORM_DIALOGS));

/** Render a named dialog; unknown id returns ''. opts are the overlay's fields. */
export function renderFormDialog(id, opts = {}, n = 0, kit = {}) {
  const f = FORM_DIALOGS[id];
  return f ? f(opts || {}, n, kit) : '';
}
export const isFormDialog = (id) => Object.prototype.hasOwnProperty.call(FORM_DIALOGS, id);
