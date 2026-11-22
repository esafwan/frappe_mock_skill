#!/usr/bin/env python3
"""Android screenshot mock: wraps tools/mock_huf_server.py with richer fixture data
(scripts/huf-mobile/mock_data_android.json). No edits to huf_mobile. Usage: mock_server_android.py --port 8765"""
import argparse, json, os, sys, urllib.parse
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.environ.get("HUF_MOCK_DIR", "/Users/safwan/Code/Huf/huf_mobile/tools"))
import mock_huf_server as m

DATA = json.load(open(os.path.join(HERE, "mock_data_android.json")))
_Store = m.Store

class AndroidStore(_Store):
    def reset(self):
        super().reset()
        with self.lock:
            # keep the preloaded approval thread, recast into the fixture world
            self.conversations[m.PRELOADED_CONV].update({"title": "Send the November promo", "agent": "Hub Orchestrator",
                                                          "project": None, "last_activity": "2026-11-18 09:30:00", "modified": "2026-11-18 09:30:00"})
            for c in DATA["conversations"]:
                self.conversations[c["name"]] = dict(c)
                for text, is_agent in DATA["messages"].get(c["name"], []):
                    self.add_message(c["name"], text, bool(is_agent))
                self.conversations[c["name"]].update(last_activity=c["last_activity"], modified=c["modified"])

    def serialize(self, c):
        o = super().serialize(c)
        o["expires_at"] = None  # no ticking countdown -> deterministic pixels
        return o

    def conversation_rows(self):
        with self.lock:
            return [{**c, "channel": "Chat", "status": "Active", "pinned": c.get("pinned", 0)} for c in self.conversations.values()]

m.Store = AndroidStore
m.AGENT_ROW = DATA["agents"][0]
_make = m.make_handler

def make_handler(store, origins, quiet):
    Base = _make(store, origins, quiet)
    class H(Base):
        _pre = None
        def _raw_body(self):
            if self._pre is not None:
                return self._pre
            return super()._raw_body()

        def route(self, verb):
            self._pre = None
            self._raw_cache = None
            self._pre = super()._raw_body()  # read the body exactly once
            path = urllib.parse.urlparse(self.path).path
            if path == "/api/resource/Agent" and self.authed() and verb == "GET":
                return self.send_json(200, {"data": DATA["agents"]})
            if path.startswith("/api/method/huf.ai.") and not path.startswith(("/api/method/huf.ai.agent.", "/api/method/huf.ai.tool_confirmation.")):
                if not self.authed():
                    return self.forbidden()
                p = self.body_params()
                name = path.rsplit(".", 1)[-1]
                msg = None
                if name == "list_projects":
                    msg = DATA["projects"]
                elif name == "get_project":
                    msg = next((x for x in DATA["projects"] if x["name"] == p.get("project") or x["name"] == p.get("name") or x["name"] == p.get("project_id")), DATA["projects"][0])
                elif name == "get_pinned_conversations":
                    rows = [{**c, "pinned_at": c["modified"]} for c in DATA["conversations"] if c.get("pinned")]
                    if p.get("project"):
                        rows = [r for r in rows if r.get("project") == p["project"]]
                    msg = rows
                elif name == "list_conversation_artifacts":
                    msg = [{k: a[k] for k in ("name", "title", "artifact_type", "language", "message", "message_index", "size_bytes", "creation")}
                           for a in DATA["artifacts"] if a["conversation"] == p.get("conversation")]
                elif name == "get_artifact":
                    msg = next((a for a in DATA["artifacts"] if a["name"] == p.get("name")), None)
                elif name == "list_desktop_hosts":
                    msg = DATA["desktop_hosts"]
                elif name == "list_scheduled_automations":
                    msg = []
                if msg is not None or name in ("get_artifact",):
                    return self.send_json(200, {"message": msg})
            return super().route(verb)
    return H

m.make_handler = make_handler
if __name__ == "__main__":
    m.main()
