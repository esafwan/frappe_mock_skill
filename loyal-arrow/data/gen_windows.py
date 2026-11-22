#!/usr/bin/env python3
"""Deterministic synthetic retail festival windows -> data/<region>/windows.json (no clocks, no randomness)."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
# key, name_en, name_ar, year, region, starts, ends, lead_days, kind
W = [
 ("diwali",     "Diwali",         "ديوالي",              2027, "India", "2027-10-27", "2027-10-31", 14),
 ("onam",       "Onam",           "أونام",               2027, "India", "2027-09-03", "2027-09-13", 10),
 ("bts",        "Back To School", "العودة إلى المدارس",  2027, "GCC",   "2027-08-15", "2027-09-15", 10),
 ("eid_adha",   "Eid Al Adha",    "عيد الأضحى",          2027, "GCC",   "2027-05-16", "2027-05-19", 7),
 ("eid_fitr",   "Eid Al Fitr",    "عيد الفطر",           2027, "GCC",   "2027-03-09", "2027-03-11", 7),
 ("ramadan",    "Ramadan",        "رمضان",               2027, "GCC",   "2027-02-08", "2027-03-08", 10),
 ("pongal",     "Pongal",         "بونغال",              2027, "India", "2027-01-13", "2027-01-16", 7),
 ("dsf",        "Dsf",            "مهرجان التسوق",       2026, "GCC",   "2026-12-04", "2027-01-10", 10),
 ("diwali",     "Diwali",         "ديوالي",              2026, "India", "2026-11-06", "2026-11-10", 14),
]
rows = [dict(key=k, name_en=e, name_ar=a, year=y, region=r, starts=s, ends=en, lead_days=l, kind="Festival", confirmed=False) for k, e, a, y, r, s, en, l in W]
for reg in ("uae-dubai-supermarket", "india-departmental-store"):
    with open(os.path.join(D, reg, "windows.json"), "w") as f:
        json.dump({"synthetic": True, "region_ar": {"GCC": "دول الخليج", "India": "الهند"}, "rows": rows}, f, indent=1, ensure_ascii=False); f.write("\n")
