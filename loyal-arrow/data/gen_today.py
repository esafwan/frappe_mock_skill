#!/usr/bin/env python3
"""Deterministic 'Loyalty Today' daily metrics for the video kit (synthetic, no clocks/randomness).
Reads bills.json + returns.json of each dataset, scales one-day activity to a plausible store day with a seeded LCG,
writes <dataset>/today.json. Run: python3 loyal-arrow/data/gen_today.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
def lcg(seed):
    s = seed
    while True:
        s = (s * 1103515245 + 12345) & 0x7FFFFFFF
        yield s
for ds in ("uae-dubai-supermarket", "india-departmental-store"):
    d = os.path.join(HERE, ds); bills = json.load(open(os.path.join(d, "bills.json")))
    rets = json.load(open(os.path.join(d, "returns.json"))) if os.path.exists(os.path.join(d, "returns.json")) else []
    cfg = json.load(open(os.path.join(d, "cfg.json"))); g = lcg(sum(map(ord, ds)))
    avg_pts = round(sum(b["points_earned"] for b in bills) / len(bills))
    def day(scale_lo, scale_hi):
        bills_n = 60 + next(g) % 50
        redemptions = 3 + next(g) % 9
        return {"bills": bills_n, "points_earned": bills_n * avg_pts, "points_redeemed": redemptions * (cfg.get("min_redeem_pts", 100) + 20 * (next(g) % 6)),
                "redemptions": redemptions, "new_members": 2 + next(g) % 9, "voids": next(g) % 4, "points_voided": 0, "redemption_refunds": next(g) % 2}
    t, w = day(0, 0), day(0, 0)
    t["points_voided"] = t["voids"] * avg_pts
    w["points_voided"] = w["voids"] * avg_pts
    out = {"synthetic": True, "program": "Hyper Rewards", "avg_points_per_bill": avg_pts, "today": t, "same_day_last_week": w}
    json.dump(out, open(os.path.join(d, "today.json"), "w"), indent=1); open(os.path.join(d, "today.json"), "a").write("\n")
    print(ds, t)
