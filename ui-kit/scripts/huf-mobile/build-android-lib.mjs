// huf-android: shared builders (icons + component templates). Used by build-android.mjs. Hand-authored, no JS at render time.
const P = {
  menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  fwd: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
  check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  mic: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15a.998.998 0 0 0-.98-.85c-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08a6.993 6.993 0 0 0 5.91-5.78c.1-.6-.39-1.14-1-1.14z',
  eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  lang: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
  key: 'M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  send: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
  folder: 'M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
  person: 'M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 9c2.7 0 5.8 1.29 6 2v1H6v-1c.2-.71 3.3-2 6-2M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z',
  group: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  chat: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z',
  cal: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5zm2 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z',
  doc: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z',
  code: 'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  barbox: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z',
  textbox: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z',
  photos: 'M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67 1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z',
  camera: 'M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  robot: 'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z',
  laptop: 'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
  refresh: 'M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  attach: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
  stop: 'M6 6h12v12H6z', up: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
  dl: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
};
export const ico = (n, cls = '') => `<svg class="ha-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;
export const ICON_NAMES = Object.keys(P);
const nav = [['chat', 'Chat'], ['folder', 'Projects'], ['group', 'Agents'], ['person', 'Account'], ['cal', 'Automations']];
export const NAV = nav;
const STATUS = `<div class="ha-status"><span class="time">9:41</span><svg class="wifi" viewBox="0 0 17 16"><path d="M8.5 15.5 0 5.2C2.3 3.2 5.2 2 8.5 2S14.7 3.2 17 5.2z"/></svg><svg class="bat" viewBox="0 0 9 17"><path d="M6 0H3v1.5H1.5A1.5 1.5 0 0 0 0 3v12.5A1.5 1.5 0 0 0 1.5 17h6A1.5 1.5 0 0 0 9 15.5V3A1.5 1.5 0 0 0 7.5 1.5H6z"/></svg></div>`;

/** Component definitions: id -> {name, desc, slots:{k:{sample,type,maxLength}}, tpl, states:{name:{slots,note}}}. {{k}} markers. */
export const C = {};
const def = (id, o) => { C['huf-android-' + id] = { id: 'huf-android-' + id, ...o }; };
const S = (sample, type = 'text', maxLength = 60) => ({ sample, type, maxLength });

def('device-shell', { name: 'Android device shell (Pixel 5 viewport 412x892: status bar 9:41, wifi, battery, gesture pill)', root: 'device',
  desc: 'Frame for every screen. Put the screen body in `content` and any scrim/sheet/dialog/drawer in `overlay`. The status bar and gesture pill stay above scrims (as on device).',
  slots: { content: S('', 'html', 99999), overlay: S('', 'html', 99999) },
  tpl: `<div class="ha-device" data-ui="huf-android-device-shell">${STATUS}<div class="ha-body">{{content}}</div>{{overlay}}<div class="ha-gesture"></div></div>` });

def('bottom-nav', { name: 'Bottom navigation (Chat / Projects / Agents / Account / Automations)', desc: 'Five tabs. Mark the active tab by passing "on" to the matching *_on slot.',
  slots: Object.fromEntries(nav.map(([, l]) => [l.toLowerCase() + '_on', S(l === 'Chat' ? 'on' : '', 'class', 2)])),
  tpl: `<nav class="ha-nav" data-ui="huf-android-bottom-nav">${nav.map(([i, l]) => `<div class="it {{${l.toLowerCase()}_on}}" data-ui="huf-android-bottom-nav.${l.toLowerCase()}">${ico(i)}<span>${l}</span></div>`).join('')}</nav>`,
  states: Object.fromEntries(nav.map(([, l]) => [l.toLowerCase() + '-active', { slots: Object.fromEntries(nav.map(([, m]) => [m.toLowerCase() + '_on', m === l ? 'on' : ''])) }])) });

def('top-app-bar', { name: 'Top app bar (menu, title, subtitle, optional project line, overflow)', desc: 'Chat header. variant "two" (title+subtitle) or "three" (adds the teal "Project: …" line).',
  slots: { variant: S('two', 'class', 5), title: S('New conversation', 'text', 34), subtitle: S('Start a conversation', 'text', 34), project_line: S('', 'html', 60) },
  tpl: `<header class="ha-appbar {{variant}}" data-ui="huf-android-top-app-bar"><div class="menu" data-ui="huf-android-top-app-bar.menu">${ico('menu')}</div><div class="titles"><div class="t">{{title}}</div><div class="st">{{subtitle}}</div>{{project_line}}</div><div class="more" data-ui="huf-android-top-app-bar.overflow">${ico('more')}</div></header>`,
  states: { 'with-project': { slots: { variant: 'three', title: 'Overdue receivables summary', subtitle: 'Workspace', project_line: '<div class="pj">Project: Receivables</div>' } } } });

def('search-field', { name: 'Search field (outlined, leading search icon)', desc: 'Used on Agents and Projects. The drawer variant is the pill `huf-android-search-pill`.',
  slots: { placeholder: S('Search agents, providers, or models', 'text', 44) },
  tpl: `<div class="ha-field ha-sf" data-ui="huf-android-search-field"><div class="box">${ico('search')}<span class="v" style="margin-left:14px;color:var(--ha-secondary)">{{placeholder}}</span></div></div>` });

def('text-field', { name: 'Outlined text field (label/placeholder, supporting text, trailing icon, focus/error)', desc: 'Material 3 outlined field. state: "" | "focus" | "err" | "floated" | "floated focus".',
  slots: { state: S('', 'class', 14), label: S('Server', 'text', 24), value: S('', 'text', 40), support: S('Example: https://your-workspace.example.com', 'text', 70), trailing: S('', 'html', 99) },
  tpl: `<div class="ha-field {{state}}" data-ui="huf-android-text-field"><span class="lbl">{{label}}</span><div class="box"><span class="v" style="color:{{value_color}}">{{shown}}</span>{{trailing}}</div><div class="sup">{{support}}</div></div>`,
  pre: (v) => ({ shown: v.value || v.label, value_color: v.value ? 'var(--ha-ink)' : 'var(--ha-secondary)', state: (v.state || '') + (v.value && !/floated/.test(v.state || '') ? ' floated' : '') }),
  states: { focus: { slots: { state: 'focus', value: 'https://acme.example.com' } }, error: { slots: { state: 'err', value: 'acme', support: 'Enter a valid server address' } } } });

def('segmented-buttons', { name: 'Segmented buttons (Appearance / Language)', desc: 'Three-option single choice; selected segment shows a check and the accent tint.',
  slots: { a: S('System', 'text', 12), b: S('Light', 'text', 12), c: S('Dark', 'text', 12), a_on: S('on', 'class', 2), b_on: S('', 'class', 2), c_on: S('', 'class', 2), a_chk: S(ico('check'), 'html', 300), b_chk: S('', 'html', 300), c_chk: S('', 'html', 300) },
  tpl: `<div class="ha-seg" data-ui="huf-android-segmented-buttons"><div class="o {{a_on}}">{{a_chk}}{{a}}</div><div class="o {{b_on}}">{{b_chk}}{{b}}</div><div class="o {{c_on}}">{{c_chk}}{{c}}</div></div>`,
  states: { 'light-selected': { slots: { a_on: '', a_chk: '', b_on: 'on', b_chk: ico('check') } }, 'dark-selected': { slots: { a_on: '', a_chk: '', c_on: 'on', c_chk: ico('check') } } } });

def('signin-form', { name: 'Sign-in form (heading + locale, Server/Email/Password fields, Sign in, OR, Use an API key)', desc: 'Connect screen body. Button state: "disabled" until all fields are filled.',
  slots: { lead: S('Sign in to your workspace.', 'text', 40), hint: S('Enter your server, email, and password to continue.', 'text', 60), locale: S('System', 'text', 10), btn_state: S('disabled', 'class', 8), server: S('Server', 'text', 40), email: S('Email', 'text', 40), password: S('Password', 'text', 40), server_color: S('var(--ha-secondary)', 'css', 40), email_color: S('var(--ha-secondary)', 'css', 40), password_color: S('var(--ha-secondary)', 'css', 40) },
  tpl: `<div class="ha-signin" data-ui="huf-android-signin-form"><div class="hd"><div class="logo">HUF</div><div class="ha-locale" data-ui="huf-android-signin-form.locale">${ico('lang')}<span>{{locale}}</span></div></div><div class="lead">{{lead}}</div>
