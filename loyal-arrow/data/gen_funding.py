#!/usr/bin/env python3
"""Deterministic synthetic supplier-funding agreements for the Retail > Funding screen. No clock/random/network.
Writes loyal-arrow/data/retail-funding.json. Amounts are authored in KWD (3 decimals) and scaled per currency by a fixed rate table."""
import json, pathlib
OUT = pathlib.Path(__file__).with_name('retail-funding.json')
data = {
  'synthetic': True,
  'claim_month': {'year': 2026, 'month': 10},
  'ledger': {'from': '2026-10-24', 'to': '2026-11-22'},
  # fixed illustrative rates from KWD; decimals = minor units shown
  'currencies': {'KWD': {'rate': 1, 'dec': 3}, 'AED': {'rate': 12, 'dec': 2}, 'SAR': {'rate': 12, 'dec': 2}, 'QAR': {'rate': 12, 'dec': 2}, 'INR': {'rate': 270, 'dec': 0}},
  # supplier names are fictional
  'agreements': [
    {'id': 'agr-001', 'name': 'Dairy launch', 'supplier': 'Dalia Dairies', 'status': 'Active', 'used': 1250, 'cap': 5000},
    {'id': 'agr-002', 'name': 'Breakfast cereal', 'supplier': 'Nordic Cereal Co', 'status': 'Active', 'used': 1720, 'cap': 2000},
    {'id': 'agr-003', 'name': 'Summer bundle', 'supplier': 'Fizzo Beverages', 'status': 'Active', 'used': 1000, 'cap': 1000},
    {'id': 'agr-004', 'name': 'Local bakery, no cap', 'supplier': 'Hearth Bakers', 'status': 'Paused', 'used': 84, 'cap': None},
  ],
  # state-flip series for agreement 1 (video: Open -> Near the limit -> Full)
  'flip': {'open': 1250, 'near': 4300, 'full': 5000},
}
OUT.write_text(json.dumps(data, indent=1) + '\n')
print('wrote', OUT)
