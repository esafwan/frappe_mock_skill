#!/usr/bin/env python3
"""Deterministic synthetic festival-vs-last-year data for the Retail > Festival page.
Writes loyal-arrow/data/retail-festival.json. No clock, no randomness beyond a fixed LCG. Amounts are INR base; renderers rescale for other currencies."""
import json, datetime as dt, os
FESTIVALS = [  # id, label, this start (incl lead), last-year start (incl lead), lead, length, bills, ly bills, sales, ly sales, shoppers, ly shoppers, both, seed
 dict(id="ramadan-2026", label="Ramadan 2026", start="2026-02-11", ly="2025-02-22", lead=7, length=30, bills=758, ly_bills=662, sales=53094, ly_sales=45095, shoppers=42, ly_shoppers=36, both=22, seed=7),
 dict(id="diwali-2025", label="Diwali 2025", start="2025-10-13", ly="2024-10-24", lead=7, length=14, bills=412, ly_bills=388, sales=31870, ly_sales=30410, shoppers=31, ly_shoppers=33, both=19, seed=11),
 dict(id="eid-2026", label="Eid al-Fitr 2026", start="2026-03-13", ly="2025-03-24", lead=5, length=10, bills=265, ly_bills=240, sales=19420, ly_sales=17010, shoppers=27, ly_shoppers=25, both=15, seed=19),
]
def lcg(seed):
    s = seed
    while True:
        s = (s * 1103515245 + 12345) % (2**31); yield s / 2**31
def series(n, total_bills, total_sales, seed, hide_idx, force_first=None):
    r = lcg(seed); w = []
    for i in range(n):
        ramp = 0.6 + 0.9 * (i / max(n - 1, 1))  # volume grows into the festival
        w.append(ramp * (0.7 + 0.6 * next(r)))
    rest = total_bills - sum(f[0] for f in (force_first or []))
    k = len(force_first or [])
    sw = sum(w[k:]); bills = [f[0] for f in (force_first or [])] + [max(1, round(x / sw * rest)) for x in w[k:]]
    for i in range(n):
        if i in hide_idx: bills[i] = 8 if i else bills[i]
        elif i >= k: bills[i] = max(10, bills[i])
    deficit = total_bills - sum(bills); j = max((i for i in range(k, n) if i not in hide_idx), key=lambda i: bills[i]); bills[j] += deficit
    avg = total_sales / total_bills; sales = []
    for i, b in enumerate(bills):
        sales.append(round(b * avg * (0.9 + 0.2 * next(r))))
    if force_first:
        for i, f in enumerate(force_first): sales[i] = f[1]
    sales[-1] += total_sales - sum(sales)
    return bills, sales
def build(f, hide_this, hide_ly, force_this=None, force_ly=None):
    n = f["lead"] + f["length"]
    b, s = series(n, f["bills"], f["sales"], f["seed"], hide_this, force_this)
    lb, ls = series(n, f["ly_bills"], f["ly_sales"], f["seed"] + 100, hide_ly, force_ly)
    d0 = dt.date.fromisoformat(f["start"]); l0 = dt.date.fromisoformat(f["ly"]); days = []
    for i in range(n):
        lab = ("before", f["lead"] - i) if i < f["lead"] else ("day", i - f["lead"] + 1)
        days.append(dict(i=i, kind=lab[0], n=lab[1], date=(d0 + dt.timedelta(i)).isoformat(), bills=b[i], sales=s[i], hidden=b[i] < 10,
                         ly_date=(l0 + dt.timedelta(i)).isoformat(), ly_bills=lb[i], ly_sales=ls[i], ly_hidden=lb[i] < 10))
    cum = lambda xs: [sum(xs[:i + 1]) for i in range(len(xs))]
    last = lambda d: (dt.date.fromisoformat(d["start"]) + dt.timedelta(n - 1)).isoformat()
    return dict(id=f["id"], label=f["label"], lead=f["lead"], length=f["length"], daysCompared=n, thisFrom=f["start"], thisTo=last(f),
                lastFrom=f["ly"], lastTo=(l0 + dt.timedelta(n - 1)).isoformat(),
                kpi=dict(sales=f["sales"], ly_sales=f["ly_sales"], bills=f["bills"], ly_bills=f["ly_bills"], basket=round(f["sales"] / f["bills"]), ly_basket=round(f["ly_sales"] / f["ly_bills"]),
                         shoppers=f["shoppers"], ly_shoppers=f["ly_shoppers"], cameBack=round(100 * f["both"] / f["ly_shoppers"], 1), both=f["both"]),
                days=days, cumSales=cum(s), cumLySales=cum(ls),
                hiddenThis=sum(1 for x in days if x["hidden"]), hiddenLast=sum(1 for x in days if x["ly_hidden"]))
out = dict(synthetic=True, note="Synthetic. Amounts in INR base; renderers rescale. Days with fewer than 10 bills are hidden.", minBills=10, currencyBase="INR", festivals=[
    build(FESTIVALS[0], [20], [1], [(11, 814), (11, 759)], [(11, 708), (6, 480)]),
    build(FESTIVALS[1], [], []), build(FESTIVALS[2], [], [])])
for fest in out["festivals"]:
    for dd in fest["days"]:
        if dd["i"] == 0 and fest["id"] != "ramadan-2026": pass
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "retail-festival.json")
json.dump(out, open(p, "w"), indent=1, ensure_ascii=False); print("wrote", p)
