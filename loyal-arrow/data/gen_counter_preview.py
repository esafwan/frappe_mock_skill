#!/usr/bin/env python3
"""Deterministic Counter 'amount -> earn preview' scenarios per dataset -> <dataset>/counter_preview.json.
Derived from counter_find.json (member) + tiers.json multipliers. No clock/random/network. Synthetic data only."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
# per-currency demo bill and earn rate (points per currency unit, before tier multiplier); chosen so the populated bill earns 25 pts
BILL = {'INR': (250, 0.1), 'AED': (125, 0.2), 'SAR': (125, 0.2), 'QAR': (125, 0.2), 'KWD': (12.5, 2.0)}
TINY = {'INR': 5, 'AED': 2, 'SAR': 2, 'QAR': 2, 'KWD': 0.2}   # below one point: the "zero" state
for ds in ('uae-dubai-supermarket', 'india-departmental-store'):
    d = os.path.join(HERE, ds); f = json.load(open(os.path.join(d, 'counter_find.json')))['found']
    tiers = json.load(open(os.path.join(d, 'tiers.json'))); tl = tiers if isinstance(tiers, list) else tiers.get('tiers', [])
    mult = next((t.get('earn_multiplier', 1) for t in tl if t.get('tier_name') == f['tier']), 1)
    cur = {}
    for c, (amt, rate) in BILL.items():
        pts = lambda a: int(a * rate)   # tier multiplier shown as a note only (keeps the demo at 25 pts)
        cur[c] = {'bill': amt, 'points': pts(amt), 'rate_per_unit': rate, 'zero_bill': TINY[c], 'zero_points': pts(TINY[c])}
    out = {'synthetic': True, 'member': {'member_id': f['member_id'], 'names': f['names'], 'tier': f['tier'], 'earn_multiplier': mult},
           'currencies': cur, 'count_up': {'from': 0, 'frames': [0, 6, 13, 19, 25]}}
    json.dump(out, open(os.path.join(d, 'counter_preview.json'), 'w'), ensure_ascii=False, indent=1)
    print(ds, f['names']['en'], f['tier'], mult)
