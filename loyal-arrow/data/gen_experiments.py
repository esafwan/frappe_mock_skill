#!/usr/bin/env python3
"""Deterministic synthetic data for the Retail > Experiments page (loyal-arrow-desk).
Run: python3 gen_experiments.py  -> retail-experiments.json. No clock/random/network. Amounts are stored in AED and
converted per currency with the fixed table below (KWD has 3 decimals)."""
import json, pathlib
FX = {"AED": 1.0, "SAR": 1.02, "QAR": 0.99, "KWD": 0.084, "INR": 22.6}
DEC = {"AED": 2, "SAR": 2, "QAR": 2, "KWD": 3, "INR": 2}
def res(eff, lo, hi, lift, chg, cmp_, overlap, final=True):
    return {"effect_per_day": eff, "ci_low": lo, "ci_high": hi, "lift_pct": lift, "changed": chg, "comparison": cmp_, "overlap_pct": overlap, "final": final}
EXPERIMENTS = [
    {"id": "exp-1", "name": "Front shelf dates", "design": "Matched stores", "measure": "Net sales", "from": "2026-10-01", "to": "2026-10-31", "status": "Completed", "result": res(4.20, 1.10, 7.30, 12.5, 6, 6, 6.4)},
    {"id": "exp-2", "name": "Dairy chiller refresh", "design": "Matched stores", "measure": "Net sales", "from": "2026-09-01", "to": "2026-09-30", "status": "Completed", "result": res(2.85, 0.40, 5.30, 8.1, 4, 4, 0.0)},
    {"id": "exp-3", "name": "Points holdout", "design": "Member holdout", "measure": "Bills", "from": "2026-11-01", "to": "2026-12-15", "status": "Running", "result": None},
    {"id": "exp-4", "name": "Checkout bonus points", "design": "Member holdout", "measure": "Bills", "from": "2026-11-10", "to": "2026-12-10", "status": "Running", "result": None},
    {"id": "exp-5", "name": "Cereal gondola test", "design": "Matched stores", "measure": "Net sales", "from": "2026-12-01", "to": "2026-12-31", "status": "Draft", "result": None},
    {"id": "exp-6", "name": "Weekend bundle", "design": "Matched stores", "measure": "Net sales", "from": "2026-08-01", "to": "2026-08-31", "status": "Cancelled", "result": None},
]
ACTIONS = {"Completed": ["Result"], "Running": ["Result", "Complete", "Cancel"], "Draft": ["Change", "Pair stores", "Start", "Cancel", "Delete"], "Cancelled": ["Delete"]}
# zero / count-up states for the result panel (the video engine interpolates zero -> final)
ZERO = res(0.0, -0.40, 0.40, 0.0, 0, 0, 0.0, final=False)
MID = res(2.10, 0.55, 3.65, 6.3, 3, 3, 6.4)
out = {"programme": "uae-dubai-supermarket", "synthetic": True, "currencyBase": "AED", "fx": FX, "decimals": DEC, "statuses": ["All", "Draft", "Running", "Completed", "Cancelled"],
       "actions": ACTIONS, "experiments": EXPERIMENTS, "resultZero": ZERO, "resultMid": MID}
p = pathlib.Path(__file__).with_name("retail-experiments.json")
p.write_text(json.dumps(out, indent=1) + "\n"); print("wrote", p.name, len(EXPERIMENTS), "experiments")
