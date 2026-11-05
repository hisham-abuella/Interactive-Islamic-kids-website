# Fonts for the print editions

`Amiri-Regular.ttf` and `Amiri-Bold.ttf` are the official Amiri 1.003 release, unmodified and not
subset, from https://github.com/aliftype/amiri/releases/tag/1.003 (`Amiri-1.003.zip`).
They are licensed under the SIL Open Font License 1.1 (`OFL.txt`, shipped alongside as the licence
requires).

sha256:
- Amiri-Regular.ttf  cd2550c0f4c05eb341bf97958211aaa39382bca96577ba3a67d4a3b4912c43c0
- Amiri-Bold.ttf     8cfed49b66de57e360ac61631d882dddfa23095d3ddb39fc2133eaf93892e79a

Why self-hosted: Google Fonts serves Amiri as unicode-range subsets. The space is in the Latin
subset and the Quranic pause marks (U+06D6, U+06D7, U+06DA) are in the Arabic one, so Chrome
found no single face for "space + mark" and printed those marks in Geeza Pro. The full font
has every glyph in one face. `tools/make-print.js` loads these files for all scripture and,
through a `unicode-range: U+FDFA` face, for every ﷺ.