<div class="ha-field" style="margin-top:30px"><div class="box"><span class="v" style="color:{{server_color}}">{{server}}</span></div><div class="sup">Example: https://your-workspace.example.com</div></div>
<div class="ha-field" style="margin-top:15px"><div class="box"><span class="v" style="color:{{email_color}}">{{email}}</span></div></div>
<div class="ha-field" style="margin-top:22px"><div class="box"><span class="v" style="color:{{password_color}}">{{password}}</span><span class="tr">${ico('eye')}</span></div></div>
<div class="ha-hint">{{hint}}</div><div class="ha-btn filled {{btn_state}}" style="margin-top:9px" data-ui="huf-android-signin-form.submit">Sign in</div><div class="ha-or">OR</div><div class="ha-btn outlined" data-ui="huf-android-signin-form.api-key">${ico('key')}Use an API key</div></div>`,
  states: { ready: { slots: { btn_state: '', server: 'https://acme.example.com', email: 'maya@acme.example.com', password: '••••••••••', server_color: 'var(--ha-ink)', email_color: 'var(--ha-ink)', password_color: 'var(--ha-ink)' } } } });

def('account-rows', { name: 'Account rows (server value, saved server with confirm/remove, Add another server, Remote computers)', desc: 'Account tab content block.',
  slots: { server: S('http://10.0.2.2:8765', 'text', 40), saved_name: S('mock@huf.local', 'text', 30), saved_url: S('http://10.0.2.2:8765', 'text', 40) },
  tpl: `<div data-ui="huf-android-account-rows"><div class="ha-lab" style="font-size:14.5px;color:var(--ha-secondary);margin:31px 0 0 16px">Server</div><div style="font-size:16px;margin-top:11px">{{server}}</div>
