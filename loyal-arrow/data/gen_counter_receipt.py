#!/usr/bin/env python3
"""Deterministic Counter 'Bill booked' receipt scenarios per dataset -> <dataset>/counter_receipt.json.
Derived only from members.json + cfg.json. No clock/random/network. Synthetic data only (phones +0000000NNNN)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
# currency -> (bill amount, points per whole currency unit, minimum bill for any points)
RATES = {'INR': (250, 0.10, 10), 'AED': (250, 1.0, 1), 'SAR': (250, 1.0, 1), 'QAR': (250, 1.0, 1), 'KWD': (25.5, 1.0, 1)}
CUR_DS = {'INR': 'india-departmental-store', 'AED': 'uae-dubai-supermarket', 'SAR': 'uae-dubai-supermarket', 'QAR': 'uae-dubai-supermarket', 'KWD': 'uae-dubai-supermarket'}
def earn(amount, rate, minimum): return int(amount * rate) if amount >= minimum else 0
for ds in sorted(set(CUR_DS.values())):
    d = os.path.join(HERE, ds); ms = json.load(open(os.path.join(d, 'members.json')))
    m = min((x for x in ms if 100 <= x['balance_pts'] <= 130), key=lambda x: (abs(x['balance_pts'] - 115), x['member_id']))
    out = {'synthetic': True, 'note': 'Counter receipt scenarios; points = floor(amount * rate), 0 below minimum bill.',
           'member_id': m['member_id'], 'tier': m['tier'], 'booked': {}, 'zero': {}}
    for cur, ds2 in CUR_DS.items():
        if ds2 != ds: continue
        amt, rate, mn = RATES[cur]; e = earn(amt, rate, mn); small = round(mn * 0.4, 3) if cur != 'KWD' else 0.4
        out['booked'][cur] = {'amount': amt, 'earned_pts': e, 'balance_pts': m['balance_pts'] + e}
        out['zero'][cur] = {'amount': small, 'earned_pts': earn(small, rate, mn), 'balance_pts': m['balance_pts']}
    json.dump(out, open(os.path.join(d, 'counter_receipt.json'), 'w'), ensure_ascii=False, indent=1)
    print(ds, out['member_id'], out['booked'])
