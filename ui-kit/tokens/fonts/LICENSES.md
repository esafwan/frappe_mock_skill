# Font licences

| Files | Family | Licence | Source |
|---|---|---|---|
| `Inter-*.woff2`, `InterVariable*.woff2` | Inter (Rasmus Andersson) | SIL Open Font License 1.1 | https://github.com/rsms/inter |
| `geist-*-latin-*.woff2` | Geist / Geist Mono (Vercel) | SIL Open Font License 1.1 | https://github.com/vercel/geist-font (via @fontsource) |

Both licences allow bundling and redistribution with software and use in rendered videos; the fonts may not be sold on their own.
HUF itself declares Apple system fonts (SF Pro / SF Mono), which are not redistributable; the `huf` system substitutes Inter and Geist Mono
(`tokens/css/huf/huf-fonts.css`). KaTeX fonts copied by `scripts/huf/tokens.mjs` into `tokens/huf/fonts/` are MIT licensed (https://github.com/KaTeX/KaTeX).
