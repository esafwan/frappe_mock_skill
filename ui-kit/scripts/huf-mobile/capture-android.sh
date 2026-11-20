#!/usr/bin/env bash
# Deterministic Android emulator screenshots of Huf mobile (debug preview fixtures).
set -euo pipefail
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
AVD="${AVD:-huf_parity_test}"
SRC="${HUF_ANDROID_SRC:-/Users/safwan/Code/Huf/huf_mobile/android}"
OUT="$(cd "$(dirname "$0")/../.." && pwd)/systems/huf-android/ref"
PKG=ai.huf.mobile; ACT=$PKG/.MainActivity
mkdir -p "$OUT"

if ! adb devices | grep -q 'emulator-.*device$'; then
  nohup emulator -avd "$AVD" -no-window -no-audio -no-boot-anim -no-snapshot-save -gpu swiftshader_indirect >/tmp/huf-emulator.log 2>&1 &
  adb wait-for-device
fi
until [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = 1 ]; do sleep 2; done
sleep 3

adb shell settings put global sysui_demo_allowed 1
demo() { adb shell am broadcast -a com.android.systemui.demo -e command "$@" >/dev/null; }
demo enter
demo clock -e hhmm 0941
demo battery -e level 100 -e plugged false
demo network -e wifi show -e level 4 -e mobile hide
demo notifications -e visible false
for s in window_animation_scale transition_animation_scale animator_duration_scale; do adb shell settings put global $s 0; done
adb shell settings put global auto_time 0 || true

(cd "$SRC" && ./gradlew :app:assembleDebug -q)
APK="$SRC/app/build/outputs/apk/debug/app-debug.apk"
adb install -r "$APK" >/dev/null
SHA=$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)
DEV=$(adb shell getprop ro.product.model | tr -d '\r')
SIZE=$(adb shell wm size | tail -1 | sed 's/.*: //' | tr -d '\r')
W=${SIZE%x*}; H=${SIZE#*x}

declare -a STATES=(signin dashboard confirmation sending)
desc_signin="Sign-in / connect screen shown on first launch with no saved profile (app data cleared)."
desc_dashboard="Chat thread fixture: user prompt, pending and approved WhatsApp confirmation cards, markdown receivables table and sandboxed HTML artifact."
desc_confirmation="Chat thread fixture with a pending 'Send WhatsApp campaign' confirmation card awaiting approval."
desc_sending="Chat thread fixture with the confirmation card in the approved/sending state."

echo '[]' > "$OUT/index.json.tmp"
for st in "${STATES[@]}"; do
  for th in light dark; do
    adb shell cmd uimode night $([ $th = dark ] && echo yes || echo no) >/dev/null
    adb shell am force-stop $PKG
    [ $st = signin ] && adb shell pm clear $PKG >/dev/null
    adb shell pm grant $PKG android.permission.POST_NOTIFICATIONS 2>/dev/null || true
    if [ $st = signin ]; then adb shell am start -W -S -n $ACT >/dev/null
    else adb shell am start -W -S -n $ACT --es huf_preview $st >/dev/null; fi
    sleep 10   # lets the gesture-nav handle dim and the UI settle
    f="$OUT/$st.$th.png"
    # retry until two consecutive frames match (settled)
    prev=""; ok=0; for i in 1 2 3 4 5 6 7 8; do
      adb exec-out screencap -p > "$f.tmp"; cur=$(shasum "$f.tmp" | cut -d' ' -f1)
      if [ "$cur" = "$prev" ]; then ok=$((ok+1)); else ok=0; fi; [ $ok -ge 2 ] && break; prev=$cur; sleep 1.5
    done
    mv "$f.tmp" "$f"
    d="desc_$st"
    jq --arg s $st --arg t $th --arg f "$st.$th.png" --arg d "$DEV" --argjson w $W --argjson h $H \
       --arg desc "${!d}" --arg sha "$SHA" \
       '. + [{state:$s,theme:$t,file:$f,device:$d,w:$w,h:$h,description:$desc,app_git_sha:$sha}]' \
       "$OUT/index.json.tmp" > "$OUT/index.json.new" && mv "$OUT/index.json.new" "$OUT/index.json.tmp"
  done
done
mv "$OUT/index.json.tmp" "$OUT/index.json"
adb shell cmd uimode night no >/dev/null
echo "done: $(ls "$OUT"/*.png | wc -l) screenshots in $OUT"
