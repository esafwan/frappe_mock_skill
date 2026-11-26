// Safe Frappe depends_on evaluator. No eval/new Function. true|false|null (null = cannot evaluate statically).
class Unsupported extends Error {}
const bad = () => { throw new Unsupported(); };

function tokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, out = '';
      while (j < s.length && s[j] !== c) { if (s[j] === '\\' && j + 1 < s.length) { j++; } out += s[j++]; }
      if (j >= s.length) bad();
      t.push({ k: 'str', v: out }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); t.push({ k: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(s.slice(i)); t.push({ k: 'id', v: m[0] }); i += m[0].length; continue;
    }
    const three = s.slice(i, i + 3), two = s.slice(i, i + 2);
    if (three === '===' || three === '!==') { t.push({ k: 'op', v: three }); i += 3; continue; }
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(two)) { t.push({ k: 'op', v: two }); i += 2; continue; }
    if ('<>!()[],.'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
    bad();
  }
  return t;
}

const truthy = (v) => Array.isArray(v) ? true : !!v;
const cint = (v) => { const n = parseInt(v, 10); return Number.isNaN(n) ? 0 : n; };
const flt = (v) => { const n = parseFloat(v); return Number.isNaN(n) ? 0 : n; };
const loose = (a, b) => (a == null && b == null) ? true : a == b; // eslint-disable-line eqeqeq

function parse(tokens, doc) {
  let p = 0;
  const peek = () => tokens[p], isOp = (v) => peek() && peek().k === 'op' && peek().v === v;
  const eat = (v) => { if (!isOp(v)) bad(); p++; };
  function or() { let l = and(); while (isOp('||')) { p++; const r = and(); l = truthy(l) ? l : r; } return l; }
  function and() { let l = eq(); while (isOp('&&')) { p++; const r = eq(); l = truthy(l) ? r : l; } return l; }
  function eq() {
    let l = rel();
    while (peek() && peek().k === 'op' && ['==', '!=', '===', '!=='].includes(peek().v)) {
      const o = tokens[p++].v, r = rel();
      const e = o.length === 3 ? l === r : loose(l, r);
      l = o[0] === '!' ? !e : e;
    }
    return l;
  }
  function rel() {
    let l = unary();
    while (peek() && peek().k === 'op' && ['<', '>', '<=', '>='].includes(peek().v)) {
      const o = tokens[p++].v, r = unary();
      l = o === '<' ? l < r : o === '>' ? l > r : o === '<=' ? l <= r : l >= r;
    }
    return l;
  }
  function unary() { if (isOp('!')) { p++; return !truthy(unary()); } return postfix(); }
  function args() { const a = []; eat('('); if (!isOp(')')) { do { a.push(or()); if (isOp(',')) p++; else break; } while (true); } eat(')'); return a; }
  function postfix() {
    const t = peek(); if (!t) bad();
    let v;
    if (t.k === 'num' || t.k === 'str') { p++; v = t.v; }
    else if (t.k === 'op' && t.v === '(') { p++; v = or(); eat(')'); }
    else if (t.k === 'op' && t.v === '[') { p++; v = []; if (!isOp(']')) { do { v.push(or()); if (isOp(',')) p++; else break; } while (true); } eat(']'); }
    else if (t.k === 'id') {
      p++;
      if (t.v === 'true') v = true; else if (t.v === 'false') v = false;
      else if (t.v === 'null' || t.v === 'undefined') v = null;
      else if (t.v === 'doc') {
        if (!isOp('.')) bad(); p++;
        const n = tokens[p++]; if (!n || n.k !== 'id') bad();
        v = doc ? doc[n.v] : undefined;
        if (v === undefined) v = null;
        if (isOp('.')) {
          p++; const m = tokens[p++]; if (!m || m.k !== 'id') bad();
          if (m.v === 'length') v = (v == null) ? 0 : (typeof v === 'string' || Array.isArray(v)) ? v.length : bad();
          else bad();
        }
      } else if (['cint', 'flt', 'in_list'].includes(t.v) && isOp('(')) {
        const a = args();
        if (t.v === 'cint') v = cint(a[0]); else if (t.v === 'flt') v = flt(a[0]);
        else { if (!Array.isArray(a[0])) bad(); v = a[0].includes(a[1]); }
      } else bad();
    } else bad();
    // in([...]) style: x.in([...]) unsupported; support `in(` handled via in_list only
    if (peek() && peek().k === 'id' && peek().v === 'in') {
      p++; eat('('); const l = args2(); eat(')'); return l.includes(v);
    }
    return v;
  }
  function args2() { const a = []; if (isOp('[')) { p++; if (!isOp(']')) { do { a.push(or()); if (isOp(',')) p++; else break; } while (true); } eat(']'); return a; } do { a.push(or()); if (isOp(',')) p++; else break; } while (true); return a; }
  const v = or(); if (p !== tokens.length) bad();
  return v;
}

export function evalDepends(expr, doc) {
  if (expr == null) return null;
  if (typeof expr === 'boolean') return expr;
  if (typeof expr !== 'string') return null;
  const s = expr.trim();
  if (!s) return null;
  try {
    if (s.startsWith('eval:')) return truthy(parse(tokenize(s.slice(5)), doc));
    if (s.startsWith('eval(') || s.startsWith('fn:') || s.startsWith('frappe.')) return null;
    if (/^[A-Za-z_]\w*$/.test(s)) { const v = doc ? doc[s] : null; return truthy(v) && v !== '0'; }
    return null;
  } catch (e) { if (e instanceof Unsupported) return null; return null; }
}
