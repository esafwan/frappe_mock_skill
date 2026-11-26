// Workflow actions for the form head: transitions available to the user, rendered as an "Actions" dropdown,
// plus the workflow state pill. Generic: all names come from meta.workflow / doc / ctx.user.
import { buttonGroup } from '../../kit-lib/buttons.mjs';
import { indicatorPill, guess_colour } from '../../kit-lib/indicators.mjs';

const COLOURS = new Set(['gray', 'green', 'red', 'orange', 'yellow', 'blue', 'cyan', 'purple', 'pink']);
const norm = (c) => { const k = String(c ?? '').toLowerCase(); return COLOURS.has(k) ? k : undefined; };

/** Roles of the viewing user: spec.ctx.user.roles, else spec.ctx.roles; string or array. [] when unknown. */
export function userRoles(spec = {}) {
  const u = spec.ctx?.user;
  const r = (u && typeof u === 'object' ? u.roles : undefined) ?? spec.ctx?.roles ?? [];
  return Array.isArray(r) ? r.map(String) : [String(r)];
}

const isAdmin = (spec, roles) => roles.includes('System Manager') || roles.includes('Administrator')
  || (spec.ctx?.user && typeof spec.ctx.user === 'object' && spec.ctx.user.name === 'Administrator');

/**
 * Transitions from the document's current state that the user may run.
 * meta.workflow: { state_field, transitions:[{state, action, next_state, allowed, allow_self_approval?}] }
 * Returns [{action, next_state}] in definition order, de-duplicated by action.
 * No roles known (ctx.user.roles absent): nothing is filtered by role.
 */
export function workflowTransitions(spec = {}, meta = {}, doc = {}) {
  const wf = meta.workflow;
  if (!wf || typeof wf !== 'object' || doc.__islocal || doc.__unsaved) return [];
  const field = wf.state_field || 'workflow_state';
  const cur = doc[field];
  if (cur === undefined || cur === null || cur === '') return [];
  const roles = userRoles(spec);
  const known = spec.ctx?.user?.roles !== undefined || spec.ctx?.roles !== undefined;
  const admin = isAdmin(spec, roles);
  const me = spec.ctx?.user && typeof spec.ctx.user === 'object' ? spec.ctx.user.name : undefined;
  const seen = new Set(); const out = [];
  for (const t of wf.transitions || []) {
    if (String(t.state) !== String(cur) || !t.action || seen.has(t.action)) continue;
    if (known && !admin && t.allowed && !roles.includes(String(t.allowed))) continue;
    if (t.allow_self_approval === 0 || t.allow_self_approval === false) {
      if (me && doc.owner && me === doc.owner) continue;
    }
    seen.add(t.action); out.push({ action: t.action, next_state: t.next_state });
  }
  return out;
}

/** "Actions" dropdown markup; empty string when the user has no transitions. */
export function renderWorkflowActions(spec, meta, doc) {
  const tr = workflowTransitions(spec, meta, doc);
  return tr.length ? buttonGroup('Actions', tr.map((t) => ({ label: t.action }))).replace('class="dropdown-menu "', 'class="dropdown-menu dropdown-menu-right "') : '';
}

/** Workflow state pill; colour from workflow.styles / state style, else guessed. Empty string without a state. */
export function workflowStatePill(meta = {}, doc = {}) {
  const wf = meta.workflow;
  if (!wf || typeof wf !== 'object') return '';
  const s = doc[wf.state_field || 'workflow_state'];
  if (!s) return '';
  const st = (wf.states || []).find((x) => x.state === s);
  const colour = norm(wf.styles?.[s]) || norm(st?.style) || norm(st?.colour) || guess_colour(s);
  return indicatorPill({ label: s, colour }, { page: true });
}
