#!/usr/bin/env bash
# Post-login + sheet screens against mock_server_android.py (fixture data in mock_data_android.json).
# Needs a booted emulator with the debug APK installed (run capture-android.sh first).
# One app launch per theme for the signed-in flow (plus one per theme for the API-key sign-in variant).
set -euo pipefail
# MOCK_URL: address the emulator uses to reach this host mock server; export it before running.
: "${MOCK_URL:?set MOCK_URL}"
export PATH="$HOME/Library/Android/sdk/platform-tools:$PATH"
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${HUF_ANDROID_SRC:-/Users/safwan/Code/Huf/huf_mobile/android}"
OUT="$HERE/../../systems/huf-android/ref"
PKG=ai.huf.mobile; ACT=$PKG/.MainActivity
DEV=$(adb shell getprop ro.product.model | tr -d '\r'); SHA=$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)

pkill -f mock_server_android.py 2>/dev/null || true; pkill -f mock_huf_server.py 2>/dev/null || true
(nohup python3 "$HERE/mock_server_android.py" --port 8765 >/tmp/mock.log 2>&1 &); sleep 1
curl -sf localhost:8765/api/method/ping >/dev/null

adb shell am broadcast -a com.android.systemui.demo -e command enter >/dev/null
adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941 >/dev/null
adb shell pm grant $PKG android.permission.RECORD_AUDIO 2>/dev/null || true
adb shell pm grant $PKG android.permission.POST_NOTIFICATIONS 2>/dev/null || true

J=$(cat "$OUT/index.json")
tap(){ adb shell input tap "$1" "$2"; sleep "${3:-2}"; }
night(){ adb shell cmd uimode night "$1" >/dev/null; }
cap(){ # name theme desc
  sleep 2; adb exec-out screencap -p > "$OUT/$1.$2.png"
  J=$(jq --arg s "$1" --arg t "$2" --arg f "$1.$2.png" --arg d "$DEV" --arg desc "$3" --arg sha "$SHA" \
    'map(select(.file!=$f)) + [{state:$s,theme:$t,file:$f,device:$d,w:1080,h:2340,description:$desc,app_git_sha:$sha}]' <<<"$J")
}
launch(){ adb shell am force-stop $PKG; adb shell am start -W -n $ACT >/dev/null; sleep 8; }

# ---- sign in once (session persists across relaunches)
night no; adb shell pm clear $PKG >/dev/null; launch
tap 540 554 1; adb shell input text "$MOCK_URL"; tap 540 818 1; adb shell input text mock
tap 500 1027 1; adb shell input text mock; adb shell input keyevent 4; sleep 1; tap 540 1203 8

for th in light dark; do
  night $([ $th = dark ] && echo yes || echo no)
  launch
  cap live-chat $th "Chat thread (mock) with user message, assistant reply and pending WhatsApp approval card (no countdown), bottom nav Chat/Projects/Agents/Account/Automations."
  tap 120 245 2; cap drawer $th "Navigation drawer: Search threads, New chat, Projects, Automations, Agents, and Recent conversations."
  tap 401 1633 4; cap chat-rich-table $th "Conversation with assistant message rendering a markdown table (customers, open AED, days overdue) and an inline chart artifact; Project: Receivables."
  adb shell input swipe 540 1700 540 500 500; cap chat-rich-chart $th "Same conversation scrolled to the inline 'Ageing by bucket' bar-chart artifact."
  tap 959 275 2; cap chat-menu $th "Conversation overflow menu: Artifacts, Rename, Fork, Delete, Move to project, current agent."
  tap 770 429 3; cap artifact-browser $th "Artifact browser listing three artifacts (chart, markdown, html) for the conversation."
  tap 358 349 3; cap artifact-chart-detail $th "Artifact detail: 'Ageing by bucket' bar chart with data table."
  adb shell input keyevent 4; sleep 1; adb shell input keyevent 4; sleep 1
  tap 959 275 1; tap 844 1089 3; cap agent-switcher $th "Switch agent bottom sheet listing Falcon Arabic Test, Hub Orchestrator, Finance Reviewer (selected), Doc Extractor."
  tap 943 1369 1
  tap 120 1933 3; cap attach-sheet $th "Attach bottom sheet: Photo library, Files, Camera, From project knowledge, Record audio."
  adb shell input keyevent 4; sleep 1
  tap 120 245 2; tap 278 604 3; cap chat-new-empty $th "Empty new chat: composer with placeholder, no messages."
  tap 959 1933 3; cap voice-listening $th "Composer voice recording / listening state after tapping the microphone."
  launch; tap 120 245 2; tap 278 604 3
  tap 400 1933 1; adb shell input text 'Summarise%soverdue%sinvoices%sover%s30%sdays'; adb shell input keyevent 4; sleep 1
  cap composer-draft $th "New chat composer with typed draft text 'Summarise overdue invoices over 30 days' and send button."
  launch
  tap 320 2208 3; cap projects-list $th "Projects tab with four projects: Receivables, Policy & compliance, Vendor onboarding, Field reports."
  tap 218 641 3; cap project-detail $th "Project detail sheet for Receivables: status, description, default agent, conversation history."
  adb shell input keyevent 4; sleep 1
  tap 540 2208 3; cap live-agents $th "Agents tab: four agents across providers (Falcon Arabic Test, Hub Orchestrator, Finance Reviewer, Doc Extractor)."
  tap 761 2208 3; cap live-account $th "Account tab: server, saved servers, remote computers button, appearance and language."
  tap 587 1099 3; cap remote-computers $th "Remote computers sheet listing desktop hosts with online state and permission mode."
  adb shell input keyevent 4; sleep 1
  tap 981 2208 3; cap live-automations $th "Automations tab (empty state: no scheduled automations)."
  tap 99 2208 1
done
echo "$J" > "$OUT/index.json"

# ---- API-key sign-in variant (signed-out)
for th in light dark; do
  night $([ $th = dark ] && echo yes || echo no)
  adb shell pm clear $PKG >/dev/null; launch
  tap 587 1467 3; cap signin-apikey $th "Sign-in screen, 'Use an API key' variant (server + API key + secret fields)."
done
echo "$J" > "$OUT/index.json"
night no
# restore a signed-in session for any follow-up poking
echo done
