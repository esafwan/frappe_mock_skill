# Loyal Arrow extension (mock kit)
Content pack to make videos of the Loyal Arrow app with the exact UI via this kit and tridz_document_engine. All data is SYNTHETIC (phones use `+0000000NNNN`).

- `brand/` app identity, PWA theme tokens (from app source), per-store themes, placeholder logo (no real logo in repo yet).
- `structure/` sidebar, 10 workspaces, 26 reports, extracted from loyal_arrow@8725e1d (`integration/master-2`).
- `copy/` on-screen strings, taglines (en/ar/hi/ml), 33 WhatsApp templates (exact bodies).
- `data/` `gen_data.py` (deterministic) -> `uae-dubai-supermarket/` (AED, VAT 5%, en+ar) and `india-departmental-store/` (INR, GST, en+hi+ml): 40 SKUs, 60 members (6 Platinum/16 Gold/38 Silver), 200 bills, 10 referral pairs, WhatsApp previews.
- `flows/` six flow scripts with real routes and `data-testid` selectors.
- `docs/VIDEO_INTEGRATION_PLAN.md` what to build next for tridz_document_engine.

Known gaps: no "quick score" screen exists in the app source (closest: member PWA Home balance + QR card); counter and member PWA CSS are not yet captured as kit systems; WhatsApp bubble component missing; `method-otp` id and desk selectors are unverified.