<div style="font-size:14.5px;color:var(--ha-secondary);margin:40px 0 0 16px">Saved servers</div><div style="display:flex;align-items:center;margin:18px 0 0 6px"><div style="flex:1"><div style="font-size:17px;line-height:20px">{{saved_name}}</div><div style="font-size:14.5px;line-height:18px;color:var(--ha-secondary)">{{saved_url}}</div></div><span style="color:var(--ha-accent);margin-right:12px">${ico('check')}</span><span style="color:var(--ha-secondary);margin-right:4px">${ico('close')}</span></div>
<div class="ha-btn outlined ha-soft" style="height:42px;margin-top:14px;color:var(--ha-ink);font-size:16.5px;border-radius:14px;border-color:var(--ha-hairline);background:var(--ha-surface)">Add another server</div><div class="ha-btn outlined ha-soft" style="height:42px;margin-top:19px;color:var(--ha-ink);font-size:16.5px;border-radius:14px;border-color:var(--ha-hairline);background:var(--ha-surface)">${ico('laptop')}Remote computers</div></div>` });

def('agent-card', { name: 'Agent card (name, description, model; selected state with check)', desc: 'Agents tab list item. sel_class "sel" = currently selected agent; disabled agents render dimmed.',
  slots: { name: S('Hub Orchestrator', 'text', 30), description: S('Routes work across finance, documents and field agents', 'text', 90), model: S('claude-sonnet-5', 'text', 30), sel_class: S('sel', 'class', 10), check: S(ico('check'), 'html', 300) },
  tpl: `<div class="ha-agent2 {{sel_class}}" data-ui="huf-android-agent-card"><div class="tx"><div class="n">{{name}}</div><div class="d">{{description}}</div><div class="m">{{model}}</div></div>{{check}}</div>`,
  states: { unselected: { slots: { sel_class: '', check: '', name: 'Falcon Arabic Test', description: 'Arabic-first assistant for bilingual customer replies', model: 'falcon-arabic-7b' } } } });

def('project-card', { name: 'Project card (name, description) and projects empty state', desc: 'Projects tab list item.',
  slots: { name: S('Receivables', 'text', 30), description: S('Ageing, reminders and collections follow-up', 'text', 90) },
  tpl: `<div class="ha-pcard" data-ui="huf-android-project-card"><div class="n">{{name}}</div><div class="d">{{description}}</div></div>` });
def('empty-state', { name: 'Empty state (icon, title, helper)', desc: 'No projects / no scheduled automations / No messages yet.',
  slots: { text: S('No messages yet.', 'text', 60) }, tpl: `<div class="ha-emptyline" data-ui="huf-android-empty-state">{{text}}</div>` });

def('composer', { name: 'Message composer (attach, input, mic/send, attachment chips)', desc: 'States by slot preset: empty (mic), draft (typed text + send), attachment (chip above), recording.',
  slots: { chips: S('', 'html', 400), input: S('<span class="ph">Write a message…</span>', 'html', 200), action: S(`<div class="act">${ico('mic')}</div>`, 'html', 300) },
  tpl: `<div class="ha-composer-wrap" data-ui="huf-android-composer"><div class="ha-composer">{{chips}}<div class="plus">${ico('add')}</div>{{input}}{{action}}</div></div>`,
  states: { draft: { slots: { input: '<span class="txt">Send the November promo to my VIP list</span>', action: `<div class="act"><div class="send">${ico('up')}</div></div>` } },
    attachment: { slots: { chips: '', input: '<span class="txt">Summarise this invoice</span>', action: `<div class="act"><div class="send">${ico('up')}</div></div>` }, note: 'pair with huf-android-attachment-chip above the composer' },
    recording: { slots: { input: '<span class="ph" style="color:var(--ha-danger)">Recording… 0:07</span>', action: `<div class="act" style="color:var(--ha-danger)">${ico('stop')}</div>` } } } });

def('user-bubble', { name: 'User message bubble', desc: 'Right-aligned warm bubble (userBubble token).', slots: { text: S('Send the November promo to my VIP list.', 'text', 400) }, tpl: `<div class="ha-user" data-ui="huf-android-user-bubble">{{text}}</div>` });
def('assistant-text', { name: 'Assistant message text (no bubble)', desc: 'Plain body text on the canvas.', slots: { text: S('I can send the promo_nov WhatsApp template to 120 recipients. This needs your approval first.', 'text', 600) }, tpl: `<div class="ha-assistant" data-ui="huf-android-assistant-text">{{text}}</div>` });

const aprRows = `<div class="row">Recipients: {{recipients}}</div><div class="row">Template: {{template}}</div><div class="row">Channel: {{channel}}</div><div class="sample">Sample: {{sample}}</div>`;
def('approval-card', { name: 'Approval (confirmation) card: Pending / Sending / Approved / Denied', desc: 'Confirmation card for approval-gated tool calls. Pass state class and the matching footer (`footer` slot).',
  slots: { state: S('', 'class', 12), title: S('Send WhatsApp broadcast', 'text', 40), status: S('Pending', 'text', 14), recipients: S('120', 'text', 6), template: S('promo_nov', 'text', 30), channel: S('whatsapp', 'text', 20), sample: S('Hi Asha, ...', 'text', 90),
    footer: S(`<div class="acts"><div class="ha-btn-approve" data-ui="huf-android-approval-card.approve">Approve</div><div class="ha-btn-deny" data-ui="huf-android-approval-card.deny">Deny</div></div>`, 'html', 600) },
  tpl: `<div class="ha-approval {{state}}" data-ui="huf-android-approval-card"><div class="hd"><div class="ti">{{title}}</div><div class="stt">{{status}}</div></div>${aprRows}{{footer}}</div>`,
  states: { sending: { slots: { status: 'Sending…', footer: '<div class="busy"><span class="ha-spin"></span>Sending…</div>' } },
    approved: { slots: { state: 'approved', status: 'Approved', footer: `<div class="res">${ico('check')}Sent to 120 recipients</div>` } },
    denied: { slots: { state: 'denied', status: 'Denied', footer: `<div class="res">${ico('close')}Denied</div>` } },
    'pending-expiring': { slots: { state: 'disabled', recipients: '128', template: 'payment_reminder_v2', channel: 'WhatsApp', sample: 'Hi Ahmed, your invoice INV-2041 for AED 4,200 is due on 20 Nov.', footer: '<div class="exp">Expires in 8:38</div><div class="acts"><div class="ha-btn-approve">Approve</div><div class="ha-btn-deny">Deny</div></div>' } } } });

def('table-artifact', { name: 'Table artifact (markdown table, horizontally clipped)', desc: 'Rich message table; wide tables clip at the screen edge (horizontal scroll on device).',
  slots: { h1: S('Customer', 'text', 14), h2: S('Open (AED)', 'text', 14), h3: S('Days', 'text', 8), r1: S('Gulf Steel|412,900|47', 'text', 60), r2: S('Al Noor Trading|88,300|12', 'text', 60), r3: S('Marina Logistics|61,450|31', 'text', 60) },
  pre: (v) => ({ rows: [v.r1, v.r2, v.r3].map((r) => { const c = r.split('|'); return `<div class="tr"><span class="c1">${c[0]}</span><span class="c2">${c[1]}</span><span class="c3">${c[2]}</span></div>`; }).join('') }),
  tpl: `<div class="ha-table" data-ui="huf-android-table-artifact"><div class="tr h"><span class="c1">{{h1}}</span><span class="c2">{{h2}}</span><span class="c3">{{h3}}</span></div>{{rows}}</div>` });

def('chart-artifact', { name: 'Chart artifact (bar chart card with Y-axis values and Chart data list)', desc: 'Native bar chart. Bar heights are px (plot 272 px = 600,000).',
  slots: { title: S('Ageing by bucket', 'text', 40), yaxis: S('Y-axis values: 0·200,000·400,000·600,000', 'text', 60), h1: S('67', 'num', 3), h2: S('215', 'num', 3), h3: S('58', 'num', 3), h4: S('27', 'num', 3) },
  tpl: `<div class="ha-chart" data-ui="huf-android-chart-artifact"><div class="ct">{{title}}</div><div class="ya">{{yaxis}}</div><div class="plot"><i class="g" style="top:0"></i><i class="g" style="top:90px"></i><i class="g" style="top:181px"></i><i class="g" style="top:271px"></i><i class="b" style="left:15px;height:{{h1}}px"></i><i class="b" style="left:99px;height:{{h2}}px"></i><i class="b" style="left:183px;height:{{h3}}px"></i><i class="b" style="left:267px;height:{{h4}}px"></i></div><div class="xl"><span>0-30</span><span>31-60</span><span>61-90</span><span>90+</span></div><div class="cd">Chart data</div><div class="cl">0-30 — amount: 149,750</div><div class="cl">31-60 — amount: 474,350</div><div class="cl">61-90 — amount: 128,000</div><div class="cl">90+ — amount: 61,200</div></div>` });

def('artifact-row', { name: 'Artifact browser row (kind icon, title, kind, chevron arrow)', desc: 'Row of the Artifacts list. icon: chart | markdown | html.',
  slots: { icon: S(ico('barbox'), 'html', 400), name: S('Ageing by bucket', 'text', 40), kind: S('chart', 'text', 12) },
  tpl: `<div class="ha-art-row" data-ui="huf-android-artifact-row"><span class="ic">{{icon}}</span><div class="tx"><div class="nm">{{name}}</div><div class="kd">{{kind}}</div></div><span class="ar">${ico('fwd')}</span></div>`,
  states: { markdown: { slots: { icon: ico('textbox'), name: 'Reminder letter template', kind: 'markdown' } }, html: { slots: { icon: ico('code'), name: 'Receivables dashboard', kind: 'html' } } } });

def('attachment-chip', { name: 'Attachment chip (file name, upload state, remove)', desc: 'Shown above the composer once a file is attached; states uploading / uploaded / failed.',
  slots: { name: S('invoice-INV-2041.pdf', 'text', 30), state_class: S('', 'class', 8), detail: S('', 'text', 20) },
  tpl: `<div class="ha-chip {{state_class}}" data-ui="huf-android-attachment-chip">${ico('doc')}<span>{{name}}</span><span class="x">${ico('close')}</span></div>`,
  states: { uploading: { slots: { state_class: 'up' } } } });

const dthreads = ['Send the November promo', 'Overdue receivables summary', 'Draft reminder for Al Noor Trading', 'Data retention policy review', 'Onboard Gulf Steel as a vendor'];
def('chats-drawer', { name: 'Chats drawer (HUF brand, Search threads, New chat, Projects, Automations, Agents, Recent threads)', desc: 'Modal navigation drawer, 326 px wide, over a scrim. Put in the shell `overlay` after a `.ha-scrim`.',
  slots: Object.fromEntries(dthreads.map((t, i) => ['t' + (i + 1), S(t, 'text', 40)])),
  tpl: `<aside class="ha-drawer" data-ui="huf-android-chats-drawer"><div class="brand"><b>HUF</b><i></i><span>AI Platform</span></div><div class="item" style="margin-top:6px">${ico('search')}Search threads</div><div class="item">${ico('add')}New chat</div><div class="item">${ico('folder')}Projects</div><div class="item">${ico('cal')}Automations</div><div class="item">${ico('group')}Agents</div><div class="sec">Recent</div>${dthreads.map((t, i) => `<div class="thread">${ico('chat')}<div class="tx">{{t${i + 1}}}</div><span class="dots">${ico('more')}</span></div>`).join('')}</aside>` });

def('overflow-menu', { name: 'Chat overflow menu (Artifacts, Rename, Fork, Delete, Move to project, switch agent)', desc: 'Dropdown anchored under the app bar overflow button.',
  slots: { agent: S('Finance Reviewer', 'text', 30) },
  tpl: `<div class="ha-menu" data-ui="huf-android-overflow-menu"><div class="mi">${ico('doc')}Artifacts</div><div class="mi">Rename</div><div class="mi">Fork conversation</div><div class="mi">Delete conversation</div><div class="mi">${ico('folder')}Move to project</div><div class="mi">${ico('robot')}{{agent}}</div></div>` });

def('agent-switcher-sheet', { name: 'Switch agent bottom sheet', desc: 'Modal sheet listing agents; the current one shows a check.',
  slots: { current: S('Finance Reviewer', 'text', 30) },
  tpl: `<div class="ha-sheet" data-ui="huf-android-agent-switcher-sheet"><div class="handle"></div><div class="hd"><span>Switch agent</span><a>Close</a></div><div class="desc">In an existing conversation, only streaming agents can be selected; queued replies use the server’s saved agent.</div>
