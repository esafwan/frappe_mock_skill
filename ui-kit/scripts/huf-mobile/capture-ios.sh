#!/bin/bash
# Deterministic iOS Simulator captures of the Huf iOS app preview-fixture states.
# Usage: capture-ios.sh [--no-build]   (env: HUF_IOS_SRC, SETTLE=seconds)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
SRC="${HUF_IOS_SRC:-/Users/safwan/Code/Huf/huf_mobile/ios}"
OUT="$KIT/systems/huf-ios/ref"
BUNDLE=ai.huf.mobile
SETTLE="${SETTLE:-4}"
DEVNAME="iPhone 17 Pro"
mkdir -p "$OUT"

STATES=(signin login api-key chats chat rich-content dashboard projects agents you computers agent-switcher attach voice upload uploading busy draft whitespace no-files disabled-agent empty)
desc() { case "$1" in
 signin) echo "Connection step 1: server URL entry";;
 login) echo "Connection step 2: email/password sign-in for preview.invalid";;
 api-key) echo "Connection step 2: API key/secret sign-in";;
 chats) echo "Chat tab: conversation list";;
 chat) echo "Chat thread with a short conversation";;
 rich-content) echo "Chat thread with rich markdown/architecture content";;
 dashboard) echo "Chat thread with confirmation cards, HTML dashboard artifact, markdown table";;
 projects) echo "Projects tab";;
 agents) echo "Agents tab: agent list";;
 you) echo "You tab: profile/settings";;
 computers) echo "Desktop hosts (computers) list";;
 agent-switcher) echo "Chat thread with agent switcher sheet open";;
 attach) echo "Chat thread with attach-source sheet open";;
 voice) echo "Chat thread with voice input sheet open";;
 upload) echo "Chat thread with upload items in composer";;
 uploading) echo "Chat composer with file uploading at 45%";;
 busy) echo "Chat thread while a response is loading";;
 draft) echo "Chat composer with a drafted message";;
 whitespace) echo "Chat composer with whitespace-only draft (send disabled)";;
 no-files) echo "Chat with an agent that disallows file upload";;
 disabled-agent) echo "Chat with a disabled/unavailable agent";;
 empty) echo "Empty new-chat thread";;
esac; }

# Pick/create simulator
UDID=$(xcrun simctl list devices available -j | jq -r --arg n "$DEVNAME" '[.devices|to_entries[]|select(.key|test("iOS-26-5"))|.value[]|select(.name==$n)][0].udid // empty')
if [ -z "$UDID" ]; then
  UDID=$(xcrun simctl create "$DEVNAME" "com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro" "com.apple.CoreSimulator.SimRuntime.iOS-26-5")
fi
xcrun simctl bootstatus "$UDID" -b >/dev/null 2>&1 || xcrun simctl boot "$UDID" || true
xcrun simctl bootstatus "$UDID" -b >/dev/null
xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3

if [ "${1:-}" != "--no-build" ]; then
  APP=$(cd "$SRC" && HUF_SIM_PACKAGE_ONLY=1 tools/build-sim-app.sh "$UDID" 2>&1 | tee /dev/stderr | sed -n 's/^Packaged Simulator app: //p' | tail -1)
  [ -d "$APP" ] || { echo "build failed" >&2; exit 1; }
  xcrun simctl install "$UDID" "$APP"
fi
SHA=$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)
git -C "$SRC" diff --quiet 2>/dev/null || SHA="$SHA-dirty"

shot() { xcrun simctl io "$UDID" screenshot --type=png "$1" >/dev/null 2>&1; }
# A persisted Arabic selection in app defaults leaks into views that read AppStorage; reset it.
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
CONTAINER=$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)
mkdir -p "$CONTAINER/Library/Preferences"
plutil -create xml1 "$CONTAINER/Library/Preferences/$BUNDLE.plist"
plutil -insert huf.app.language -string en "$CONTAINER/Library/Preferences/$BUNDLE.plist"
plutil -insert huf.appearance -string system "$CONTAINER/Library/Preferences/$BUNDLE.plist"
ENTRIES=()
rm -f "$OUT"/*.a "$OUT"/*.b "$OUT"/*.png.*
for theme in light dark; do
  xcrun simctl ui "$UDID" appearance "$theme"
  for st in "${STATES[@]}"; do
    f="$OUT/$st.$theme.png"
    # max 2 launches... actually 1 launch, 2 shots: fixed settle, then confirm shot
    SIMCTL_CHILD_HUF_PREVIEW_STATE="$st" SIMCTL_CHILD_HUF_PREVIEW_APPEARANCE="$theme" SIMCTL_CHILD_HUF_PREVIEW_LANGUAGE=en \
      xcrun simctl launch --terminate-running-process "$UDID" "$BUNDLE" -AppleLanguages "(en)" -AppleLocale en_US >/dev/null
    sleep "$SETTLE"; shot "$f.a"; sleep 1; shot "$f.b"
    stable=true; cmp -s "$f.a" "$f.b" || stable=false
    mv "$f.b" "$f"; rm -f "$f.a"
    w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}'); h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')
    ENTRIES+=("$(jq -n --arg s "$st" --arg t "$theme" --arg f "$st.$theme.png" --arg d "iPhone 17 Pro (iOS 26.5)" --argjson w "$w" --argjson h "$h" --arg desc "$(desc "$st")" --arg sha "$SHA" --argjson stable "$stable" \
      '{state:$s,theme:$t,file:$f,device:$d,w:$w,h:$h,description:$desc,app_git_sha:$sha,stable:$stable}' 2>/dev/null || true)")
  done
done
printf '%s\n' "${ENTRIES[@]}" | jq -s '.' > "$OUT/index.json"
echo "captured ${#ENTRIES[@]} screenshots -> $OUT"
