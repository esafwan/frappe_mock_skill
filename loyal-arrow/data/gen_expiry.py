#!/usr/bin/env python3 -I
"""Deterministic SYNTHETIC points-expiry lots for the Expiry Forecast report (Loyal Arrow mock videos).
Reads uae-dubai-supermarket/members.json (never modified); writes uae-dubai-supermarket/expiry_lots.json.
One lot = points earned on one bill that expire 365 days later; here lots are placed directly by expiry date.
Run: python3 -I gen_expiry.py"""
import json, os, random
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, "uae-dubai-supermarket")
AS_OF_ORD = 0  # report date 2026-11-22 (offset 0)
members = json.load(open(os.path.join(D, "members.json"), encoding="utf-8"))
rng = random.Random(20261122)
import datetime
base = datetime.date(2026, 11, 22)
lots = []
# bursts: a few heavy expiry days (campaign cohorts) over a 90-day horizon, light long tail, ~1 lot/day minimum
heavy = {83: 6145, 44: 4620, 28: 3980, 76: 4180, 54: 3480}
n = 0
for day in range(1, 91):
    if day in (3, 9, 17, 31, 52, 66, 71, 88): continue  # days with no lots (categorical axis skips them)
    k = 1 + (rng.random() < 0.55) + (rng.random() < 0.25) + (day in heavy) * 3
    target = heavy.get(day)
    for j in range(k):
        m = members[rng.randrange(len(members))]
        pts = target // k + rng.randint(-40, 40) if target else int(rng.choice([60, 100, 120, 180, 240, 310, 420, 620, 880]) * rng.uniform(.6, 1.4))
        n += 1
        lots.append(dict(lot_id=f"LOT-{n:04d}", member_id=m["member_id"], tier=m["tier"], expires_on=(base + datetime.timedelta(days=day)).isoformat(), points=max(20, pts)))
out = dict(as_of="2026-11-22", program="Hyper Rewards", synthetic=True, note="Synthetic lots; members from members.json (phones +0000000NNNN).", lots=lots)
json.dump(out, open(os.path.join(D, "expiry_lots.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("lots", len(lots), "points", sum(l["points"] for l in lots), "members", len({l["member_id"] for l in lots}))