<div class="opt"><div class="n">Falcon Arabic Test</div><div class="d">Only streaming agents can switch in this conversation.</div></div><div class="opt"><div class="n">Hub Orchestrator</div><div class="d">Only streaming agents can switch in this conversation.</div></div><div class="opt sel"><div class="n" style="font-size:19px;font-weight:500">{{current}}</div>${ico('check', 's28')}</div><div class="opt"><div class="n">Doc Extractor</div><div class="d">Only streaming agents can switch in this conversation.</div></div></div>` });

def('attach-sheet', { name: 'Attach bottom sheet (Photo library, Files, Camera, project knowledge, Record audio)', desc: 'Composer + button sheet. Unavailable rows show the dimmed label.',
  slots: {}, tpl: `<div class="ha-sheet" data-ui="huf-android-attach-sheet"><div class="handle"></div><div class="hd" style="border:0;height:54px"><span>Attach</span></div><div class="desc" style="padding-top:0">Choose a photo, take a picture, or attach a file for this chat.</div><div class="attach" style="border-top:1px solid var(--ha-hairline)">${ico('photos')}Photo library</div><div class="attach">${ico('doc')}Files</div><div class="attach">${ico('camera')}Camera</div><div class="attach dis">${ico('folder')}From project knowledge<span class="u">Unavailable</span></div><div class="attach dis" style="border:0">${ico('mic')}Record audio<span class="u">Unavailable</span></div></div>` });

def('permission-dialog', { name: 'Android permission dialog (Allow HUF to record audio?)', desc: 'System dialog shown on first microphone use.', slots: { question: S('HUF', 'text', 20) },
  tpl: `<div class="ha-perm" data-ui="huf-android-permission-dialog">${ico('mic')}<div class="q">Allow <b>{{question}}</b> to record audio?</div><div class="pb">While using the app</div><div class="pb">Only this time</div><div class="pb">Don’t allow</div></div>` });
