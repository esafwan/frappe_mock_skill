#!/usr/bin/env python3
"""Deterministic synthetic tier-migration matrix (Tier Migration Matrix report) per dataset.
Writes <dataset>/tier_migration.json. No clocks, no randomness beyond a fixed LCG. Synthetic only.
KPI rule (matches the app): rows 'Not enrolled' are excluded from upgraded/downgraded/unchanged."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
TIERS = ["Not enrolled", "No tier", "Bronze", "Silver", "Gold", "Platinum"]

def lcg(seed):
    s = seed
    while True:
        s = (s * 1103515245 + 12345) % 2147483648
        yield s

def matrix_uae():
    return [[0,15,502,1,0,0],[0,5,0,0,0,0],[0,0,1103,89,0,0],[0,0,2,258,4,0],[0,0,0,1,18,0],[0,0,0,0,0,0]]

def matrix_in():
    g = lcg(2611)
    def r(lo, hi): return lo + next(g) % (hi - lo + 1)
    m = [[0]*6 for _ in range(6)]
    m[0][1], m[0][2], m[0][3] = r(8, 30), r(300, 700), r(0, 6)
    m[1][1] = r(3, 12)
    m[2][2], m[2][3] = r(700, 1500), r(40, 160)
    m[3][2], m[3][3], m[3][4] = r(1, 9), r(150, 400), r(2, 15)
    m[4][3], m[4][4], m[4][5] = r(0, 4), r(8, 40), r(0, 3)
    m[5][4], m[5][5] = r(0, 2), r(0, 6)
    return m

def kpis(m):
    up = sum(m[r][c] for r in range(1, 6) for c in range(6) if c > r)
    down = sum(m[r][c] for r in range(1, 6) for c in range(6) if c < r)
    same = sum(m[r][r] for r in range(1, 6))
    tot = up + down + same
    pct = lambda v: round(v * 100 / tot, 2) if tot else 0
    return dict(upgraded=up, downgraded=down, unchanged=same, total=tot, upgraded_rate=pct(up), downgraded_rate=pct(down), unchanged_rate=pct(same))

def build(key, m, program, tz):
    return dict(report="Tier Migration Matrix", synthetic=True, program=program, timezone=tz, period=dict(preset="custom", start="2026-05-01", end="2026-11-15"),
                as_of="2026-11-15 23:59", tiers=TIERS, matrix=m, kpis=kpis(m))

if __name__ == "__main__":
    for key, m, prog, tz in [("uae-dubai-supermarket", matrix_uae(), "Hyper Rewards", "Asia/Dubai"), ("india-departmental-store", matrix_in(), "Bazaar Rewards", "Asia/Kolkata")]:
        with open(os.path.join(HERE, key, "tier_migration.json"), "w") as f:
            json.dump(build(key, m, prog, tz), f, indent=1, ensure_ascii=False); f.write("\n")
        print(key, build(key, m, prog, tz)["kpis"])
