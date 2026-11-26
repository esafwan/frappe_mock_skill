// Inbox view renderer: email list (sender, subject, snippet, date, unread dot, attachment icon). Generic, deterministic.
// spec.data.rows: [{...}]. spec.view.inbox (all optional): { sender_field, subject_field, snippet_field, date_field, unread_field, read_field, attachment_field, selected }.
// Field defaults are tried in order (sender, sender_full_name, from; subject; content, snippet; communication_date, creation; seen, read; attachments).
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { avatar } from '../../kit-lib/avatars.mjs';
import { viewHead } from '../../kit-lib/viewhead.mjs';

const pick = (r, names) => { for (const n of names) if (n && r[n] !== undefined && r[n] !== null && r[n] !== '') return r[n]; return undefined; };
const plain = (s) => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const trunc = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function fmtDate(v, today) {
  if (v === undefined) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v));
  if (!m) return String(v);
  const t = today ? new Date(`${today}T00:00:00Z`) : null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
  if (t && !Number.isNaN(t) && d.getTime() === t.getTime()) { const tm = /[T ](\d{2}):(\d{2})/.exec(String(v)); return tm ? `${tm[1]}:${tm[2]}` : 'Today'; }
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
  return `${d.getUTCDate()} ${mon}${t && d.getUTCFullYear() !== t.getUTCFullYear() ? ` ${d.getUTCFullYear()}` : ''}`;
}

const CSS = `<style data-ui="inbox.layout">.inbox-view{padding-top:12px}.inbox-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:12px}.inbox-toolbar .btn{display:inline-flex;align-items:center;gap:6px}.inbox-list{border:1px solid var(--outline-gray-1,var(--kit-border));border-radius:8px;overflow:hidden;background:var(--surface-white,var(--kit-surface))}.inbox-row{display:flex;align-items:center;gap:12px;height:56px;padding:0 16px;box-sizing:border-box;border-bottom:1px solid var(--outline-gray-1,var(--kit-border));min-width:0}.inbox-row:last-child{border-bottom:0}.inbox-row.selected{background:var(--surface-gray-2,var(--kit-surface-sunken))}.inbox-row .unread-dot{flex:0 0 8px;width:8px;height:8px;border-radius:50%;background:transparent}.inbox-row.unread .unread-dot{background:var(--kit-blue)}.inbox-row .inbox-sender{flex:0 0 200px;width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inbox-row.unread .inbox-sender,.inbox-row.unread .inbox-subject{font-weight:600}.inbox-row .inbox-main{flex:1 1 auto;min-width:0;display:flex;gap:8px;white-space:nowrap;overflow:hidden}.inbox-row .inbox-subject{flex:0 1 auto;max-width:50%;overflow:hidden;text-overflow:ellipsis}.inbox-row .inbox-snippet{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--ink-gray-5,var(--kit-grey))}.inbox-row .inbox-clip{flex:0 0 16px;min-height:16px;display:flex;align-items:center;color:var(--ink-gray-5,var(--kit-grey))}.inbox-row .inbox-clip svg{width:14px;height:14px}.inbox-row .inbox-date{flex:0 0 84px;white-space:nowrap;text-align:end;font-size:12px;color:var(--ink-gray-5,var(--kit-grey))}.inbox-empty{display:flex;align-items:center;justify-content:center;min-height:240px}@media(max-width:767px){.inbox-row .inbox-sender{flex-basis:96px;width:96px}.inbox-row .inbox-snippet{display:none}.inbox-row .inbox-subject{max-width:none}}</style>`;

export default function render(spec, ctx) {
  const cfg = spec.view?.inbox || {};
    const account = cfg.email_account || spec.view?.email_account || '';
  const title = cfg.title || account || 'Inbox';
  const today = ctx.today || '2026-01-01';
  if (!ctx.today) ctx.warn?.('inbox: ctx.today missing; using 2026-01-01 for relative dates');
  const rows = Array.isArray(spec.data?.rows) ? spec.data.rows : [];
  const state = spec.view?.state;
  const all = rows.map((r, i) => {
    const sender = String(pick(r, [cfg.sender_field, 'sender_full_name', 'sender', 'from', 'owner']) ?? 'Unknown');
    const subject = String(pick(r, [cfg.subject_field, 'subject', 'title', 'name']) ?? '(no subject)');
    const snippet = trunc(plain(pick(r, [cfg.snippet_field, 'snippet', 'content', 'message', 'description']) ?? ''), 140);
    const date = fmtDate(pick(r, [cfg.date_field, 'communication_date', 'creation', 'modified']), today);
    const rf = pick(r, [cfg.read_field, 'read', 'seen']);
    const unread = cfg.unread_field ? !!r[cfg.unread_field] : r.unread !== undefined ? !!r.unread : rf !== undefined ? !Number(rf) && rf !== true : false;
    const att = pick(r, [cfg.attachment_field, 'has_attachment', 'attachments', 'attachment']);
    const hasAtt = Array.isArray(att) ? att.length > 0 : !!att && att !== '0';
    const sel = cfg.selected === i;
    return { unread, html: `<div class="inbox-row${unread ? ' unread' : ''}${sel ? ' selected' : ''}" data-ui="inbox.row.${i}" data-unread="${unread ? 1 : 0}"><span class="unread-dot" data-ui="inbox.unread.${i}"></span>${avatar(sender, { size: 'small' })}<span class="inbox-sender" data-ui="inbox.sender.${i}">${esc(sender)}</span><span class="inbox-main"><span class="inbox-subject" data-ui="inbox.subject.${i}">${esc(subject)}</span><span class="inbox-snippet" data-ui="inbox.snippet.${i}">${esc(snippet)}</span></span><span class="inbox-clip" data-ui="inbox.attachment.${i}">${hasAtt ? icon('paperclip', 'sm') : ''}</span><span class="inbox-date" data-ui="inbox.date.${i}">${esc(date)}</span></div>` };
  });
  const unreadOnly = !!cfg.unread_only;
  const items = all.filter((x) => !unreadOnly || x.unread).map((x) => x.html);
  const nUnread = all.filter((x) => x.unread).length;
  const accounts = Array.isArray(cfg.accounts) && cfg.accounts.length ? cfg.accounts : account ? [account] : [];
  const acct = accounts.length ? `<div class="inbox-account" data-ui="inbox.account"><button type="button" class="btn btn-default btn-sm" aria-haspopup="listbox">${icon('mail', 'sm')} <span>${esc(account || accounts[0])}</span> ${icon('chevron-down', 'sm')}</button></div>` : '';
  const toolbar = `<div class="inbox-toolbar" data-ui="inbox.toolbar">${acct}<button type="button" class="btn btn-sm ${unreadOnly ? 'btn-primary' : 'btn-default'}" data-ui="inbox.unread-filter" aria-pressed="${unreadOnly}">Unread <bdi>${nUnread}</bdi></button></div>`;
  let body;
  if (state === 'loading') body = `<div class="inbox-empty text-muted" data-ui="inbox.loading">Loading...</div>`;
  else if (!items.length) body = `<div class="inbox-empty text-muted" data-ui="inbox.empty">No emails to show</div>`;
  else body = `<div class="inbox-list" data-ui="inbox.list">${items.join('')}</div>`;
  const head = viewHead(spec, ctx, { view: 'inbox', label: title, std: false });
  return { head, main: `${CSS}<div class="desk-page inbox-view" data-ui="inbox.page">${toolbar}${body}</div>`, title };
}
