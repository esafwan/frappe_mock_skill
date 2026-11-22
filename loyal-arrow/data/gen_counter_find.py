#!/usr/bin/env python3
"""Deterministic counter 'Find member' scenarios per dataset -> <dataset>/counter_find.json.
Derived only from members.json (+ expiry_lots.json when present). No clock/random/network. Synthetic data only (phones +0000000NNNN)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
def r5(n): return int(round(n / 5.0)) * 5
def card(m, lots):
    exp = sum(l['points'] for l in lots if l['member_id'] == m['member_id'])
    bal = m['balance_pts']
    return {'member_id': m['member_id'], 'names': m['names'], 'mobile': m['mobile'], 'mobile_masked': '******' + m['mobile'][-4:],
            'tier': m['tier'], 'balance_pts': bal, 'pending_pts': r5(bal * 0.06), 'expiring_pts': min(exp, r5(bal * 0.3)) if exp else r5(bal * 0.15)}
for ds in ('uae-dubai-supermarket', 'india-departmental-store'):
    d = os.path.join(HERE, ds); ms = json.load(open(os.path.join(d, 'members.json')))
    lp = os.path.join(d, 'expiry_lots.json'); lots = json.load(open(lp))['lots'] if os.path.exists(lp) else []
    found = next(m for m in ms if m['tier'] in ('Gold', 'Platinum') and 300 <= m['balance_pts'] <= 1500)
    zero = next(m for m in ms if m['balance_pts'] == 0)
    out = {'synthetic': True, 'note': 'Counter Find member scenarios derived from members.json.',
           'found': card(found, lots), 'zero': card(zero, lots), 'not_found_query': '+00000009999'}
    json.dump(out, open(os.path.join(d, 'counter_find.json'), 'w'), ensure_ascii=False, indent=1)
    print(ds, out['found']['names']['en'], out['found']['balance_pts'], out['zero']['names']['en'])
