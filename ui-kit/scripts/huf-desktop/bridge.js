// In-page stand-in for Huf Desktop's preload bridges (window.desktop, window.frappe, window.approvalPanel).
// Installed by scripts/huf-desktop/app.mjs with addInitScript BEFORE the renderer bundle runs, so the REAL renderer
// code talks to these instead of Electron IPC. Plain browser JS (no imports): this file is serialised into the page.
//
// cfg = { data: data/huf/desktop.json (bridge part), overrides: { 'ns.method': value } (per spec), log: bool }
// Every method of the real DesktopAPI (src/preload/index.ts) answers from a handler below; a method nobody
// registered still answers with a neutral default (list* -> [], on* -> unsubscribe fn, otherwise null), and is
// recorded in window.__hufDesktopCalls so a spec author can see what the page asked for.
/* eslint-disable */
function installHufDesktopBridge(cfg) {
  const D = cfg.data || {};
  const O = cfg.overrides || {};
  const calls = (window.__hufDesktopCalls = []);
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const dark = () => { try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; } };
  const appearance = () => ({ pref: 'system', resolved: dark() ? 'dark' : 'light' });
  const unsub = () => () => {};

  const H = {
    // shell / connection
    'runtime.status': () => (D.connection ? { connected: true, hufUrl: D.connection.url } : { connected: false, hufUrl: null }),
    'runtime.ping': () => ({ ok: true, reachable: true, user: D.user }),
    'store.getConnection': () => D.connection || null,
    'store.listConnections': () => (D.connection ? [{ id: 1, isDefault: true, ...D.connection }] : []),
    'store.getPreference': (k) => (D.preferences && k in D.preferences ? D.preferences[k] : null),
    'auth.getState': () => D.auth || { authMode: D.connection ? 'apiKey' : null, signedIn: !!D.connection, userEmail: D.connection ? D.user : null, needsSignIn: false, url: D.connection ? D.connection.url : null, sitename: D.connection ? D.connection.sitename : null, socketioPort: '9000', storageAvailable: true },
    'auth.probe': () => H['auth.getState'](),
    'appearance.get': appearance,
    'appearance.set': appearance,
    'app.getVersion': () => D.version || '0.1.0-beta.4',
    'app.devPages': () => ({ active: false, forced: false, optIn: false }),
    'app.autoOpenArtifacts': () => true,
    'app.terminalNotifications': () => true,
    'app.terminalAgyKeys': () => false,
    'app.workspaceSaveAvailable': () => true,
    'windowControls.platform': () => 'darwin',
    'windowControls.isMaximized': () => false,
    'windowControls.isFullScreen': () => false,
    'errors.takeNotices': () => [],
    'errors.report': () => true,
    'errors.diagnostics': () => '',
    getFrappeBoot: () => null,
    setFrappeBoot: () => undefined,
    // workspaces and permission modes
    'workspace.list': () => D.workspaces || [],
    'workspace.getPermissionMode': (p) => ((D.permissionModes || {})[p] || D.permissionMode || 'ask'),
    'workspace.listDir': () => D.files || [],
    // agent tools (executor)
    'agentTools.getStatus': () => D.executor || null,
    'agentTools.getExecutorId': () => (D.executor ? D.executor.executorId : null),
    'agentTools.getPendingApprovalCount': () => D.pendingApprovals || 0,
    'agentTools.getUploadLevel': () => 'ask',
    'agentTools.listUploadOutbox': () => [],
    'agentTools.readFileArtifact': (id) => (D.fileArtifacts || {})[id] || { ok: false, reason: 'missing' },
    // local chat / agents / terminal
    'localChat.status': () => D.localChat || { available: false, host: 'http://127.0.0.1:11434', installed: false },
    'localChat.listModels': () => D.localModels || [],
    'localChat.listSessions': () => D.localSessions || [],
    'localChat.sources.list': () => D.sources || [],
    'localChat.credentials.status': (id) => (id ? { providerId: id, configured: false, storage: 'keychain' } : ['openai', 'anthropic', 'google', 'openrouter'].map((p) => ({ providerId: p, configured: false, storage: 'keychain' }))),
    'localAgent.status': () => D.agentRuntimes || [],
    'localAgent.trustedFoldersList': () => [],
    'terminal.profiles': () => D.terminalProfiles || [],
    'terminal.list': () => [],
    'terminal.attention': () => [],
    'permissionRules.list': () => [],
    'permissionRules.auditList': () => [],
    'permissionRules.getMasterSwitch': () => true,
    // local capabilities (Settings / Skills)
    'localCaps.listSkills': () => D.skills || [],
    'localCaps.listSkillDirs': () => D.skillDirs || [],
    'localCaps.skillSuggestions': () => D.skillSuggestions || [],
    'localCaps.mcpList': () => D.mcpServers || [],
    'localCaps.mcpImportCandidates': () => [],
    'office.get': () => D.office || null,
    'installs.get': () => D.installs || null,
    'browser.get': () => D.browser || null,
    'policy.get': () => D.policy || null,
    'remote.get': () => D.remote || null,
    'device.get': () => D.device || null,
    'device.rebindCandidates': () => [],
    'processes.list': () => D.processes || [],
    'processes.logs': () => ({ lines: [], last_seq: 0 }),
    'openCodeLogins.status': () => D.openCodeLogins || { available: false, providers: [], enabled: false },
  };

  const SYNC = new Set(['windowControls.platform', 'getFrappeBoot', 'setFrappeBoot', 'agentTools.focusApprovalPanel']);
  function answer(path, args) {
    calls.push(path);
    const last = path.split('.').pop();
    if (/^on[A-Z]/.test(last)) return unsub();
    let v;
    if (path in O) v = clone(O[path]);
    else if (H[path]) v = H[path].apply(null, args);
    else v = /^(list|get[A-Z].*s$)/.test(last) ? [] : /^(is|has)[A-Z]/.test(last) ? false : null;
    return SYNC.has(path) ? v : Promise.resolve(v);
  }
  function node(path) {
    return new Proxy(function () {}, {
      get(_t, k) {
        if (typeof k === 'symbol' || k === 'then' || k === 'toJSON') return undefined;
        return node(path ? path + '.' + k : k);
      },
      apply(_t, _self, args) { return answer(path, args); },
      has() { return true; },
    });
  }
  Object.defineProperty(window, 'desktop', { value: node(''), configurable: true });
  Object.defineProperty(window, 'frappe', { value: { boot: null, cookie: '' }, configurable: true, writable: true });

  // The approval panel window's own bridge (src/preload/approval-panel.ts).
  if (D.approvalPanel) {
    window.approvalPanel = {
      onState(cb) { const s = clone(D.approvalPanel); setTimeout(() => cb(s), 0); return () => {}; },
      respond: async () => true,
      respondAll: async () => 0,
      respondTerminal: async () => ({ ok: true }),
      openModePicker() {},
      appearance: { get: async () => appearance(), onChanged: () => () => {} },
      setHeight() {},
    };
  }
}
